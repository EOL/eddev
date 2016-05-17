class Place < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  has_many :habitats

  def h1_key
  	return "places_h1_#{id}"
  end
end
