class AddPlaceToHabitats < ActiveRecord::Migration
  def change
    add_reference :habitats, :place, index: true, foreign_key: true
  end
end
