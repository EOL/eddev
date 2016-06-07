class DropEditorContentKeys < ActiveRecord::Migration
  def change
    drop_table :editor_content_keys
  end
end
