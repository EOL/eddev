class CreateLessonPlansLessonPlanPerks < ActiveRecord::Migration
  def change
    create_table :lesson_plans_lesson_plan_perks do |t|
      t.references :lesson_plan
      t.references :lesson_plan_perk
    end
  end
end
