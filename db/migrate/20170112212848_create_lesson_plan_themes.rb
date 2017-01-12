class CreateLessonPlanThemes < ActiveRecord::Migration
  def change
    create_table :lesson_plan_themes do |t|
      t.string :name_key
      t.string :icon_file

      t.timestamps null: false
    end
  end
end
