class AddKeyToEditorContentValues < ActiveRecord::Migration[4.2]
  def change
    add_column :editor_content_values, :key, :string
  end
end
