class CreateLessonPlans < ActiveRecord::Migration
  def change
    create_table :lesson_plans do |t|
      t.references :theme, :references => :lesson_plan_themes, :index => true
      t.string :name_key
      t.string :objective_keys
      t.string :desc_key
      t.string :file_name
      t.integer :guide_id
      t.string :external_url

      t.timestamps null: false
    end
  end
end
