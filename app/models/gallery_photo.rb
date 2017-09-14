class GalleryPhoto < ApplicationRecord
  has_attached_file :image
  validates :image, attachment_presence: true
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
  validates_presence_of :caption
  validates_presence_of :gallery
  validates_presence_of :rights_holder
  validates_presence_of :source
  validates_presence_of :license

  belongs_to :gallery
  belongs_to :license
end
