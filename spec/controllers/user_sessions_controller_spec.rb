require "rails_helper"

describe UserSessionsController do
#  let(:password) { "pass1234" }
#  let(:user_name) { "siteuser" }
#  let(:user) { create(:user, :user_name => user_name, :password => password, :password_confirmation => password) }
#
#  describe "#create" do
#    shared_examples_for "common_create" do
#      it "responds with a redirect" do
#        expect(response.status).to eq(302)
#      end
#    end
#
#    shared_examples_for "common_login_failure" do
#      it "responds with 200" do
#        expect(response.status).to eq(200)
#      end
#
#      it "does not set a user_id on the session" do
#        expect(controller.session[:user_id]).to be_nil
#      end
#
#      it "does not set the the logged_in cookie" do
#        expect(response.cookies["logged_in"]).to be_nil
#      end
#
#      it "does not set the logged_in_user cookie" do
#        expect(response.cookies["logged_in_user"]).to be_nil
#      end
#    end
#
#    describe "when credentials are valid" do
#      before(:each) do
#        post_with_locale :create, user_session: { user_name: user.user_name, password: password }
#      end
#
#      it_should_behave_like "common_create"  
#
#      it "sets the user_id in the session" do
#        expect(controller.session[:user_id]).to      eq(user.id)
#      end
#
#      it "sets the logged_in cookie to the user's legacy_id" do
#        expect(response.cookies["logged_in"]).to      eq(user.legacy_id.to_s)
#      end
#
#      it "sets the logged_in_user cookie to the user's user_name" do
#        expect(response.cookies["logged_in_user"]).to eq(user.user_name)
#      end
#    end 
#
#    context "when there isn't a User with the provided user_name" do
#      before do
#        post_with_locale :create, user_session: { user_name: "nonexistentuser", password: "whocares" }
#      end
#
#      it_should_behave_like "common_login_failure"
#    end
#
#    context "when the password is incorrect" do
#      before do
#        post_with_locale :create, user_session: { user_name: user_name, password: "wrongpass" }
#      end
#
#      it_should_behave_like "common_login_failure"
#    end
#
#  end
#
#  describe "#destroy" do
#    before do
#      controller.session[:user_id] = user.id
#      request.cookies["logged_in"] = user.legacy_id
#      request.cookies["logged_in_user"] = user.user_name
#
#      get_with_locale :destroy
#    end      
#
#    it "should delete the user_id from the session" do
#      expect(controller.session[:user_id]).to be_nil
#    end
#
#    it "should delete the logged_in cookie" do
#      expect(cookies["logged_in"]).to be_nil
#    end
#
#    it "should delete the logged_in_user cookie" do
#      expect(cookies["logged_in_user"]).to be_nil 
#    end
#  end
end
