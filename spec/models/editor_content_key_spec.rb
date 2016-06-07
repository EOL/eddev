require 'rails_helper'

# Helpers
def check_key(key, name, model, locale)
  expect(key).not_to be_nil
  expect(key).to be_valid
  expect(key.name).to eq(name)
  expect(key.content_model).to eq(model)
  expect(key.locale).to eq(locale.to_s)
end

RSpec.describe EditorContentKey, type: :model do
  it { should validate_presence_of :locale }
  it { should validate_presence_of :content_model }
  it { should belong_to :content_model }
  it { should validate_presence_of :name }
  it { should allow_value("this_is_a_key").for(:name) }
  it { should_not allow_value("this is not a key").for(:name) }

  it do
    should validate_uniqueness_of(:name)
      .scoped_to(:content_model_type, :content_model_id, :locale)
      .case_insensitive
  end

  it { should have_many :editor_content_values }

  describe "#content_model_state" do
    context "when there is a locale" do
      let!(:content_model) { create(:habitat) }
      let(:locale) { :en }
      let!(:key) { create(:editor_content_key, :content_model => content_model, :locale => locale) }

      it "should return content_model.state_for_locale" do
        expected_state = content_model.state_for_locale(locale) 
        expect(key.content_model_state).to eq(expected_state)
      end
    end


    context "when it has no locale" do
      let(:key) { build(:editor_content_key, :locale => nil) }

      it "should raise RuntimeError" do
        expect { key.content_model_state }.to raise_error(RuntimeError)
      end 
    end
  end

  describe "#latest_value" do
    let(:name) { "its_a_key" }
    let(:locale) { "en" }
    let(:content_version) { 1 }
    let!(:content_model) { create(:habitat) }
    let!(:content_model_state) do 
      create(:content_model_state, 
             :content_model => content_model, 
             :locale => locale,
             :editor_content_version => content_version) 
    end
    let!(:key) do 
      create(:editor_content_key, 
             :name => name, 
             :content_model => content_model,
             :locale => locale)
    end
    let(:content) { "some text" }

    shared_examples_for "no valid values" do
      it "returns the key name" do
        expect(key.latest_value).to eq(name)
      end
    end

    shared_examples_for "return correct value" do
      it "returns the correct value" do
        expect(key.latest_value).to eq(content)
      end
    end

    context "when no EditorContentValues exist" do
      it_behaves_like "no valid values"
    end

    context "when ECVs exist with only versions > the greatest valid version" do
      before do
        EditorContentValue.create!(editor_content_key: key, content: content, version: 2)
      end

      it_behaves_like "no valid values"
    end

    context "when one EditorContentValue exists with valid versions" do
      before do
        EditorContentValue.create!(editor_content_key: key, content: content, version: 0)
        key.reload
      end

      it_behaves_like "return correct value"
    end

    context "when multiple EditorContentValues exist with valid versions" do
      before do
        EditorContentValue.create!(editor_content_key: key, content: "old revision 1", version: 0)
        EditorContentValue.create!(editor_content_key: key, content: "old revision 2", version: 1)
        EditorContentValue.create!(editor_content_key: key, content: content, version: 1)
        key.reload
      end
      
      it_behaves_like "return correct value"
    end

    context "when values exist with valid and invalid versions" do
      before do
        EditorContentValue.create!(editor_content_key: key, content: content, version: 0)
        EditorContentValue.create!(editor_content_key: key, content: "newer content", version: 2)
        key.reload
      end

      it_behaves_like "return correct value"
    end
  end

  describe "#latest_draft_value" do
    let!(:key) { create(:editor_content_key) }
    let(:expected_content) { "expected content" }

    before do
      EditorContentValue.create!(editor_content_key: key, content: "old revision 1", version: 0)
      EditorContentValue.create!(editor_content_key: key, content: expected_content, version: 1)
      key.reload
    end

    it "returns the latest value ignoring version" do
      expect(key.latest_draft_value).to eq(expected_content)
    end
  end

  describe "#find_or_create!" do
    let(:name) { "key_name" }
    let(:other_name) { "key_other_name" }
    let(:model) { create(:habitat) }
    let(:locale) { :en }

    context "when all required query parameters are supplied" do
      context "when no record is found" do
        context "when the content model is specified using the content_model attribute" do
          it "creates the key" do 
            key = EditorContentKey.find_or_create!(name: name, content_model: model, locale: locale)
            check_key(key, name, model, locale)
          end
        end

        context "when the content model is specified using the content_model_id and content_model_type attributes" do
          it "creates the key" do         
            key = EditorContentKey.find_or_create!(name: other_name, content_model_id: model.id, 
                                                  content_model_type: model.class.name, locale: locale)
            check_key(key, other_name, model, locale)
          end
        end
      end

      context "when a record is found" do
        let!(:stored_key) { create(:editor_content_key, name: name, content_model: model, locale: locale) }

        it "returns the record" do
          key = EditorContentKey.find_or_create!(name: name, content_model: model, locale: locale)
          expect(key).to eq(stored_key)
          
          key = EditorContentKey.find_or_create!(name: name, content_model_id: model.id, content_model_type: model.class.name, locale: locale)
          expect(key).to eq(stored_key)
        end
      end
    end

    context "when the required query parameters are not all supplied" do
      it "raises ActiveRecord::RecordInvalid" do
        expect { EditorContentKey.find_or_create!(name: name, content_model: model) }.to raise_error(ActiveRecord::RecordInvalid)
      end 
    end
  end

  describe "#create_value!" do
    let(:content_version) { 5 }
    let!(:content_model) { create(:habitat) }
    let(:locale) { "en" }
    let!(:content_model_state) do
      create(:content_model_state, 
             :content_model => content_model,
             :editor_content_version => content_version, 
             :locale => locale)
    end
    let!(:key) { create(:editor_content_key, :content_model => content_model) }

    shared_examples_for "invalid content" do |invalid_content|
      it "raises ActiveRecord::RecordInvalid" do
        expect { key.create_value!(invalid_content) }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context "when it is passed a nonempty string" do
      let(:content_string) { "content" }

      it "creates a valid value with the attributes correctly set" do
        value = key.create_value!(content_string)

        expect(value).not_to be_nil
        expect(value).to be_valid
        expect(value.editor_content_key).to eq(key)
        expect(value.content).to eq(content_string)
        expect(value.version).to eq(content_version + 1)
      end
    end

    context "when it is passed an empty string" do
      it_behaves_like "invalid content", ""
    end

    context "when it is passed nil" do
      it_behaves_like "invalid content", nil
    end
  end

end
