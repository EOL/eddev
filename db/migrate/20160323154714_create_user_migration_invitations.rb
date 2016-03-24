class CreateUserMigrationInvitations < ActiveRecord::Migration
  def change
    create_table :user_migration_invitations do |t|

      t.timestamps null: false
    end
  end
end
