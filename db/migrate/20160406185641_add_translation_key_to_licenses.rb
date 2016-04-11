class AddTranslationKeyToLicenses < ActiveRecord::Migration
  def change
    add_column :licenses, :translation_key, :string
  end
end
