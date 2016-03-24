class AddApiKeyToLegacyUsers < ActiveRecord::Migration
  def change
    add_column :legacy_users, :api_key, :string
  end
end
