class ChangePageNameToNameSinglePageContentModels < ActiveRecord::Migration[4.2]
  def change
    rename_column :single_page_content_models, :page_name, :name
  end
end
