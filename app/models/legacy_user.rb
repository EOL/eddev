class LegacyUser < ActiveRecord::Base
  validates :email, presence: true
  validates :full_name, presence: true
  validates :user_name, presence: true
end
