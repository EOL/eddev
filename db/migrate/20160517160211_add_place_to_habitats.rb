class AddPlaceToHabitats < ActiveRecord::Migration[4.2]
  def change
    add_reference :habitats, :place, index: true, foreign_key: true
  end
end
