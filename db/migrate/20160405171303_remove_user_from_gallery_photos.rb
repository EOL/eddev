class RemoveUserFromGalleryPhotos < ActiveRecord::Migration[4.2]
  def up
    remove_reference :gallery_photos, :user, foreign_key: true
  end

  def down
    add_reference :gallery_photos, :user, foreign_key: true
  end
end
