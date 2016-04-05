class AddCaptionToGalleryPhotos < ActiveRecord::Migration
  def change
    add_column :gallery_photos, :caption, :string
  end
end
