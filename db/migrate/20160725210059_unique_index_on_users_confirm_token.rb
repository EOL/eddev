class UniqueIndexOnUsersConfirmToken < ActiveRecord::Migration[4.2]
  def change
    add_index :users, :confirm_token, :unique => true
  end
end
