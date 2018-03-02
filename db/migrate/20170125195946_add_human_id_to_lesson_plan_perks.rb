class AddHumanIdToLessonPlanPerks < ActiveRecord::Migration[4.2]
  def change
    add_column :lesson_plan_perks, :human_name, :string
  end
end
