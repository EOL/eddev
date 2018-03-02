class AddRequiredFieldsToGalleryPhotos < ActiveRecord::Migration[4.2]
  def change
    change_table :gallery_photos do |t|
      t.string :rights_holder
      t.string :source
    end
  end
end
