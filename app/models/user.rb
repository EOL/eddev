class User < ActiveRecord::Base
  enum role: { basic: 0, admin: 1 }

  validates :password, presence: true, length: { minimum: 8 }, :if => :password_required?
  validates :user_name, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :full_name, presence: true

  # This is subject to race conditions since it doesn't have a corresponding database
  # constraint. In practice, it should be good enough.
  validate :uniqueness_against_legacy_users

  has_one :legacy_user

  has_secure_password

  def locale
    saved_locale = read_attribute(:locale)
    if saved_locale
      saved_locale
    else
      I18n.default_locale
    end
  end

  private
  # Validate that certain attributes are not already taken by
  # a LegacyUser, or that that LegacyUser is this User's legacy_user.
  # This is to ensure that all LegacyUsers can be migrated to valid Users.
  def uniqueness_against_legacy_users
    validate_attrib_against_legacy_users(:email)
    validate_attrib_against_legacy_users(:user_name)
  end

  def validate_attrib_against_legacy_users(attrib_name)
    attrib = self.attributes[attrib_name.to_s]

    if attrib
      legacy = LegacyUser.find_by(attrib_name => attrib)

      # The only legacy user that can share attrib is this record's
      if legacy && legacy != legacy_user
        errors.add(attrib_name, "cannot be the same as a LegacyUser that is not associated with this User")
      end
    end
  end

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
