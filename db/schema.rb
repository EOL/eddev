# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20170201194647) do

  create_table "content_model_states", force: :cascade do |t|
    t.integer  "content_model_id",       limit: 4
    t.string   "content_model_type",     limit: 255
    t.integer  "editor_content_version", limit: 4
    t.boolean  "published"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.string   "locale",                 limit: 5
  end

  add_index "content_model_states", ["content_model_id", "content_model_type", "locale"], name: "unique_index_content_model_and_locale", unique: true, using: :btree
  add_index "content_model_states", ["content_model_type", "content_model_id"], name: "index_content_model", using: :btree

  create_table "decks", force: :cascade do |t|
    t.string   "human_name",      limit: 255
    t.string   "file_name",       limit: 255
    t.string   "image_file_name", limit: 255
    t.string   "title_key",       limit: 255
    t.string   "desc_key",        limit: 255
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "subtitle_key",    limit: 255
  end

  create_table "editor_contents", force: :cascade do |t|
    t.text     "value",                  limit: 65535
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.integer  "version",                limit: 4
    t.integer  "content_model_state_id", limit: 4
    t.string   "key",                    limit: 255
  end

  add_index "editor_contents", ["content_model_state_id"], name: "index_editor_contents_on_content_model_state_id", using: :btree

  create_table "galleries", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "user_id",    limit: 4
  end

  add_index "galleries", ["user_id"], name: "index_galleries_on_user_id", using: :btree

  create_table "gallery_photos", force: :cascade do |t|
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "image_file_name",    limit: 255
    t.string   "image_content_type", limit: 255
    t.integer  "image_file_size",    limit: 4
    t.datetime "image_updated_at"
    t.string   "caption",            limit: 255
    t.integer  "gallery_id",         limit: 4
    t.string   "rights_holder",      limit: 255
    t.string   "source",             limit: 255
    t.integer  "license_id",         limit: 4
  end

  add_index "gallery_photos", ["gallery_id"], name: "index_gallery_photos_on_gallery_id", using: :btree
  add_index "gallery_photos", ["license_id"], name: "index_gallery_photos_on_license_id", using: :btree

  create_table "habitats", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "place_id",   limit: 4
  end

  add_index "habitats", ["name"], name: "index_habitats_on_name", unique: true, using: :btree
  add_index "habitats", ["place_id"], name: "index_habitats_on_place_id", using: :btree

  create_table "lesson_plan_grade_levels", force: :cascade do |t|
    t.string   "name_key",   limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "human_name", limit: 255
  end

  create_table "lesson_plan_perks", force: :cascade do |t|
    t.string   "name_key",   limit: 255
    t.string   "icon_name",  limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "human_name", limit: 255
  end

  create_table "lesson_plan_themes", force: :cascade do |t|
    t.string   "name_key",   limit: 255
    t.string   "icon_file",  limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "human_name", limit: 255
  end

  create_table "lesson_plans", force: :cascade do |t|
    t.integer  "theme_id",           limit: 4
    t.string   "name_key",           limit: 255
    t.string   "objective_keys",     limit: 255
    t.string   "desc_key",           limit: 255
    t.string   "file_name",          limit: 255
    t.string   "external_url",       limit: 255
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "overview_file_name", limit: 255
    t.integer  "grade_level_id",     limit: 4
    t.string   "human_name",         limit: 255
  end

  add_index "lesson_plans", ["grade_level_id"], name: "index_lesson_plans_on_grade_level_id", using: :btree
  add_index "lesson_plans", ["theme_id"], name: "index_lesson_plans_on_theme_id", using: :btree

  create_table "lesson_plans_lesson_plan_perks", force: :cascade do |t|
    t.integer "lesson_plan_id",      limit: 4
    t.integer "lesson_plan_perk_id", limit: 4
  end

  create_table "licenses", force: :cascade do |t|
    t.string   "code",            limit: 255
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "translation_key", limit: 255
  end

  add_index "licenses", ["code"], name: "index_licenses_on_code", unique: true, using: :btree

  create_table "password_reset_tokens", force: :cascade do |t|
    t.integer  "user_id",          limit: 4
    t.string   "token",            limit: 255
    t.datetime "used_at"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.boolean  "force_expiration"
  end

  add_index "password_reset_tokens", ["token"], name: "index_password_reset_tokens_on_token_unique", unique: true, using: :btree
  add_index "password_reset_tokens", ["user_id"], name: "index_password_reset_tokens_on_user_id", using: :btree

  create_table "place_permissions", force: :cascade do |t|
    t.integer  "place_id",   limit: 4
    t.integer  "role",       limit: 4
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "user_id",    limit: 4
  end

  add_index "place_permissions", ["place_id", "user_id"], name: "index_place_user_id_unique", unique: true, using: :btree
  add_index "place_permissions", ["place_id"], name: "index_place_permissions_on_place_id", using: :btree
  add_index "place_permissions", ["user_id"], name: "index_place_permissions_on_user_id", using: :btree

  create_table "places", force: :cascade do |t|
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "name",       limit: 255
  end

  add_index "places", ["name"], name: "index_places_on_name", unique: true, using: :btree

  create_table "single_page_content_models", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "single_page_content_models", ["name"], name: "index_single_page_content_models_on_name", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255
    t.string   "user_name",              limit: 255
    t.string   "full_name",              limit: 255
    t.string   "api_key",                limit: 255
    t.string   "password_digest",        limit: 255
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.string   "locale",                 limit: 255
    t.integer  "role",                   limit: 4,   default: 0
    t.string   "legacy_password_digest", limit: 255
    t.integer  "legacy_id",              limit: 4
    t.string   "confirm_token",          limit: 255
    t.datetime "confirmed_at"
  end

  add_index "users", ["confirm_token"], name: "index_users_on_confirm_token", unique: true, using: :btree
  add_index "users", ["user_name"], name: "index_users_on_user_name", unique: true, using: :btree

  add_foreign_key "editor_contents", "content_model_states"
  add_foreign_key "galleries", "users"
  add_foreign_key "gallery_photos", "galleries"
  add_foreign_key "gallery_photos", "licenses"
  add_foreign_key "habitats", "places"
  add_foreign_key "password_reset_tokens", "users"
  add_foreign_key "place_permissions", "places"
  add_foreign_key "place_permissions", "users"
end
