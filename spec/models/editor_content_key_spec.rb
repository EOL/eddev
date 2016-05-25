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
  it { should allow_value("this_is_a_key").for(:name) }
  it { should_not allow_value("this is not a key").for(:name) }
end
