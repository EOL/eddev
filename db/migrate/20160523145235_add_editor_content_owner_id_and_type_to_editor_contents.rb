class AddEditorContentOwnerIdAndTypeToEditorContents < ActiveRecord::Migration[4.2]
  def change
    add_column :editor_contents, :editor_content_owner_id, :integer
    add_column :editor_contents, :editor_content_owner_type, :string

    add_index :editor_contents, :editor_content_owner_id
  end
end
