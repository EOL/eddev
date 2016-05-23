class AddEditorContentOwnerIdAndTypeToEditorContents < ActiveRecord::Migration
  def change
    add_column :editor_contents, :editor_content_owner_id, :integer
    add_column :editor_contents, :editor_content_owner_type, :string

    add_index :editor_contents, :editor_content_owner_id
  end
end
