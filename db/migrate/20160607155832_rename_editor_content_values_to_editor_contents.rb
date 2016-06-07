class RenameEditorContentValuesToEditorContents < ActiveRecord::Migration
  def change
    rename_table :editor_content_values, :editor_contents
  end
end
