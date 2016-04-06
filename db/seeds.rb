# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

License.create_with(code: "CC BY", 
                    description: "This license lets others distribute, remix, tweak, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.")
  .find_or_create_by!(name: "Attribution")
License.create_with(code: "CC BY-SA",
                    description: "This license lets others remix, tweak, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects.")
  .find_or_create_by!(name: "Attribution-ShareAlike")
License.create_with(code: "CC BY-NC",
                    description: "This license lets others remix, tweak, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.")
  .find_or_create_by!(name: "Attribution-NonCommercial")

License.create_with(code: "CC BY-NC-SA",
                    description: "This license lets others remix, tweak, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.")
  .find_or_create_by!(name: "Attribution-NonCommercial-ShareAlike")


# Basic/admin user accounts (development only)
case Rails.env
when "development"
  User.create_with(full_name: "Basic User",
                   email: "basicuser@fakeemail.com",
                   password: "pass1234",
                   password_confirmation: "pass1234",
                   active: true)
      .find_or_create_by!(user_name: "basic")

  User.create_with(full_name: "Admin User",
                   email: "adminuser@fakeemail.com",
                   password: "pass1234",
                   password_confirmation: "pass1234",
                   active: true)
      .find_or_create_by!(user_name: "admin")
end
