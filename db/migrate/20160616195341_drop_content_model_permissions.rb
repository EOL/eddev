class DropContentModelPermissions < ActiveRecord::Migration[4.2]
  def change
    drop_table :content_model_permissions
  end
end
