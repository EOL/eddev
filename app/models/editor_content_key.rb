class EditorContentKey < ActiveRecord::Base
  belongs_to :content_model, polymorphic: true

  validates :name, 
    presence: true, 
    uniqueness: { scope: [:content_model_type, :content_model_id, :locale], case_sensitive: false },
    format: { without: /\s/ }
  validates_presence_of :content_model
  validates_presence_of :locale

  has_many :editor_content_values

  # Instance methods
  def latest_value
    editor_content_values.empty? ? name : editor_content_values.last.content
  end

  def build_value(content)
    EditorContentValue.new(:editor_content_key => self, :content => content)
  end

  def content_model_state
    raise "Cannot call content_model_state when locale is nil" unless locale

    content_model.state_for_locale(locale)
  end

  # Class methods
  def self.find_or_create(options)
    base_options = HashWithIndifferentAccess.new(name: nil, locale: nil)

    # If content_model is set, don't set defaults for these attributes since they will
    # result in duplicate query parameters
    if !options.key?(:content_model)
      base_options.merge!({content_model_id: nil, content_model_type: nil}) 
    end

    base_options.merge!(options) 
    self.where(base_options).first_or_create
  end
end
