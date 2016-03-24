TOKEN_LENGTH = 36

FactoryGirl.define do
  factory :user_migration_invitation do
    association :legacy_user
  end
end
