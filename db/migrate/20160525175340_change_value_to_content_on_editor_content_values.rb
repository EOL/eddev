class ChangeValueToContentOnEditorContentValues < ActiveRecord::Migration
  def change
    rename_column :editor_content_values, :value, :content
  end
end
