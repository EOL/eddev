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

ActiveRecord::Schema.define(version: 20160525175340) do

  create_table "editor_content_keys", force: :cascade do |t|
    t.string   "name",               limit: 255
    t.integer  "content_model_id",   limit: 4
    t.string   "content_model_type", limit: 255
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  add_index "editor_content_keys", ["content_model_type", "content_model_id"], name: "content_model_index", using: :btree

  create_table "editor_content_values", force: :cascade do |t|
    t.integer  "editor_content_key_id", limit: 4
    t.text     "content",               limit: 65535
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "editor_content_values", ["editor_content_key_id"], name: "index_editor_content_values_on_editor_content_key_id", using: :btree

  create_table "editor_contents", force: :cascade do |t|
    t.string   "key",                       limit: 255
    t.text     "value",                     limit: 65535
    t.string   "locale",                    limit: 5
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.integer  "editor_content_owner_id",   limit: 4
    t.string   "editor_content_owner_type", limit: 255
  end

  add_index "editor_contents", ["editor_content_owner_id"], name: "index_editor_contents_on_editor_content_owner_id", using: :btree

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

  add_index "habitats", ["place_id"], name: "index_habitats_on_place_id", using: :btree

  create_table "legacy_users", force: :cascade do |t|
    t.string   "user_name",  limit: 255
    t.string   "full_name",  limit: 255
    t.string   "email",      limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "api_key",    limit: 255
    t.integer  "user_id",    limit: 4
  end

  add_index "legacy_users", ["user_id"], name: "index_legacy_users_on_user_id", unique: true, using: :btree

  create_table "licenses", force: :cascade do |t|
    t.string   "code",            limit: 255
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "translation_key", limit: 255
  end

  add_index "licenses", ["code"], name: "index_licenses_on_code", unique: true, using: :btree

  create_table "places", force: :cascade do |t|
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "name",       limit: 255
  end

  create_table "user_migration_invitations", force: :cascade do |t|
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.string   "token",            limit: 255
    t.integer  "legacy_user_id",   limit: 4
    t.boolean  "force_expiration",             default: false, null: false
  end

  add_index "user_migration_invitations", ["legacy_user_id"], name: "index_user_migration_invitations_on_legacy_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",           limit: 255
    t.string   "user_name",       limit: 255
    t.string   "full_name",       limit: 255
    t.string   "api_key",         limit: 255
    t.string   "password_digest", limit: 255
    t.boolean  "active"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.integer  "legacy_user_id",  limit: 4
    t.string   "locale",          limit: 255
    t.integer  "role",            limit: 4,   default: 0
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["legacy_user_id"], name: "index_users_on_legacy_user_id", using: :btree
  add_index "users", ["user_name"], name: "index_users_on_user_name", unique: true, using: :btree

  add_foreign_key "editor_content_values", "editor_content_keys"
  add_foreign_key "galleries", "users"
  add_foreign_key "gallery_photos", "galleries"
  add_foreign_key "gallery_photos", "licenses"
  add_foreign_key "habitats", "places"
  add_foreign_key "legacy_users", "users"
  add_foreign_key "user_migration_invitations", "legacy_users"
  add_foreign_key "users", "legacy_users"
end
