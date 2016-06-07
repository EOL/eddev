require 'rails_helper'

shared_examples_for "content_model" do 
  it { should have_many :editor_content_keys }
  it { should have_many :content_model_states }
  
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

  describe "#publish_draft" do
    it "increments the locale's ContentModelState's editor_content_version" do
      state = content_model.state_for_locale(locale)
      cur_version = state.editor_content_version  
      content_model.publish_draft(locale)
      state.reload
      expect(state.editor_content_version).to eq(cur_version + 1)
    end
  end

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
      let!(:content_key) { create(:editor_content_key, content_model: content_model, locale: locale) }

      before do
        content_key.create_value!("some content")
      end

      context "when it is all unpublished" do
        it_behaves_like "no locales with content"
      end

      context "when it is published" do
        before do
          content_model.publish_draft(locale)
        end

        it "returns an array containing that locale" do
          expect(content_model.locales_with_content).to eq([locale])
        end
      end
    end
  end
end
