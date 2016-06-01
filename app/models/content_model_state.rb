class ContentModelState < ActiveRecord::Base
  belongs_to :content_model, polymorphic: true

  validates_presence_of :content_model
  validates_presence_of :published
  validates_presence_of :editor_content_version
end
