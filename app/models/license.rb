# Creative commons license
class License < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  validates :code, presence: true, uniqueness: true
  validates :description, presence: true

  has_many :gallery_photos
end
