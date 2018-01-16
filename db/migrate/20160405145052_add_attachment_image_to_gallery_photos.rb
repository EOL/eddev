class AddAttachmentImageToGalleryPhotos < ActiveRecord::Migration[4.2]
  def self.up
    change_table :gallery_photos do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :gallery_photos, :image
  end
end
