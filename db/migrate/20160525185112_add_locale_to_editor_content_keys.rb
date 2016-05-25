class AddLocaleToEditorContentKeys < ActiveRecord::Migration
  def change
    add_column :editor_content_keys, :locale, :string, limit: 5
  end
end
