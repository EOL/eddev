class EarthTour < ApplicationRecord
  validates_presence_of :title_key
  validates_presence_of :desc_key
  validates_presence_of :embed_url
end
