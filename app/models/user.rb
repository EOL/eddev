require "unix_crypt"

class User < ApplicationRecord
  ##########################################################
  # DO NOT ALTER MAPPINGS - ONLY ADD NEW ONES AS NECESSARY #
  ##########################################################
  enum :role => {
    :basic => 0,
    :admin => 1,
  }

  has_secure_password :validations => false

  # Constants used in view for HTML5 pattern validation
  PASSWORD_MIN_LENGTH = 6
  validates :password, :length => { minimum: PASSWORD_MIN_LENGTH },
                       :confirmation => true,
                       :if => :validate_password?

  validates :password_confirmation, :presence => true,
                                    :unless => :password_blank?

  USER_NAME_PATTERN = "[a-zA-Z0-9\.@_]+"
  validates :user_name, :presence => true,
                        :uniqueness => true,
                        :format => { :with =>/\A#{USER_NAME_PATTERN}\z/ }

  validates :email, :presence => true
  validates :full_name, :presence => true
  validates :confirm_token, :presence => true, :uniqueness => true
  validates :role, :presence => true

  has_many :password_reset_tokens

  before_validation :set_confirm_token
  before_validation :set_default_role

  attr_accessor :force_password_validation

  def locale
    saved_locale = read_attribute(:locale)
    if saved_locale
      saved_locale
    else
      I18n.default_locale
    end
  end

  # Set confirmed_at to the current time and save
  def confirm!
    if confirmed_at
      raise "User already confirmed"
    end

    self.confirmed_at = DateTime.now
    save!
  end

  def confirmed?
    confirmed_at.present?
  end

  # Hack to allow controllers to add current_password errors, for
  # example, when requiring the user's current password when changing
  # it.
  def current_password
    nil
  end

  private
  def validate_password?
    force_password_validation || !persisted? || !password.blank?
  end

  def password_blank?
    password.blank?
  end

  def set_confirm_token
    self.confirm_token ||= SecureRandom.base64
  end

  def set_default_role
    self.role ||= :basic
  end
end

