require 'rails_helper'

RSpec.describe Gallery do
  describe "valid instance" do
    subject { create(:gallery) }
    it { should be_valid }

    it "should have a user" do
      subject.user = nil
      expect(subject).to be_invalid
    end
  end
end
