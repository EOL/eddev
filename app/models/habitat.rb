class Habitat < ActiveRecord::Base
  include EditorContentHelper

  validates :name, presence: true, uniqueness: true
  has_and_belongs_to_many :places

  def h1_key
  	return "habitat_h1_#{id}"
  end

  def copy
  	new_habitat = Habitat.new(name: "#{name} copy")

  	# Copy over EditorContents
  	copy_value_if_exists(h1_key, new_habitat.h1_key)

  	return new_habitat
  end
end
