require 'rails_helper'

RSpec.describe Deck, type: :model do
  it { should validate_presence_of :title_key }
  it { should validate_presence_of :desc_key }
  it { should validate_presence_of :file_name }
  it { should validate_uniqueness_of :file_name }
  it { should validate_presence_of :image_file_name }
  it { should validate_uniqueness_of :image_file_name }
  it { should validate_uniqueness_of(:human_name).allow_nil }
end
