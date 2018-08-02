class CreatePodcasts < ActiveRecord::Migration[5.1]
  def change
    create_table :podcasts do |t|
      t.string :title
      t.text :description
      t.string :image_file_name
      t.string :audio_file_name
      t.integer :eol_page_id
      t.string :lesson_plan_url
      t.integer :perm_id

      t.timestamps
    end
  end
end
