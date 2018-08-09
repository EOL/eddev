class CreatePodcastCategoryGroups < ActiveRecord::Migration[5.1]
  def change
    create_table :podcast_category_groups do |t|
      t.string :name
      t.timestamps
    end
  end
end
