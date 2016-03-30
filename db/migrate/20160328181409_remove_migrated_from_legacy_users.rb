class RemoveMigratedFromLegacyUsers < ActiveRecord::Migration
  def up
    remove_column :legacy_users, :migrated
  end

  def down
    add_column :legacy_users, :migrated, :boolean
  end
end
