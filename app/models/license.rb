# Creative commons license
class License < ActiveRecord::Base
  validates :code, presence: true, uniqueness: true
  validates :translation_key, presence: true

  has_many :gallery_photos
end
