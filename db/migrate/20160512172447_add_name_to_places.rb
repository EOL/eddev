class AddNameToPlaces < ActiveRecord::Migration[4.2]
  def change
    add_column :places, :name, :string
  end
end
