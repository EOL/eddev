require "rails_helper"

describe ApplicationController do
  context "when a ForbiddenError is raised" do
    controller do 
      def index
        raise ApplicationController::ForbiddenError
      end
    end
    
    let(:user) { create(:user) }
    before do
      session[:user_id] = user.id
    end

    it "responds with 404" do
      get_with_locale :index
      expect(response.status).to eq(404) 
    end
  end
end
