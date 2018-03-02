class AddLegacyIdToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :legacy_id, :integer
  end
end
