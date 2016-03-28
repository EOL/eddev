# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy1@email.com")
  .find_or_create_by!(user_name: "legacy")
UserMigrationInvitation.find_or_create_by!(legacy_user: legacy)

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy2@email.com")
  .find_or_create_by!(user_name: "legacy2")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy3@email.com")
  .find_or_create_by!(user_name: "legacy3")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy4@email.com")
  .find_or_create_by!(user_name: "legacy4")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy5@email.com")
  .find_or_create_by!(user_name: "legacy5")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy6@email.com")
  .find_or_create_by!(user_name: "legacy6")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy7@email.com")
  .find_or_create_by!(user_name: "legacy7")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy8@email.com")
  .find_or_create_by!(user_name: "legacy8")

legacy = LegacyUser.create_with(full_name: "Legacy User", email: "legacy9@email.com")
  .find_or_create_by!(user_name: "legacy9")
