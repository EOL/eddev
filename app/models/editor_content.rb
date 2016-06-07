class EditorContent < ActiveRecord::Base
  belongs_to :content_model_state

  validates_presence_of :key
  validates_presence_of :value
  validates_presence_of :content_model_state
  validates_associated :content_model_state
  validates :version, :presence => true, 
    :numericality => { :greater_than_or_equal_to => 0 }

  before_update :prevent_update

  private
  def prevent_update
    false
  end
end
