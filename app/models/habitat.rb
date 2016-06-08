class Habitat < ActiveRecord::Base
  include ContentModel 

  belongs_to :place

  validates :name, presence: true, uniqueness: true
  validates_presence_of :place_id

  def self.all_ordered_alpha_with_place
    includes(:place).order('places.name').order(:name)
  end
end
