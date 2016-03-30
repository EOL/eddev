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

ActiveRecord::Schema.define(version: 20160328182237) do

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
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "legacy_user_id",  limit: 4
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["legacy_user_id"], name: "index_users_on_legacy_user_id", using: :btree
  add_index "users", ["user_name"], name: "index_users_on_user_name", unique: true, using: :btree

  add_foreign_key "legacy_users", "users"
  add_foreign_key "user_migration_invitations", "legacy_users"
  add_foreign_key "users", "legacy_users"
end
