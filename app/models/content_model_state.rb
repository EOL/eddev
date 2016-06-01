class ContentModelState < ActiveRecord::Base
  belongs_to :content_model, polymorphic: true

  validates_presence_of :content_model
  validates :published, :inclusion => { :in => [true, false] }
  validates_presence_of :editor_content_version

  after_initialize :set_defaults, :unless => :persisted?

  private
  def set_defaults
    self.published = false if published.nil?
    self.editor_content_version = 0 if editor_content_version.nil?
  end
end
