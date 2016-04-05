class AddUserToGalleryPhotos < ActiveRecord::Migration
  def change
    add_reference :gallery_photos, :user, index: true, foreign_key: true
  end
end
