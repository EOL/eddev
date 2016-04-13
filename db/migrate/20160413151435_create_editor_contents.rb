class CreateEditorContents < ActiveRecord::Migration
  def change
    create_table :editor_contents do |t|
      t.string :key
      t.text :value
      t.string :locale

      t.timestamps null: false
    end
  end
end
