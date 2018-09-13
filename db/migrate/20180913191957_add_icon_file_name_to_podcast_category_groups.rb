class AddIconFileNameToPodcastCategoryGroups < ActiveRecord::Migration[5.1]
  def change
    add_column :podcast_category_groups, :icon_file_name, :string
  end
end
