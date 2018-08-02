class CreatePodcastsToCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :podcasts_to_categories do |t|
      t.integer :podcast_id
      t.integer :podcast_category_id
    end
  end
end
