class AddCharacterLimitToLocaleOnEditorContents < ActiveRecord::Migration
  def change
    change_column :editor_contents, :locale, :string, limit: 5
  end
end
