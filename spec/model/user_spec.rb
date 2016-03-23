require "rails_helper"

describe User do
  describe "valid user" do
    it "should be valid" do
      user = create(:user)
      expect(user).to be_valid
    end
  end
end

