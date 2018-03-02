class CreateLicenses < ActiveRecord::Migration[4.2]
  def change
    create_table :licenses do |t|
      t.string :name
      t.string :code
      t.text :description

      t.timestamps null: false
    end
  end
end
