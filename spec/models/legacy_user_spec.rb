require 'rails_helper'

describe LegacyUser do
  describe "valid instance" do
    it "should be valid" do
      legacy_user = build(:legacy_user)
      expect(legacy_user).to be_valid
    end
  end

  it "must have an email" do
    legacy_user = build(:legacy_user)

    legacy_user.email = nil
    expect(legacy_user).to be_invalid

    legacy_user.email = ""
    expect(legacy_user).to be_invalid
  end


  it "must have an full_name" do
    legacy_user = build(:legacy_user)

    legacy_user.full_name = nil
    expect(legacy_user).to be_invalid

    legacy_user.full_name = ""
    expect(legacy_user).to be_invalid
  end

  it "must have an user_name" do
    legacy_user = build(:legacy_user)

    legacy_user.user_name = nil
    expect(legacy_user).to be_invalid

    legacy_user.user_name = ""
    expect(legacy_user).to be_invalid
  end
end
