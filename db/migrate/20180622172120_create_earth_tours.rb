class CreateEarthTours < ActiveRecord::Migration[5.1]
  def change
    create_table :earth_tours do |t|
      t.string :title_key
      t.string :desc_key
      t.string :embed_url

      t.timestamps
    end
  end
end
