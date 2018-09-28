class AddLengthSecondsToPodcasts < ActiveRecord::Migration[5.1]
  def change
    add_column :podcasts, :length_seconds, :integer
  end
end
