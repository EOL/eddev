class AddVersionToEditorContentValues < ActiveRecord::Migration[4.2]
  def change
    add_column :editor_content_values, :version, :integer
  end
end
