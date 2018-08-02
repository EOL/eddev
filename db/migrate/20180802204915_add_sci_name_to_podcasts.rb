class AddSciNameToPodcasts < ActiveRecord::Migration[5.1]
  def change
    add_column :podcasts, :sci_name, :string
  end
end
