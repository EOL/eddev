class EditorContentValuesRenameContentToValue < ActiveRecord::Migration
  def change
    rename_column :editor_content_values, :content, :value
  end
end
