class ChangeValueToContentOnEditorContentValues < ActiveRecord::Migration[4.2]
  def change
    rename_column :editor_content_values, :value, :content
  end
end
