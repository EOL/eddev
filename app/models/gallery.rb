class Gallery < ApplicationRecord
  validates_presence_of :user

  belongs_to :user
  has_many :photos, class_name: GalleryPhoto
end
