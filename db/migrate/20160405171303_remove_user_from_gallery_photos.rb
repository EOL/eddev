class RemoveUserFromGalleryPhotos < ActiveRecord::Migration
  def up
    remove_reference :gallery_photos, :user, foreign_key: true
  end

  def down
    add_reference :gallery_photos, :user, foreign_key: true
  end
end
