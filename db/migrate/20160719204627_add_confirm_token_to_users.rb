class AddConfirmTokenToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :confirm_token, :string
  end
end
