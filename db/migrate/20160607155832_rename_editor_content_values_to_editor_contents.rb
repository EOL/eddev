class RenameEditorContentValuesToEditorContents < ActiveRecord::Migration[4.2]
  def change
    rename_table :editor_content_values, :editor_contents
  end
end
