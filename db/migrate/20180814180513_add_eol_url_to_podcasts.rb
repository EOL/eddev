class AddEolUrlToPodcasts < ActiveRecord::Migration[5.1]
  def change
    add_column :podcasts, :eol_url, :string
  end
end
