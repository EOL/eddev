require 'rails_helper'

RSpec.describe EditorContentKey, type: :model do
  it { should validate_presence_of :locale }
  it { should validate_presence_of :content_model }
  it { should belong_to :content_model }
  it { should validate_presence_of :name }
  it { should allow_value("this_is_a_key").for(:name) }
  it { should_not allow_value("this is not a key").for(:name) }

  it do
    should validate_uniqueness_of(:name)
      .scoped_to(:content_model_type, :content_model_id)
      .case_insensitive
  end

  it { should have_many :editor_content_values }

  describe "#latest_value" do
    let(:name) { "its_a_key" }
    let(:editor_content_key) { create(:editor_content_key, name: name) }

    context "when no EditorContentValues exist" do
      it "returns the key name" do
        expect(editor_content_key.latest_value).to eq(name)
      end
    end

    context "when one EditorContentValue exists" do
      let(:content) { "some text" }

      before do
        EditorContentValue.create!(editor_content_key: editor_content_key, content: content)
        editor_content_key.reload
      end

      it "returns that ECV's content value" do
        expect(editor_content_key.latest_value).to eq(content)
      end
    end

    context "when multiple EditorContentValues exist" do
      let(:old_content) { "old content" }
      let(:new_content) { "new content" }

      before do
        EditorContentValue.create!(editor_content_key: editor_content_key, content: old_content)
        EditorContentValue.create!(editor_content_key: editor_content_key, content: new_content)
        editor_content_key.reload
      end

      it "returns the ECV with the greatest id's content" do
        expect(editor_content_key.latest_value).to eq(new_content)
      end
    end
  end
end
