class EditorContentValue < ActiveRecord::Base
  validates_presence_of :value
  before_update :prevent_update

  belongs_to :editor_content_key

  private
  def prevent_update
    false
  end
end
