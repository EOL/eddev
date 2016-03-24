class ChangeForceExpirationToDefaultToFalse < ActiveRecord::Migration
  def change
    change_column :user_migration_invitations, :force_expiration, :boolean, :null => false, :default => false
  end
end
