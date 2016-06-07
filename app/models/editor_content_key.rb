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
    return @latest_value if @latest_value

    latest_valid_value = editor_content_values
      .where(:version => 0..content_model_state.editor_content_version)
      .last

    @latest_value = latest_valid_value.nil? ? name : latest_valid_value.content
  end

  def latest_draft_value
    return editor_content_values.empty? ? name : editor_content_values.last.content
  end

  def create_value!(content)
    editor_content_values.create!(:content => content, :version => version_for_new_values)
  end

  def content_model_state
    raise "Cannot call content_model_state when locale is nil" unless locale

    content_model.state_for_locale(locale)
  end

  # Class methods
  def self.find_or_create!(options)
    base_options = HashWithIndifferentAccess.new(name: nil, locale: nil)

    # If content_model is set, don't set defaults for these attributes since they will
    # result in duplicate query parameters
    if !options.key?(:content_model)
      base_options.merge!({content_model_id: nil, content_model_type: nil}) 
    end

    base_options.merge!(options) 
    self.where(base_options).first_or_create!
  end

  private
  def version_for_new_values
    content_model_state.editor_content_version + 1
  end
end
