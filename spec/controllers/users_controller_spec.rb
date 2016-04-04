require "rails_helper"

describe UsersController do
  shared_examples_for "an admin action" do
    context "when there isn't a logged-in user" do
      it "sends a 403 response" do
        process_with_locale action, http_method
        expect(response.status).to eq(403)
      end
    end

    context "when there is a logged-in user that isn't an admin" do
      let(:user) { create(:user, role: :basic) }
      it "sends a 403 response" do 
        process_with_locale action, http_method, session: { user_id: user.id }
        expect(response.status).to eq(403)
      end
    end

    context "when there is a logged-in admin" do
      let(:user) { create(:user, role: :admin) }
      it "sends a 200 response" do
        process_with_locale action, http_method, session: { user_id: user.id }
      end
    end
  end

  describe "#new" do
    let(:action) { :new }
    let(:http_method) { "GET" }

    it_should_behave_like "an admin action"
  end

  describe "#create" do
    let(:action) { :create }
    let(:http_method) { "POST" }

    it_should_behave_like "an admin action"
  end

  describe "#index" do
    let(:action) { :index }
    let(:http_method) { "GET" }
  
    it_should_behave_like "an admin action"
  end
end
