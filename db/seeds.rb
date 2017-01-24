# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

#License.create_with(code: "CC BY").find_or_create_by!(translation_key: "attrib")
#License.create_with(code: "CC BY-SA").find_or_create_by!(translation_key: "attrib_share")
#License.create_with(code: "CC BY-NC").find_or_create_by!(translation_key: "attrib_noncom")
#License.create_with(code: "CC BY-NC-SA").find_or_create_by!(translation_key: "attrib_noncom_share")
#
#SinglePageContentModel.find_or_create_by!(name: "tinymce_test")
#
## Basic/admin user accounts (development only)
#case Rails.env
#when "development"
#  User.create_with(full_name: "Basic User",
#                   email: "basicuser@fakeemail.com",
#                   password: "pass1234",
#                   password_confirmation: "pass1234",
#                   active: true)
#      .find_or_create_by!(user_name: "basic")
#
#  User.create_with(full_name: "Admin User",
#                   email: "adminuser@fakeemail.com",
#                   password: "pass1234",
#                   password_confirmation: "pass1234",
#                   active: true,
#                   role: 'admin')
#      .find_or_create_by!(user_name: "admin")
#end

LessonPlanPerk.delete_all
LessonPlanPerk.create([
  {
    :name_key => "species_cards",
    :icon_name => "card",
  },
  {
    :name_key => "bio_stats",
    :icon_name => "stats",
  },
  {
    :name_key => "field_work",
    :icon_name => "tree",
  }
])

#  create_table "lesson_plan_themes", force: :cascade do |t|
#    t.string   "name_key",   limit: 255
#    t.string   "icon_file",  limit: 255
#    t.datetime "created_at",             null: false
#    t.datetime "updated_at",             null: false
#  end
LessonPlanTheme.delete_all
LessonPlanTheme.create([
  {
    :name_key => "classification",
    :icon_file => "classification_icon.jpg",
  },    
  {
    :name_key => "science_skills",
    :icon_file => "science_skills_icon.jpg",
  },   
  {
    :name_key => "human_impact",
    :icon_file => "human_impact_icon.jpg",
  },
  {
    :name_key => "adaptations",
    :icon_file => "adaptations_icon.jpg",
  }, 
  {
    :name_key => "energy_flow",
    :icon_file => "energy_flow_icon.jpg",
  }
])
