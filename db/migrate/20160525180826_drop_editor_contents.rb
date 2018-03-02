class DropEditorContents < ActiveRecord::Migration[4.2]
  def change
    drop_table :editor_contents
  end
end
