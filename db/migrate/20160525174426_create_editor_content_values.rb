class CreateEditorContentValues < ActiveRecord::Migration[4.2]
  def change
    create_table :editor_content_values do |t|
      t.references :editor_content_key, index: true, foreign_key: true
      t.text :value

      t.timestamps null: false
    end
  end
end
