class EditorContent < ActiveRecord::Base
  validates_presence_of :locale, :key, :value
  before_update :prevent_update # Never update EditorContent - we use an append-only model to save revision history

  validates :key, format: { without: /\s/ }

  belongs_to :editor_content_owner, polymorphic: true 

  def copy(new_key) 
    EditorContent.new(key: new_key, value: value, locale: locale)
  end

  def copy_to_owner(content_owner) 
    EditorContent.new(key: key, value: value, locale: locale, editor_content_owner: content_owner)
  end

  private
  def prevent_update
    false
  end
end
