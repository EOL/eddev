class AddExtraLinkToEarthTours < ActiveRecord::Migration[5.1]
  def change
    add_column :earth_tours, :extra_link_key, :string
    add_column :earth_tours, :extra_link_url, :string
  end
end
