class CreateContentModelPermissions < ActiveRecord::Migration[4.2]
  def change
    create_table :content_model_permissions do |t|
      t.references :user, index: true, foreign_key: true
      t.references :content_model, polymorphic: true, index: { name: "index_content_model" }
      t.integer :type

      t.timestamps null: false
    end
  end
end
