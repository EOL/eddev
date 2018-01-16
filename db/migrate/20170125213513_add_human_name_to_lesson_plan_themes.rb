class AddHumanNameToLessonPlanThemes < ActiveRecord::Migration[4.2]
  def change
    add_column :lesson_plan_themes, :human_name, :string
  end
end
