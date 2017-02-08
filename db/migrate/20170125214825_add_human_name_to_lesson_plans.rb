class AddHumanNameToLessonPlans < ActiveRecord::Migration
  def change
    add_column :lesson_plans, :human_name, :string
  end
end
