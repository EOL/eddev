FactoryGirl.define do
  factory :user do
    full_name             "Site User"
    email                 "email@emailprovider.com"
    user_name             "siteuser"
    password              "abcd1234"
    password_confirmation "abcd1234"
  end

  factory :admin_user, class: User do
    full_name             "Admin User"
    email                 "adminuser@email.com"
    user_name             "admin_user"
    password              "abcd1234" 
    password_confirmation "abcd1234" 
    role                  :admin
  end
end
