require 'rails_helper'

RSpec.describe ContentModelState, type: :model do
  it { should validate_presence_of :content_model }
  it { should validate_presence_of :published }
  it { should validate_presence_of :editor_content_version }
end
