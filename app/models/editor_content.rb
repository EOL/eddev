class EditorContent < ActiveRecord::Base
  before_validation :set_locale
  validates_presence_of :locale, :key, :value
  before_update :prevent_update

  private
  def set_locale
    self.locale = I18n.locale
  end

  def prevent_update
    false
  end
end
