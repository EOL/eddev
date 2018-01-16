class CreatePasswordResetTokens < ActiveRecord::Migration[4.2]
  def change
    create_table :password_reset_tokens do |t|
      t.references :user, index: true, foreign_key: true
      t.string :token
      t.timestamp :used_at

      t.timestamps null: false
    end
  end
end
