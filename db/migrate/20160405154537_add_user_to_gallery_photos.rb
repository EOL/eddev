class AddUserToGalleryPhotos < ActiveRecord::Migration[4.2]
  def change
    add_reference :gallery_photos, :user, index: true, foreign_key: true
  end
end
