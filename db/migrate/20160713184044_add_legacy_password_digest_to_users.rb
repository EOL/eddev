class AddLegacyPasswordDigestToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :legacy_password_digest, :string
  end
end
