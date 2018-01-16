class AddCaptionToGalleryPhotos < ActiveRecord::Migration[4.2]
  def change
    add_column :gallery_photos, :caption, :string
  end
end
