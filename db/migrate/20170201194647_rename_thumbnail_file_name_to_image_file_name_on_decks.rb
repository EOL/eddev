class RenameThumbnailFileNameToImageFileNameOnDecks < ActiveRecord::Migration
  def change
    rename_column :decks, :thumbnail_file_name, :image_file_name
  end
end
