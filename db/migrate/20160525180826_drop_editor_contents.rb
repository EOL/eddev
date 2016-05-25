class DropEditorContents < ActiveRecord::Migration
  def change
    drop_table :editor_contents
  end
end
