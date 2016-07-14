require "rails_helper"

describe User do
  let(:email) { "user@email.com" }
  let(:user_name) { "user" }
  let(:valid_pwd) { "pass1234" }
  let(:too_short_pwd) { valid_pwd[1..-1] }

  shared_examples_for "validates password" do
    it "validates password and confirms with password_confirmation" do
      user.password = valid_pwd
      expect(user).to be_invalid

      user.password = user.password_confirmation = too_short_pwd
      expect(user).to be_invalid

      user.password = valid_pwd
      user.password_confirmation = "#{valid_pwd[1..-1]}!"
      expect(user).to be_invalid

      user.password_confirmation = valid_pwd
      expect(user).to be_valid
    end
  end

  context "user is persisted" do
    let!(:user) { create(:user, user_name: user_name, email: email) }
    describe "valid user" do
      it "should be valid" do
        expect(user).to be_valid
      end
    end 

    describe "defaults" do
      it "should have the user role" do
        expect(user.role).to eq("basic")
      end
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

    it "doesn't require password to be present" do
      user.reload
      expect(user).to be_valid
    end

    it_behaves_like "validates password"

    context "when there is a User with a given email" do
      it "should not allow another User to have the same email" do
        other_user = build(:user, email: email, user_name: "otheruser" )
        expect(other_user).to be_invalid
      end
    end

    context "when there is a User with a given user_name" do
      it "should not allow another User to have the same user_name" do
        other_user = build(:user, email: "otheruser@email.com", user_name: user_name)
        expect(other_user).to be_invalid
      end
    end

    context "when there is a saved LegacyUser"  do
      let!(:legacy_email) { "legacy@email.com" }
      let!(:legacy_user_name) { "legacy_user" }
      let!(:legacy_user) { create(:legacy_user, email: legacy_email, user_name: legacy_user_name) }

      shared_examples_for "legacy_user_validation" do
        context "when that User doesn't have legacy_user_id equal to the LegacyUser's id" do
          it "should be invalid" do
            expect(new_user).to be_invalid
          end
        end

        context "when that User's legacy_user_id == the LegacyUser's id" do
          before(:each) do
            new_user.legacy_user = legacy_user
          end

          it "should be valid" do
            expect(new_user).to be_valid 
          end
        end
      end

      context "when a User is created with the same email" do 
        let!(:new_user) { build(:user, email: legacy_email, user_name: "otheruser") }

        it_should_behave_like "legacy_user_validation"
      end

      context "when a User is created with the same user_name" do 
        let!(:new_user) { build(:user, email: "otheruser@email.com", user_name: legacy_user_name) }
        
        it_should_behave_like "legacy_user_validation"
      end
    end

    describe "#admin?" do
      context "when the user has the admin role" do
        it "should be true" do
          u = create(:user, role: :admin)
          expect(u.admin?).to be true
        end
      end

      context "when the user does not have the admin role" do
        it "should be false" do
          expect(user.admin?).to be false
        end
      end
    end

  end

  context "user isn't persisted" do
    let(:user) { build(:user, :user_name => user_name, :email => email, :password => nil, :password_confirmation => nil) }

    context "when there is a legacy_password_digest" do
      before do
        user.legacy_password_digest = "aasadf$//g"
      end
      
      it "doesn't require a password" do
        expect(user).to be_valid
      end

      it_behaves_like "validates password"
    end

    context "when there isn't a legacy_password_digest" do
      it "requires a password" do
        expect(user).to be_invalid
      end

      it_behaves_like "validates password"
    end
  end
end
