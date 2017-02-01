class ChangeNameToTitleAddSubtitleToDecks < ActiveRecord::Migration
  def change
    rename_column :decks, :name_key, :title_key
    add_column :decks, :subtitle_key, :string
  end
end
