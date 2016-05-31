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

  describe "self.find_or_create" do
    let(:name) { "key_name" }
    let(:other_name) { "key_other_name" }
    let(:model) { create(:habitat) }
    let(:locale) { :en }

    context "when all required query parameters are supplied" do
      context "when no record is found" do
        context "when the content model is specified using the content_model attribute" do
          it "creates the key" do 
            key = EditorContentKey.find_or_create(name: name, content_model: model, locale: locale)
            check_key(key, name, model, locale)
          end
        end

        context "when the content model is specified using the content_model_id and content_model_type attributes" do
          it "creates the key" do         
            key = EditorContentKey.find_or_create(name: other_name, content_model_id: model.id, 
                                                  content_model_type: model.class.name, locale: locale)
            check_key(key, other_name, model, locale)
          end
        end
      end

      context "when a record is found" do
        let!(:stored_key) { create(:editor_content_key, name: name, content_model: model, locale: locale) }

        it "returns the record" do
          key = EditorContentKey.find_or_create(name: name, content_model: model, locale: locale)
          expect(key).to eq(stored_key)
          
          key = EditorContentKey.find_or_create(name: name, content_model_id: model.id, content_model_type: model.class.name, locale: locale)
          expect(key).to eq(stored_key)
        end
      end
    end

    context "when the required query parameters are not all supplied" do
      it "returns a new, invalid record with the supplied parameters filled in" do
        key = EditorContentKey.find_or_create(name: name, content_model: model)
        expect(key).not_to be_nil
        expect(key).to be_invalid
        expect(key.name).to eq(name)
        expect(key.content_model).to eq(model)
        expect(key.locale).to be_nil
      end 
    end
  end

  describe "#build_value" do
    let(:key) { create(:editor_content_key) }

    shared_examples "#build_value" do |content_string, should_be_valid|
      it "returns an EditorContentValue with attributes correctly set" do
        value = key.build_value(content_string)

        expect(value).not_to be_nil
        expect(value.editor_content_key).to eq(key)
        expect(value.content).to eq(content_string)
        expect(value.valid?).to eq(should_be_valid)
      end  
    end

    context "when it is passed a nonempty string" do
      it_behaves_like "#build_value", "content!", true
    end

    context "when it is passed an empty string" do
      it_behaves_like "#build_value", "", false
    end

    context "when it is passed nil" do
      it_behaves_like "#build_value", nil, false
    end
  end
end
