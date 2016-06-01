class Place < ActiveRecord::Base
  include ContentModel

  validates :name, presence: true, uniqueness: true
  has_many :habitats
end
