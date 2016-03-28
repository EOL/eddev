class UserMigrationInvitation < ActiveRecord::Base
  belongs_to :legacy_user

  validates :token, presence: true
  validates :legacy_user_id, presence: true

  after_initialize :generate_token

  TTL=1.day
  private_constant :TTL

  # It proved to be cleaner to use dependency injection than 
  # class_double...as_stubbed_const for testing expired?
  attr_writer :time_provider 

  def expired?
    force_expiration || (time_provider.now > created_at + TTL) 
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

    def time_provider
      @time_provider ||= Time 
    end
end
