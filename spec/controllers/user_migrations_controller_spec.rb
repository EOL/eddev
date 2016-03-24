require "rails_helper"

describe UserMigrationsController do
  describe "#migrate" do
    describe "when there is a valid invitation" do
      before(:each) do
        @invitation = create(:user_migration_invitation_with_api_key) 
        @password = "password"

        post :create, invitation_token: @invitation.token, password: @password, password_confirmation: @password
      end

      it "responds with ok status" do
        expect(response.status).to eq(200)
      end

      it "creates a user from the LegacyUser and the new password" do
        legacy_user = @invitation.legacy_user
        new_user = User.find_by(user_name: @invitation.legacy_user.user_name)

        expect(new_user).not_to be_nil
        expect(new_user.email).to eq(legacy_user.email)
        expect(new_user.full_name).to eq(legacy_user.full_name)
        expect(new_user.api_key).to eq(legacy_user.api_key)
        expect(new_user.authenticate(@password)).to eq(new_user)
      end

      it "expires the UserMigrationInvitation" do
        @invitation.reload
        expect(@invitation.force_expiration?).to be true
      end

      it "marks the LegacyUser as migrated" do
        @invitation.reload
        expect(@invitation.legacy_user.migrated?).to be true
      end
    end

    describe "when there is no valid invitation" do
      before(:each) do
      end

      it "raises RecordNotFound" do
        expect {
          post(:create, invitation_token: "bogus_token", 
                     password: "somepassword", password_confirmation: "somepassword")
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
