require 'rails_helper'

RSpec.describe PlacePermission, type: :model do
  it { should validate_presence_of :place }
  it { should validate_presence_of :type }
end
