class AddUniqueIndexToEditorContentKey < ActiveRecord::Migration[4.2]
  def change
    add_index :editor_content_keys, [:name, :locale, :content_model_id, :content_model_type], :unique => true, :name => "index_all_cols_unique"
  end
end
