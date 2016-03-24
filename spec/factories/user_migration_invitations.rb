FactoryGirl.define do
  factory :user_migration_invitation do
    legacy_user
  end

  factory :user_migration_invitation_with_api_key, class: UserMigrationInvitation do
    association :legacy_user, factory: :legacy_user_with_api_key
  end
end
