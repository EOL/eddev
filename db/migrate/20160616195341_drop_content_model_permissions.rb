class DropContentModelPermissions < ActiveRecord::Migration
  def change
    drop_table :content_model_permissions
  end
end
