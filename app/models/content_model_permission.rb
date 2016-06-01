class ContentModelPermission < ActiveRecord::Base
  belongs_to :user
  belongs_to :content_model, polymorphic: true

  validates_presence_of :user
  validates_presence_of :content_model
  validates_presence_of :role

  enum :role => {
    :admin  => 0,
    :editor => 1,
  }
end
