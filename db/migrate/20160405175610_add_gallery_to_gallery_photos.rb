class AddGalleryToGalleryPhotos < ActiveRecord::Migration
  def change
    add_reference :gallery_photos, :gallery, index: true, foreign_key: true
  end
end
