class CreateLessonPlanGradeLevels < ActiveRecord::Migration[4.2]
  def change
    create_table :lesson_plan_grade_levels do |t|
      t.string :name_key

      t.timestamps null: false
    end
  end
end
