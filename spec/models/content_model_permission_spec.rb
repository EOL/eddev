require 'rails_helper'

RSpec.describe ContentModelPermission, type: :model do
  it { should belong_to :user }
  it { should belong_to :content_model }

  it { should validate_presence_of :user }
  it { should validate_presence_of :content_model }
  it { should validate_presence_of :role }
end
