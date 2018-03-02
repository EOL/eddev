class ChangeTypeToRoleOnContentModelPermissions < ActiveRecord::Migration[4.2]
  def change
    rename_column :content_model_permissions, :type, :role
  end
end
