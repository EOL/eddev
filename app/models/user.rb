class User < ActiveRecord::Base
  validates :password, presence: true, length: { minimum: 8 }
  validates :user_name, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :full_name, presence: true

  has_secure_password
end
