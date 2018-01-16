class AddCharacterLimitToLocaleOnEditorContents < ActiveRecord::Migration[4.2]
  def change
    change_column :editor_contents, :locale, :string, limit: 5
  end
end
