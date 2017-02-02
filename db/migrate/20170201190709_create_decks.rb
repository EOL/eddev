class CreateDecks < ActiveRecord::Migration
  def change
    create_table :decks do |t|
      t.string :human_name
      t.string :file_name
      t.string :thumbnail_file_name
      t.string :name_key
      t.string :desc_key

      t.timestamps null: false
    end
  end
end
