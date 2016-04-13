class EditorContent < ActiveRecord::Base
  validates_presence_of :locale, :key, :value
  before_update :prevent_update

  validates :key, format: { without: /\s/ }

  private
  def prevent_update
    false
  end
end
