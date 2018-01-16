class AddForceExpirationToPasswordResetTokens < ActiveRecord::Migration[4.2]
  def change
    add_column :password_reset_tokens, :force_expiration, :boolean
  end
end
