class AddPrecisionToPasswordResetTokenUsedAt < ActiveRecord::Migration[5.0]
  def change
    change_column :password_reset_tokens, :used_at, :datetime, :precision => 6
  end
end
