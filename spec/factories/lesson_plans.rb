FactoryGirl.define do
  factory :lesson_plan do
    association :theme, :factory => :lesson_plan_theme
    name_key "MyString"
    objective_keys ["MyString"]
    desc_key "MyString"
    file_name "MyString"
    overview_file_name "MyString"
  end
end
