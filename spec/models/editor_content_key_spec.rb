require 'rails_helper'

RSpec.describe EditorContentKey, type: :model do
  it { should validate_presence_of :name }
  it { should validate_presence_of :content_model }

  it do
    should validate_uniqueness_of(:name)
      .scoped_to(:content_model_type, :content_model_id)
      .case_insensitive
  end

  it { should belong_to :content_model }
end
