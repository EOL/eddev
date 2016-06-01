class ChangeTypeToRoleOnContentModelPermissions < ActiveRecord::Migration
  def change
    rename_column :content_model_permissions, :type, :role
  end
end
