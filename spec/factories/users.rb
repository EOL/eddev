FactoryGirl.define do
  factory :user do
    full_name             "Site User"
    email                 "email@emailprovider.com"
    user_name             "siteuser"
    password              "abcd1234"
    password_confirmation "abcd1234"
  end

  factory :user2 do
    full_name             "Site User2"
    email                 "email2@emailprovider.com"
    user_name             "siteuser2"
    password              "abcd1234"
    password_confirmation "abcd1234"
  end
end
