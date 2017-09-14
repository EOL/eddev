# Represents a user permission record for a Place.
class PlacePermission < ApplicationRecord
  belongs_to :place
  belongs_to :user

  validates_presence_of :user
  validates_uniqueness_of :user_id, :scope => :place_id
  validates_presence_of :place
  validates_presence_of :role

  enum :role => {
    :editor => 0,
    :owner  => 1,
  }
end
