class CreatePodcastCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :podcast_categories do |t|
      t.integer :perm_id
      t.string :name
      t.integer :group

      t.timestamps
    end
  end
end
