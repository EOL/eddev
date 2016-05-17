class EditorContent < ActiveRecord::Base
  validates_presence_of :locale, :key, :value
  before_update :prevent_update # Never update EditorContent - we use an append-only model to save revision history

  validates :key, format: { without: /\s/ }

  private
  def prevent_update
    false
  end
end
