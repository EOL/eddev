class CreateLegacyUsers < ActiveRecord::Migration
  def change
    create_table :legacy_users do |t|
      t.string :user_name
      t.string :full_name
      t.string :email
      t.boolean :migrated

      t.timestamps null: false
    end
  end
end
