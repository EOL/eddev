class ChangePageNameToNameSinglePageContentModels < ActiveRecord::Migration
  def change
    rename_column :single_page_content_models, :page_name, :name
  end
end
