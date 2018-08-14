class RemoveEolPageIdFromPodcasts < ActiveRecord::Migration[5.1]
  def change
    remove_column :podcasts, :eol_page_id
  end
end
