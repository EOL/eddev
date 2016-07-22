FactoryGirl.define do
  factory :password_reset_token do
    association :user
    token "MyString"
  end
end
