class ChangeNameToTitleAddSubtitleToDecks < ActiveRecord::Migration[4.2]
  def change
    rename_column :decks, :name_key, :title_key
    add_column :decks, :subtitle_key, :string
  end
end
