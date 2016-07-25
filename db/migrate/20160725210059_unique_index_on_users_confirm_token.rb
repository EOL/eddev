class UniqueIndexOnUsersConfirmToken < ActiveRecord::Migration
  def change
    add_index :users, :confirm_token, :unique => true
  end
end
