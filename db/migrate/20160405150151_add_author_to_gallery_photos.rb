class AddAuthorToGalleryPhotos < ActiveRecord::Migration
  def change
    add_column :gallery_photos, :author, :string
  end
end
