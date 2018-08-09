class RemoveGroupFromPodcastCategories < ActiveRecord::Migration[5.1]
  def change
    remove_column :podcast_categories, :group
  end
end
