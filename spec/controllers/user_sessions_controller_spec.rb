require "rails_helper"

describe UserSessionsController do
  describe "#create" do
    shared_examples_for "common_create" do
      it "responds with a redirect" do
        expect(response.status).to eq(302)
      end
    end

    shared_examples_for "common_login_failure" do
      it "responds with 200" do
        expect(response.status).to eq(200)
      end

      it "does not set a user_id on the session" do
        expect(controller.session[:user_id]).to be_nil
      end
    end

    describe "when credentials are valid" do
      let(:password) { "password" }
      let(:user) { create(:user, password: password, password_confirmation: password) }

      before(:each) do
        post_with_locale :create, user_session: { user_name: user.user_name, password: password }
      end

      it_should_behave_like "common_create"  

      it "sets the user id on the session" do
        expect(controller.session[:user_id]).to eq(user.id)
      end
    end 

    describe "when there isn't a User with the given user_name but there is a LegacyUser" do
      let(:legacy_user) { create(:legacy_user) }
      let(:mailer) { class_double("UserMigrationInvitationMailer").as_stubbed_const }
      let(:email) { instance_double("ActionMailer::MessageDelivery") }

      before do
        allow(mailer).to receive(:invitation_email) { email }
        allow(email).to receive(:deliver_now)

        post_with_locale :create, user_session: { user_name: legacy_user.user_name, password: "itdoesntmatter" }
      end

      it_should_behave_like "common_login_failure"

      it "creates a UserMigrationInvitation" do
        invitation = UserMigrationInvitation.find_by(legacy_user: legacy_user)
        expect(invitation).not_to be_nil
      end

      it "sends an invitation email" do
        invitation = UserMigrationInvitation.find_by(legacy_user: legacy_user)

        expect(mailer).to have_received(:invitation_email).with(invitation)
        expect(email).to have_received(:deliver_now)
      end
    end

    describe "when there isn't a User or Legacy user with the provided user_name" do
      it_should_behave_like "common_login_failure"
    end
  end
end
