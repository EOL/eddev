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

ActiveRecord::Schema.define(version: 20170914105746) do

  create_table "content_model_states", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "content_model_id"
    t.string   "content_model_type"
    t.integer  "editor_content_version"
    t.boolean  "published"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.string   "locale",                 limit: 5
    t.index ["content_model_id", "content_model_type", "locale"], name: "unique_index_content_model_and_locale", unique: true, using: :btree
    t.index ["content_model_type", "content_model_id"], name: "index_content_model", using: :btree
  end

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

  create_table "editor_contents", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.text     "value",                  limit: 65535
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.integer  "version"
    t.integer  "content_model_state_id"
    t.string   "key"
    t.index ["content_model_state_id"], name: "index_editor_contents_on_content_model_state_id", using: :btree
  end

  create_table "galleries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
    t.index ["user_id"], name: "index_galleries_on_user_id", using: :btree
  end

  create_table "gallery_photos", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "caption"
    t.integer  "gallery_id"
    t.string   "rights_holder"
    t.string   "source"
    t.integer  "license_id"
    t.index ["gallery_id"], name: "index_gallery_photos_on_gallery_id", using: :btree
    t.index ["license_id"], name: "index_gallery_photos_on_license_id", using: :btree
  end

  create_table "habitats", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "place_id"
    t.index ["name"], name: "index_habitats_on_name", unique: true, using: :btree
    t.index ["place_id"], name: "index_habitats_on_place_id", using: :btree
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

  create_table "licenses", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "code"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "translation_key"
    t.index ["code"], name: "index_licenses_on_code", unique: true, using: :btree
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

  create_table "place_permissions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer  "place_id"
    t.integer  "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
    t.index ["place_id", "user_id"], name: "index_place_user_id_unique", unique: true, using: :btree
    t.index ["place_id"], name: "index_place_permissions_on_place_id", using: :btree
    t.index ["user_id"], name: "index_place_permissions_on_user_id", using: :btree
  end

  create_table "places", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "name"
    t.index ["name"], name: "index_places_on_name", unique: true, using: :btree
  end

  create_table "single_page_content_models", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_single_page_content_models_on_name", unique: true, using: :btree
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

  add_foreign_key "editor_contents", "content_model_states"
  add_foreign_key "galleries", "users"
  add_foreign_key "gallery_photos", "galleries"
  add_foreign_key "gallery_photos", "licenses"
  add_foreign_key "habitats", "places"
  add_foreign_key "password_reset_tokens", "users"
  add_foreign_key "place_permissions", "places"
  add_foreign_key "place_permissions", "users"
end
