class CreatePodcastImages < ActiveRecord::Migration[5.1]
  def change
    create_table :podcast_images do |t|
      t.string :file_name
      t.string :author
      t.string :license
      t.integer :podcast_id
      t.timestamps
    end
  end
end
