class RenameTypeToRoleOnPlacePermissions < ActiveRecord::Migration
  def change
    rename_column :place_permissions, :type, :role
  end
end
