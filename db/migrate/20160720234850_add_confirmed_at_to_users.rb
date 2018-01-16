class AddConfirmedAtToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :confirmed_at, :timestamp
  end
end
