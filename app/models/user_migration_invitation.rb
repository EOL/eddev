class UserMigrationInvitation < ActiveRecord::Base
  belongs_to :legacy_user

  validates :token, presence: true
  validates :legacy_user_id, presence: true

  after_initialize :generate_token

  def expired?
    force_expiration  
  end

  def self.find_by_token!(token)
    invitation = self.find_by!(token: token)
    raise ActiveRecord::RecordNotFound if invitation.expired?
    return invitation
  end

  private
    # Don't allow token to be overwritten
    def token=(token)
      write_attribute :token, token
    end

    # Generate a new token for all new records
    def generate_token
      if new_record?
        self.token = SecureRandom.uuid
      end
    end
end
