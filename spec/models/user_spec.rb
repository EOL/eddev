require "rails_helper"

describe User do
  let(:email) { "user@email.com" }
  let(:user_name) { "user" }
  let(:valid_pwd) { "pass12" }

  describe "validations" do
    it { should have_many :password_reset_tokens }
    it { should validate_uniqueness_of :confirm_token }

    let(:too_short_pwd) { valid_pwd[1..-1] }

    shared_examples_for "validates password" do
      it "validates password length and confirms with password_confirmation" do
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

#      context "when there is a User with a given email" do
#        it "should not allow another User to have the same email" do
#          other_user = build(:user, email: email, user_name: "otheruser" )
#          expect(other_user).to be_invalid
#        end
#      end

      context "when there is a User with a given user_name" do
        it "should not allow another User to have the same user_name" do
          other_user = build(:user, email: "otheruser@email.com", user_name: user_name)
          expect(other_user).to be_invalid
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

  describe "#admin?" do
    context "when the user has the admin role" do
      let(:user) { create(:user, :role => :admin) }

      it "should be true" do
        expect(user.admin?).to be true
      end
    end

    context "when the user does not have the admin role" do
      let(:user) { create(:user, :role => :basic) }

      it "should be false" do
        expect(user.admin?).to be false
      end
    end
  end

  describe "#authenticate" do
    shared_examples_for "base functionality" do
      context "when it is called with an invalid password" do
        it "returns nil" do
          expect(user.authenticate("bogus")).to eq false
        end
      end

      context "when it is called with a valid password" do
        it "returns self" do
          expect(user.authenticate(valid_pwd)).to eq user
        end
      end
    end

    context "when user has a legacy_password_digest but not a password_digest" do
      let(:salt) { "fleurde" }
      let(:legacy_password_digest) { UnixCrypt::MD5.build(valid_pwd, salt)[salt.length + 4..-1] }
      let(:user) { create(:user, :password => nil, :legacy_password_digest => legacy_password_digest) }

      before do
        user.legacy_salt = salt
      end

      it_behaves_like "base functionality"
      
      context "when it is called with the valid password" do
        it "returns itself, creates a password_digest from the password, and deletes the legacy_password_digest" do
          user.authenticate(valid_pwd)
          expect(user.legacy_password_digest).to be_nil
          expect(user.authenticate(valid_pwd)).to eq user
        end
      end
    end

    context "when user has a password_digest but not a legacy_password_digest" do
      let(:user) { create(:user, :password => valid_pwd, :password_confirmation => valid_pwd) }

      it_behaves_like "base functionality"
    end
  end

  describe "#legacy_id" do
    context "when the user has a saved legacy id" do
      let(:legacy_id) { 5 }
      let(:user) { create(:user, :legacy_id => legacy_id) }

      it "returns that value" do
        expect(user.legacy_id).to eq legacy_id
      end
    end

    context "when the user doesn't have a saved legacy id" do
      let(:user) { create(:user, :legacy_id => nil) } 

      it "returns user.id + User.LEGACY_ID_OFFSET" do
        expect(user.legacy_id).to eq (user.id + User::LEGACY_ID_OFFSET)
      end
    end
  end
end
