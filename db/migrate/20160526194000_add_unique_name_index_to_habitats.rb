class AddUniqueNameIndexToHabitats < ActiveRecord::Migration[4.2]
  def change
    add_index :habitats, :name, :unique => true
  end
end
