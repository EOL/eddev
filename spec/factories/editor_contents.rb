FactoryGirl.define do
  factory :editor_content do
    key "MyString"
    value "MyText"
    content_model_state
    version 1
  end
end
