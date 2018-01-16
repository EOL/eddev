class AddUniqueIndexToPlacePermissions < ActiveRecord::Migration[4.2]
  def change
    add_index :place_permissions, [:place_id, :user_id], :unique => true, :name => "index_place_user_id_unique"
  end
end
