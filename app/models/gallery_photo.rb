class GalleryPhoto < ActiveRecord::Base
  has_attached_file :image
  validates :image, attachment_presence: true 
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
  validates_presence_of :author
  validates_presence_of :caption
end
