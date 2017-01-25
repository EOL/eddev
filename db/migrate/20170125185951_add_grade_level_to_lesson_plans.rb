class AddGradeLevelToLessonPlans < ActiveRecord::Migration
  def change
    change_table :lesson_plans do |t|
      t.references :grade_level, :references => :lesson_plan_grade_levels, :index => true
    end
  end
end
