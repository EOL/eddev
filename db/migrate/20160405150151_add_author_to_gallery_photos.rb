class AddAuthorToGalleryPhotos < ActiveRecord::Migration[4.2]
  def change
    add_column :gallery_photos, :author, :string
  end
end
