class AddHumanNameToLessonPlanThemes < ActiveRecord::Migration
  def change
    add_column :lesson_plan_themes, :human_name, :string
  end
end
