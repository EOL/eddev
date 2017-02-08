class AddHumanIdToLessonPlanPerks < ActiveRecord::Migration
  def change
    add_column :lesson_plan_perks, :human_name, :string
  end
end
