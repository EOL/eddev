class AddLicenseToGalleryPhotos < ActiveRecord::Migration
  def change
    add_reference :gallery_photos, :license, index: true, foreign_key: true
  end
end
