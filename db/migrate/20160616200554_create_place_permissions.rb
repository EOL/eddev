class CreatePlacePermissions < ActiveRecord::Migration[4.2]
  def change
    create_table :place_permissions do |t|
      t.references :place, index: true, foreign_key: true
      t.integer :type

      t.timestamps null: false
    end
  end
end
