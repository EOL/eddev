module ContentModel 
  extend ActiveSupport::Concern
  
  included do 
    has_many :content_model_states, :as => :content_model, :dependent => :destroy
    validates :name, :presence => true, :uniqueness => true

    supplies_edit_permissions_with :default_edit_permissions
  end

  class_methods do
    def supplies_edit_permissions_with(method)
      @permission_method = method
    end

    def permission_method
      @permission_method
    end
  end

  COPY_LOCALE_CONTENTS_QUERY = <<-SQL
    SELECT ec.key,
           ec.value,
           maxes.locale
    FROM editor_contents AS ec
         JOIN (SELECT ec.key,
                      states.id AS state_id,
                      states.locale,
                      MAX(ec.version) AS max_version
              FROM editor_contents AS ec
                   JOIN (SELECT id,
                                editor_content_version,
                                locale
                        FROM content_model_states 
                        WHERE locale IN ( ? )
                              AND content_model_id = ?
                              AND content_model_type = ?) states
                    ON ec.content_model_state_id = states.id
              WHERE ec.version <= states.editor_content_version
              GROUP BY ec.key, 
                       states.id,
                       states.locale) maxes
        ON  ec.key = maxes.key
            AND ec.version = maxes.max_version
            AND ec.content_model_state_id = maxes.state_id
  SQL

  COPY_LOCALE_CONTENTS_PS = 
    ActiveRecord::Base.connection.raw_connection.prepare(COPY_LOCALE_CONTENTS_QUERY)

  def state_for_locale(locale)
    states = content_model_states.where(:locale => locale).limit(1)
    
    if !states.empty?
      states[0]
    else
      content_model_states.create!(:locale => locale)
    end
  end

  def state_for_cur_locale
    state_for_locale(I18n.locale)
  end

  def states_by_locale
    # Build hash locale => state for states that already exist
    available_locale_states = content_model_states.where(:locale => I18n.available_locales)

    states_by_locale = HashWithIndifferentAccess.new
    available_locale_states.each do |state|
      states_by_locale[state.locale] = state
    end

    # Create states for the missing locales
    missing_locales = []

    I18n.available_locales.each do |locale|
      if !states_by_locale[locale]
        missing_locales.push(locale)
      end
    end

    if !missing_locales.empty?
      ContentModelState.transaction do
        missing_locales.each do |locale|
          states_by_locale[locale] = state_for_locale(locale)
        end
      end
    end

    states_by_locale
  end

  # Array of locales for which there exist published content, in alphabetical order
  def locales_with_content
    content_model_states.joins(:editor_contents)
      .where("editor_contents.version <= content_model_states.editor_content_version")
      .order(:locale => :asc)
      .distinct.pluck(:locale)
  end

  def copy_locale_contents(content_model, locales)
    result = COPY_LOCALE_CONTENTS_PS.execute(locales, id, self.class.name)

    self.transaction do 
      result.each do |row|
        key    = row[0]
        value  = row[1]
        locale = row[2] 

        content_model.state_for_locale(locale).create_content!(key, value)
      end
    end
  end

  def can_be_edited_by?(user)
    if !user
      return false
    end

    if user.admin?
      return true
    end

    send(self.class.permission_method, user)
  end
  
  def published_in_cur_locale?
    published_in_locale?(I18n.locale)
  end

  def published_in_locale?(locale)
    return false if !self.persisted?
    state_for_locale(locale).published? 
  end

  def published_locales
    content_model_states.where(:published => true).pluck(:locale)
  end

  private
    # Override with supplies_edit_permissions_with :override_method
    def default_edit_permissions(user)
      false
    end
end
