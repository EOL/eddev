require 'rails_helper'

RSpec.describe EarthTour, type: :model do
  it { should validate_presence_of :title_key }
  it { should validate_presence_of :desc_key }
  it { should validate_presence_of :embed_url }
end
