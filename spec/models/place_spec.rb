require 'rails_helper'

RSpec.describe Place, type: :model do
  it { should have_many :habitats }

  it_behaves_like "content_model"
end
