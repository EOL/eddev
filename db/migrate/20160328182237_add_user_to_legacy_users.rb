class AddUserToLegacyUsers < ActiveRecord::Migration
  def change
    add_reference :legacy_users, :user, index: {unique: true}, foreign_key: true
  end
end
