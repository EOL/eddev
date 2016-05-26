class EditorContentValue < ActiveRecord::Base
  belongs_to :editor_content_key

  validates_presence_of :content
  validates_presence_of :editor_content_key
  validates_associated :editor_content_key

  before_update :prevent_update

  private
  def prevent_update
    false
  end
end
