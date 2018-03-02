class CreateGalleryPhotos < ActiveRecord::Migration[4.2]
  def change
    create_table :gallery_photos do |t|

      t.timestamps null: false
    end
  end
end
