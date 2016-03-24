require "rails_helper"

describe UserSessionsController do
  describe "#create" do
    shared_examples_for "common_create" do
      it "responds with ok" do
        expect(response.status).to eq(200)
      end
    end

    shared_examples_for "common_login_failure" do
      it_should_behave_like "common_create"

      it "does not set a user_id on the session" do
        expect(controller.session[:user_id]).to be_nil
      end
    end

    describe "when credentials are valid" do
      it_should_behave_like "common_create"  

      before do
        @user = build(:user)
        @password = "password" # Need to keep track of password since you can't retrieve it from the User
        @user.password = @user.password_confirmation = "password"
        @user.save!

        post :create, user_session: { user_name: @user.user_name, password: @password }
      end

      it "sets the user id on the session" do
        expect(controller.session[:user_id]).to eq(@user.id)
      end

    end 

    describe "when there isn't a User with the given user_name but there is a LegacyUser" do
      before do
        @legacy_user = create(:legacy_user)

        post :create, user_session: { user_name: @legacy_user.user_name, password: "itdoesntmatter" }
      end

      it_should_behave_like "common_login_failure"

      it "creates a UserMigrationInvitation" do
        invitation = UserMigrationInvitation.find_by(legacy_user: @legacy_user)
        expect(invitation).not_to be_nil
      end
    end

    describe "when there isn't a User or Legacy user with the provided user_name" do
      it_should_behave_like "common_login_failure"
    end
  end
end
