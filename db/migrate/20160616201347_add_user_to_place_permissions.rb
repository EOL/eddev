class AddUserToPlacePermissions < ActiveRecord::Migration
  def change
    add_reference :place_permissions, :user, index: true, foreign_key: true
  end
end
