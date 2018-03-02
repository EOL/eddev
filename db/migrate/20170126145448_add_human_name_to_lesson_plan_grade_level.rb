class AddHumanNameToLessonPlanGradeLevel < ActiveRecord::Migration[4.2]
  def change
    add_column :lesson_plan_grade_levels, :human_name, :string
  end
end
