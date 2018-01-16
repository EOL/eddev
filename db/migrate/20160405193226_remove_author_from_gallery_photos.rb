class RemoveAuthorFromGalleryPhotos < ActiveRecord::Migration[4.2]
  def up
    remove_column :gallery_photos, :author
  end

  def down
    add_column :gallery_photos, :author, :string
  end
end
