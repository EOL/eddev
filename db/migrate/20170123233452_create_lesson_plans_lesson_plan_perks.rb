class CreateLessonPlansLessonPlanPerks < ActiveRecord::Migration[4.2]
  def change
    create_table :lesson_plans_lesson_plan_perks do |t|
      t.references :lesson_plan
      t.references :lesson_plan_perk
    end
  end
end
