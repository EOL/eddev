FactoryGirl.define do
  factory :legacy_user do
    user_name "MyString"
    full_name "MyString"
    email "MyString"
  end

  factory :legacy_user_with_api_key, class: LegacyUser do
    user_name "MyString"
    full_name "MyString"
    email "MyString"
    api_key "api_key_1234"
  end
end
