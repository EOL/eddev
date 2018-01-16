class AddHumanNameToLessonPlans < ActiveRecord::Migration[4.2]
  def change
    add_column :lesson_plans, :human_name, :string
  end
end
