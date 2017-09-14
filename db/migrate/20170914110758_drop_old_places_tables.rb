class DropOldPlacesTables < ActiveRecord::Migration[5.0]
  def change
    drop_table :editor_contents
    drop_table :content_model_states
    drop_table :gallery_photos
    drop_table :galleries
    drop_table :habitats
    drop_table :licenses
    drop_table :place_permissions
    drop_table :places
    drop_table :single_page_content_models
  end
end
