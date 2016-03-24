class AddLegacyUserToUserMigrationInvitations < ActiveRecord::Migration
  def change
    add_reference :user_migration_invitations, :legacy_user, index: true, foreign_key: true
  end
end
