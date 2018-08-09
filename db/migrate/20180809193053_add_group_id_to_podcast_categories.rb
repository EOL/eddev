class AddGroupIdToPodcastCategories < ActiveRecord::Migration[5.1]
  def change
    add_column :podcast_categories, :group_id, :integer
  end
end
