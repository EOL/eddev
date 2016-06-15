class Place < ActiveRecord::Base
  include ContentModel

  has_many :habitats, :dependent => :destroy
end
