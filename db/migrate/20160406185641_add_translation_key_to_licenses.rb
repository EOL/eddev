class AddTranslationKeyToLicenses < ActiveRecord::Migration[4.2]
  def change
    add_column :licenses, :translation_key, :string
  end
end
