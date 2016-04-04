require "rails_helper"

describe ApplicationController do
  context "when a ForbiddenError is raised" do
    controller do 
      def index
        raise ApplicationController::ForbiddenError
      end
    end

    it "responds with 403" do
      get_with_locale :index
      expect(response.status).to eq(403) 
    end
  end 
end
