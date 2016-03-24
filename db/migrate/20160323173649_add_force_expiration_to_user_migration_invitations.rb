class AddForceExpirationToUserMigrationInvitations < ActiveRecord::Migration
  def change
    add_column :user_migration_invitations, :force_expiration, :boolean
  end
end
