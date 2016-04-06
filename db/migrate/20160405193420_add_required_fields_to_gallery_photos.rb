class AddRequiredFieldsToGalleryPhotos < ActiveRecord::Migration
  def change
    change_table :gallery_photos do |t|
      t.string :rights_holder
      t.string :source
    end
  end
end
