# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170914110758) do

  create_table "decks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "human_name"
    t.string   "file_name"
    t.string   "image_file_name"
    t.string   "title_key"
    t.string   "desc_key"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "subtitle_key"
  end

  create_table "lesson_plan_grade_levels", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name_key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "human_name"
  end

  create_table "lesson_plan_perks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name_key"
    t.string   "icon_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "human_name"
  end

  create_table "lesson_plan_themes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name_key"
    t.string   "icon_file"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "human_name"
  end

  create_table "lesson_plans", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "theme_id"
    t.string   "name_key"
    t.string   "objective_keys"
    t.string   "desc_key"
    t.string   "file_name"
    t.string   "external_url"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "overview_file_name"
    t.integer  "grade_level_id"
    t.string   "human_name"
    t.index ["grade_level_id"], name: "index_lesson_plans_on_grade_level_id", using: :btree
    t.index ["theme_id"], name: "index_lesson_plans_on_theme_id", using: :btree
  end

  create_table "lesson_plans_lesson_plan_perks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer "lesson_plan_id"
    t.integer "lesson_plan_perk_id"
  end

  create_table "password_reset_tokens", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "user_id"
    t.string   "token"
    t.datetime "used_at",          precision: 6
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.boolean  "force_expiration"
    t.index ["token"], name: "index_password_reset_tokens_on_token_unique", unique: true, using: :btree
    t.index ["user_id"], name: "index_password_reset_tokens_on_user_id", using: :btree
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "email"
    t.string   "user_name"
    t.string   "full_name"
    t.string   "api_key"
    t.string   "password_digest"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.string   "locale"
    t.integer  "role",                   default: 0
    t.string   "legacy_password_digest"
    t.integer  "legacy_id"
    t.string   "confirm_token"
    t.datetime "confirmed_at"
    t.index ["confirm_token"], name: "index_users_on_confirm_token", unique: true, using: :btree
    t.index ["user_name"], name: "index_users_on_user_name", unique: true, using: :btree
  end

  add_foreign_key "password_reset_tokens", "users"
end
