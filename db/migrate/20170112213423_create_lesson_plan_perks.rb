class CreateLessonPlanPerks < ActiveRecord::Migration
  def change
    create_table :lesson_plan_perks do |t|
      t.string :name_key
      t.string :icon_name

      t.timestamps null: false
    end
  end
end
