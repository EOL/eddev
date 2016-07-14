require "unix_crypt"

class User < ActiveRecord::Base
  enum :role => { 
    :basic => 0, 
    :admin => 1,
  }

  validates :password, :presence => true, 
                       :length => { minimum: 8 }, 
                       :confirmation => true,
                       :if => :password_validation_required?
  validates :password_confirmation, :presence => true,
                                    :if => :password_confirmation_required?
  validates :user_name, :presence => true, :uniqueness => true
  validates :email, :presence => true, :uniqueness => true
  validates :full_name, :presence => true

  has_many :galleries, :dependent => :destroy
  has_many :place_permissions, :dependent => :destroy

  has_secure_password :validations => false

  LEGACY_SALT = Rails.application.config.x.legacy_password_salt
  DIGEST_START_INDEX = LEGACY_SALT.length + 4 # UnixCrypt::MD5 digests are of the form '$1$<LEGACY_SALT>$<DIGEST>'

  def locale
    saved_locale = read_attribute(:locale)
    if saved_locale
      saved_locale
    else
      I18n.default_locale
    end
  end

  def authenticate(password)
    # A user should either have a password_digest or a legacy_password_digest 
    # (enforced by validations). If neither are present, return nil and log an error.
    if password_digest
      super(password) # defined in bcrypt
    elsif legacy_password_digest
      digest = UnixCrypt::MD5.build(password, LEGACY_SALT)[DIGEST_START_INDEX..-1]

      if digest == legacy_password_digest # auth success
        if self.update(:password => password, :password_confirmation => password)
          Rails.logger.info("Successfully migrated password for user #{id}/#{user_name}")
        else
          Rails.logger.error("Failed to migrate password for user #{id}/#{user_name}")
        end
        
        return self
      else # auth failure
        return nil
      end
    else
      Rails.logger.error("User #{self.id} does not have a password_digest or legacy_password_digest")
      return nil
    end
  end

  private
  def password_validation_required?
    (legacy_password_digest.blank? && !persisted?) || !password.blank?
  end

  def password_confirmation_required?
    !password.blank?
  end
end
