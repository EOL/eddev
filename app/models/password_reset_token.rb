class PasswordResetToken < ActiveRecord::Base
  belongs_to :user
  validates :user,  :presence   => true
  validates :token, :presence   => true,
                    :uniqueness => true

  TTL = 1.day

  class << self
    def create_for_user(user)
      # expire any old tokens
      old_tokens = where(:user => user, :used_at => nil, :force_expiration => nil)

      old_tokens.each do |token|
        token.update!(:force_expiration => true)
      end

      self.create!(:user => user, :token => SecureRandom.base64)
    end
  end

  def mark_used
    self.update!(:used_at => DateTime.now)
  end

  def expired?
    force_expiration || used_at.present? || Time.now - created_at > TTL
  end
end
