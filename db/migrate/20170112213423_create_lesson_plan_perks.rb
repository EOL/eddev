class CreateLessonPlanPerks < ActiveRecord::Migration[4.2]
  def change
    create_table :lesson_plan_perks do |t|
      t.string :name_key
      t.string :icon_name

      t.timestamps null: false
    end
  end
end
