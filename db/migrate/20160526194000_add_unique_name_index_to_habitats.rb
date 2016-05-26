class AddUniqueNameIndexToHabitats < ActiveRecord::Migration
  def change
    add_index :habitats, :name, :unique => true
  end
end
