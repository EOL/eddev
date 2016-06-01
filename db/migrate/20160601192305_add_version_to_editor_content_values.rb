class AddVersionToEditorContentValues < ActiveRecord::Migration
  def change
    add_column :editor_content_values, :version, :integer
  end
end
