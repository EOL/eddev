class ChangeGuideIdToGuideFileOnLessonPlans < ActiveRecord::Migration[4.2]
  def change
    change_table :lesson_plans do |t|
      t.remove :guide_id
      t.string :overview_file_name
    end
  end
end
