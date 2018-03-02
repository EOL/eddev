class DropEditorContentKeys < ActiveRecord::Migration[4.2]
  def change
    drop_table :editor_content_keys
  end
end
