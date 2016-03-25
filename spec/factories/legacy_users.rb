FactoryGirl.define do
  factory :legacy_user do
    user_name "username"
    full_name "Full Name"
    email "email@email.com"
  end

  factory :legacy_user_with_api_key, class: LegacyUser do
    user_name "User Name"
    full_name "Full Name"
    email "email@email.com"
    api_key "api_key_1234"
  end
end
