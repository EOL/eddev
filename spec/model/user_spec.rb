require "rails_helper"

describe User do
  before :all do
    @valid_user = User.new(
      email: 'email@emailprovider.com',
      user_name: 'siteuser',
      full_name: 'Site User',
      password: 'abcd1234',
      password_confirmation: 'abcd1234'
    )
  end

  describe "valid user" do
    it "should be valid" do
      expect(@valid_user).to be_valid
    end
  end
end

