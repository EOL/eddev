require "rails_helper"

describe User do
  describe "valid user" do
    it "should be valid" do
      user = build(:user)
      expect(user).to be_valid
    end
  end

  it "must have a password with at least 8 characters" do
    user = build(:user)

    user.password = user.password_confirmation = nil
    expect(user).to be_invalid

    user.password = user.password_confirmation = "1234567"
    expect(user).to be_invalid
  end

  it "must have a user_name" do
    user = build(:user)
    
    user.user_name = nil
    expect(user).to be_invalid

    user.user_name = ""
    expect(user).to be_invalid
  end

  it "must have an email" do
    user = build(:user)

    user.email = nil
    expect(user).to be_invalid

    user.email = ""
    expect(user).to be_invalid
  end

  it "must have a full_name" do
    user = build(:user)

    user.full_name = nil
    expect(user).to be_invalid

    user.full_name = ""
    expect(user).to be_invalid
  end
end

