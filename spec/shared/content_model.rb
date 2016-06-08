require 'rails_helper'

shared_examples_for "content_model" do 
  it { should have_many :content_model_states }
  it { should validate_presence_of :name }
  it { should validate_uniqueness_of :name }
  
  let!(:content_model) { create(described_class.to_s.underscore.to_sym) }
  let(:locale) { :fr }

  describe "#state_for_locale" do
    context "when there is a ContentModelState for the locale" do
      let!(:state) { create(:content_model_state, :content_model => content_model, :locale => locale) }

      it "returns that CMS" do
        expect(content_model.state_for_locale(locale)).to eq(state)
      end
    end

    context "when there isn't a ContentModelState for the locale" do
      it "creates one and returns it" do
        new_state = content_model.state_for_locale(locale)

        expect(new_state).not_to be_nil
        expect(new_state).to be_valid
        expect(new_state).to be_persisted
        expect(new_state.locale).to eq(locale.to_s)
        expect(new_state.published).to eq(false)
        expect(new_state.editor_content_version).to eq(0)

        same_state = content_model.state_for_locale(locale)
        expect(same_state).to eq(new_state)
      end
    end
  end

#  describe "#publish_draft" do
#    it "increments the locale's ContentModelState's editor_content_version" do
#      state = content_model.state_for_locale(locale)
#      cur_version = state.editor_content_version  
#      content_model.publish_draft(locale)
#      state.reload
#      expect(state.editor_content_version).to eq(cur_version + 1)
#    end
#  end

  describe "#locales_with_content" do
    shared_examples_for "no locales with content" do
      it "returns an empty array" do
        expect(content_model.locales_with_content.empty?).to be true
      end
    end

    context "when there are no locales with content" do
      it_behaves_like "no locales with content"
    end 

    context "when there is one locale with content" do
      let(:locale) { "es" }
      let!(:state) { create(:content_model_state, content_model: content_model, locale: locale) }
      let(:key) { "content_key" }

      before do
        state.create_content!(key, "some content")
      end

      context "when it is all unpublished" do
        it_behaves_like "no locales with content"
      end

      context "when it is published" do
        before do
          state.publish_draft
        end

        it "returns an array containing that locale" do
          expect(content_model.locales_with_content).to eq([locale])
        end
      end
    end
  end

  describe "#copy_locale_contents" do
    let!(:state_en) { content_model.state_for_locale(:en) }
    let!(:state_fr) { content_model.state_for_locale(:fr) }
    let!(:new_content_model) do
      new_content_model = content_model.dup
      new_content_model.name = "new content model"
      new_content_model.save!
      new_content_model
    end

    before do
      state_en.create_content!("key1", "key1_en_content")
      state_en.create_content!("key2", "key2_en_content")
      state_en.publish_draft

      state_fr.create_content!("key1", "key1_fr_content")
      state_fr.create_content!("key2", "key2_fr_content")
      state_fr.create_content!("key3", "key3_fr_content")
      state_fr.publish_draft

      state_en.create_content!("key1", "key1_en_unpublished")
    end
    
    it "copies the latest published version for each key" do
      content_model.copy_locale_contents(new_content_model, [:en, :fr])
      new_state_en = new_content_model.state_for_locale(:en)  
      new_state_fr = new_content_model.state_for_locale(:fr)

      expect(new_state_en.content_value("key1")).to eq("key1")
      expect(new_state_en.content_value("key2")).to eq("key2")

      expect(new_state_fr.content_value("key1")).to eq("key1")
      expect(new_state_fr.content_value("key2")).to eq("key2")
      expect(new_state_fr.content_value("key3")).to eq("key3")

      new_state_en.publish_draft
      expect(new_state_en.content_value("key1")).to eq("key1_en_content")
      expect(new_state_en.content_value("key2")).to eq("key2_en_content")

      new_state_fr.publish_draft
      expect(new_state_fr.content_value("key1")).to eq("key1_fr_content")
      expect(new_state_fr.content_value("key2")).to eq("key2_fr_content")
      expect(new_state_fr.content_value("key3")).to eq("key3_fr_content")
    end

    it "does the stuff" do
      content_model.locales_with_content
    end
  end
end

