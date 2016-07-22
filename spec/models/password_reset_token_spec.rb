require 'rails_helper'

RSpec.describe PasswordResetToken, type: :model do
  it { should validate_presence_of :user }
  it { should validate_presence_of :token }
  it { should validate_uniqueness_of :token }
  it { should belong_to :user }

  describe "#create_for_user" do
    let(:user) { create(:user) } 
    let(:token) { PasswordResetToken.create_for_user(user) }

    it "sets the user" do
      expect(token.user).to eq user 
    end

    it "generates a token" do
      expect(token.token).not_to be_blank
    end
  end

  describe "#mark_used" do
    let(:token) { create(:password_reset_token) }

    it "sets used_at to DateTime.now and persists itself" do
      expect(token.used_at).to be_nil

      before_time = DateTime.now
      token.mark_used 
      after_time = DateTime.now

      expect(token.used_at).not_to be_blank
      expect(token.used_at > before_time).to be true
      expect(token.used_at < after_time).to be true
      expect(token.changed?).to be false
    end
  end
end
