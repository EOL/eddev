class AddForceExpirationToPasswordResetTokens < ActiveRecord::Migration
  def change
    add_column :password_reset_tokens, :force_expiration, :boolean
  end
end
