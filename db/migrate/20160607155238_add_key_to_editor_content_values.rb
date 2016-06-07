class AddKeyToEditorContentValues < ActiveRecord::Migration
  def change
    add_column :editor_content_values, :key, :string
  end
end
