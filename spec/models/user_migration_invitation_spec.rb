require 'rails_helper'

TOKEN_LENGTH = 36

describe UserMigrationInvitation do
  before(:each) do
    @invite = create(:user_migration_invitation)
  end

  describe "valid instance" do
    it "is valid" do
      expect(@invite).to be_valid
    end

    it "is not expired" do
      expect(@invite.expired?).to be false
    end

    it "defaults force_expiration to false" do
      expect(@invite.force_expiration).to be false
    end

    it "has a 36-character token (uuid)" do
      expect(@invite.token).not_to be_nil
      expect(@invite.token).to have(TOKEN_LENGTH).characters
    end
  end

  it "must have a LegacyUser" do
    @invite.legacy_user = nil
    expect(@invite).to be_invalid
  end

  it "expired? is true when force_expiration is true" do
    @invite.force_expiration = true
    expect(@invite.expired?).to be true
  end

  it "doesn't allow token to be overwritten" do
    expect{@invite.token = ("a" * TOKEN_LENGTH)}.to raise_error(NoMethodError)
  end

  describe "#find_by_token!" do
    describe "when asked for a valid, unexpired record" do
      it "returns the record" do
        expect(UserMigrationInvitation.find_by_token!(@invite.token)).to eq(@invite)
      end
    end

    describe "when asked for a token that exists but the record is expired" do
      it "raises ActiveRecord::RecordNotFound" do
        @invite.update!(force_expiration: true)
        expect{UserMigrationInvitation.find_by_token!(@invite.token)}.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    describe "when asked for an invalid token" do
      it "raises ActiveRecord::RecordNotFound" do
        expect{UserMigrationInvitation.find_by_token!("invalidtoken")}.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
