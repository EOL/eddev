class AddUniqueIndexToPasswordResetTokensToken < ActiveRecord::Migration[4.2]
  def change
    add_index :password_reset_tokens, :token, :unique => true, :name => "index_password_reset_tokens_on_token_unique"
  end
end
