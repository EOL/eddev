class EditorContentKey < ActiveRecord::Base
  belongs_to :content_model, polymorphic: true

  validates :name, 
    presence: true, 
    uniqueness: { scope: [:content_model_type, :content_model_id], case_sensitive: false },
    format: { without: /\s/ }
  validates_presence_of :content_model
  validates_presence_of :locale

  has_many :editor_content_values

  def latest_value
    editor_content_values.empty? ? name : editor_content_values.last.content
  end
end
