class CreateSinglePageContentModels < ActiveRecord::Migration[4.2]
  def change
    create_table :single_page_content_models do |t|
      t.string :page_name
      t.index :page_name, :unique => true
      t.timestamps null: false
    end
  end
end
