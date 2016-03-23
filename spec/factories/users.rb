FactoryGirl.define do
  factory :user do
    full_name             "Site User"
    email                 "email@emailprovider.com"
    user_name             "siteuser"
    password              "abcd1234"
    password_confirmation "abcd1234"
  end
end
