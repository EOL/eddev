module ContentModel
  extend ActiveSupport::Concern
  
  included do 
    has_many :editor_content_keys, :as => :content_model
    has_many :content_model_states, :as => :content_model
  end

  def state_for_locale(locale)
    states = content_model_states.where(:locale => locale).limit(1)
    
    if !states.empty?
      states[0]
    else
      content_model_states.create!(:locale => locale)
    end
  end

  def publish_draft(locale)
    state = state_for_locale(locale)
    state.editor_content_version += 1
    state.save!
  end

  # Array of locales for which there exists published content, in alphabetical order
  def locales_with_content
    keys = editor_content_keys.group(:locale).order(:locale)
    keys.collect { |c| c.locale }
  end
end
