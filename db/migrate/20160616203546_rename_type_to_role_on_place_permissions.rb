class RenameTypeToRoleOnPlacePermissions < ActiveRecord::Migration[4.2]
  def change
    rename_column :place_permissions, :type, :role
  end
end
