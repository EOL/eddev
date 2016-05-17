class DropHabitatsPlaces < ActiveRecord::Migration
  def change
    drop_table :habitats_places
  end
end
