class CreateHabitatsPlaces < ActiveRecord::Migration[4.2]
  def change
    create_table :habitats_places do |t|
      t.references :habitat, index: true, foreign_key: true
      t.references :place, index: true, foreign_key: true
    end
  end
end
