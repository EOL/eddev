class AddDescToPodcastCategories < ActiveRecord::Migration[5.1]
  def change
    add_column :podcast_categories, :desc, :text
  end
end
