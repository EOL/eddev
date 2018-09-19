class ChangePodcastsPermIdToString < ActiveRecord::Migration[5.1]
  def change
    change_column :podcasts, :perm_id, :string
  end
end
