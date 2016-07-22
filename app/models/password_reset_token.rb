class PasswordResetToken < ActiveRecord::Base
  belongs_to :user
  validates :user,  :presence   => true
  validates :token, :presence   => true,
                    :uniqueness => true

  class << self
    def create_for_user(user)
      self.create!(:user => user, :token => SecureRandom.base64)
    end
  end

  def mark_used
    self.update!(:used_at => DateTime.now)
  end
end
