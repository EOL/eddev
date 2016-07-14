class DropLegacyUsers < ActiveRecord::Migration
  def change
    drop_table :user_migration_invitations
    remove_foreign_key :users, :legacy_user
    remove_column :users, :legacy_user_id
    drop_table :legacy_users
  end
end
