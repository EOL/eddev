class EditorContentValuesRenameContentToValue < ActiveRecord::Migration[4.2]
  def change
    rename_column :editor_content_values, :content, :value
  end
end
