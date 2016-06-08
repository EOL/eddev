FactoryGirl.define do
  factory :content_model_state do
    locale "en"
    association :content_model, :factory => :habitat
    editor_content_version 1
    published false
  end
end
