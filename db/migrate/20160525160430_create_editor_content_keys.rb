class CreateEditorContentKeys < ActiveRecord::Migration[4.2]
  def change
    create_table :editor_content_keys do |t|
      t.string :name
      t.references :content_model, polymorphic: true

      t.index [:content_model_type, :content_model_id], unique: false, name: 'content_model_index'

      t.timestamps null: false
    end
  end
end
