class ChangeGuideIdToGuideFileOnLessonPlans < ActiveRecord::Migration
  def change
    change_table :lesson_plans do |t|
      t.remove :guide_id
      t.string :overview_file_name
    end
  end
end
