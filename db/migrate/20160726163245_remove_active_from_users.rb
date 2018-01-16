class RemoveActiveFromUsers < ActiveRecord::Migration[4.2]
  def change
    remove_column :users, :active
  end
end
