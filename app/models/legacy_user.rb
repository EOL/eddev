class LegacyUser < ActiveRecord::Base
  validates :email, presence: true
  validates :full_name, presence: true
  validates :user_name, presence: true

  has_many :user_migration_invitations
  
  belongs_to :user
end
