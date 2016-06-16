class PlacePermission < ActiveRecord::Base
  belongs_to :place

  validates_presence_of :place
  validates_presence_of :type

  enum :type => { 
    :editor => 0,
    :owner  => 1,
  }
end
