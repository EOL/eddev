require "rails_helper"

describe User do
  let!(:email) { "user@email.com" }
  let!(:user_name) { "user" }
  let!(:user) { create(:user, user_name: user_name, email: email) }

  describe "valid user" do
    it "should be valid" do
      expect(user).to be_valid
    end
  end 

  it "must have a password with at least 8 characters" do
    user.password = user.password_confirmation = nil
    expect(user).to be_invalid

    user.password = user.password_confirmation = "1234567"
    expect(user).to be_invalid
  end

  it "must have a user_name" do
    user.user_name = nil
    expect(user).to be_invalid

    user.user_name = ""
    expect(user).to be_invalid
  end

  it "must have an email" do
    user.email = nil
    expect(user).to be_invalid

    user.email = ""
    expect(user).to be_invalid
  end

  it "must have a full_name" do
    user.full_name = nil
    expect(user).to be_invalid

    user.full_name = ""
    expect(user).to be_invalid
  end

  describe "when there is a User with a given email" do
    it "should not allow another User to have the same email" do
      other_user = build(:user, email: email, user_name: "otheruser" )
      expect(other_user).to be_invalid
    end
  end

  describe "when there is a User with a given user_name" do
    it "should not allow another User to have the same user_name" do
      other_user = build(:user, email: "otheruser@email.com", user_name: user_name)
      expect(other_user).to be_invalid
    end
  end

  describe "when there is a saved LegacyUser"  do
    let!(:legacy_email) { "legacy@email.com" }
    let!(:legacy_user_name) { "legacy_user" }
    let!(:legacy_user) { build(:legacy_user, email: legacy_email, user_name: legacy_user_name) }

    describe "when there is a User with the same email address" do 
      let!(:new_user) { build(:user, email: legacy_email, user_name: "otheruser") }

      describe "when that User doesn't have legacy_user_id equal to the LegacyUser's id" do
        it "should be invalid" do
          expect(new_user).to be_invalid
        end
      end

      describe "when that User's legacy_user_id == the LegacyUser's id" do
        before(:each) do
          new_user.legacy_user = legacy_user
        end

        it "should be valid" do
          expect(new_user).to be_valid 
        end
      end
    end
  end
end
