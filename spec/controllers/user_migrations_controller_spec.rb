require "rails_helper"

describe UserMigrationsController do
  describe "#new" do
    describe "when passed a valid token" do
      before(:each) do
        @invitation = create(:user_migration_invitation)  
        get_with_locale :new, invitation_token: @invitation.token
      end

      it "responds with 200 status" do
        expect(response.status).to eq(200)
      end
    end

    describe "when passed an invalid token" do
      it "throws RecordNotFound" do
        expect{get_with_locale :new, invitation_token: "invalidtoken"}.to raise_exception(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe "#create" do
    describe "when there is a valid invitation" do
      let!(:invitation) { create(:user_migration_invitation_with_api_key) }
      let(:password) { "password" }

      before(:each) do
        post_with_locale :create, :invitation_token => invitation.token, 
            :user => { :password => password, :password_confirmation => password }
      end

      it "responds with 302 status" do # redirect to user_sessions#new. TODO: check redirect value
        expect(response.status).to eq(302)
      end

      it "creates a user from the LegacyUser and the new password" do
        legacy_user = invitation.legacy_user
        new_user = User.find_by(user_name: invitation.legacy_user.user_name)

        expect(new_user).not_to be_nil
        expect(new_user.email).to eq(legacy_user.email)
        expect(new_user.full_name).to eq(legacy_user.full_name)
        expect(new_user.api_key).to eq(legacy_user.api_key)
        expect(new_user.authenticate(password)).to eq(new_user)
      end

      it "expires the UserMigrationInvitation" do
        invitation.reload
        expect(invitation.force_expiration?).to be true
      end

      it "sets the user correctly" do
        invitation.reload
        expect(invitation.legacy_user.user).to eq(User.find_by(user_name: invitation.legacy_user.user_name))
      end
    end

    describe "when there is no valid invitation" do
      before(:each) do
      end

      it "raises RecordNotFound" do
        expect {
          post_with_locale(:create, invitation_token: "bogus_token", 
                     password: "somepassword", password_confirmation: "somepassword")
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
