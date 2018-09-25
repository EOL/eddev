class AddTitleToPodcastImages < ActiveRecord::Migration[5.1]
  def change
    add_column :podcast_images, :title, :string
  end
end
