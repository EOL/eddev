class AddTokenToUserMigrationInvitations < ActiveRecord::Migration
  def change
    add_column :user_migration_invitations, :token, :string
  end
end
