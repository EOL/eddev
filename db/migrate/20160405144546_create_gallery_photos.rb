class CreateGalleryPhotos < ActiveRecord::Migration
  def change
    create_table :gallery_photos do |t|

      t.timestamps null: false
    end
  end
end
