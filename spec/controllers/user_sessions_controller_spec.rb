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

    describe "when there isn't a User with the provided user_name" do
      it_should_behave_like "common_login_failure"
    end
  end
end
