module ContentModel
  extend ActiveSupport::Concern
  
  included do 
    has_many :content_model_states, :as => :content_model
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

  # Array of locales for which there exists published content, in alphabetical order
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
end
