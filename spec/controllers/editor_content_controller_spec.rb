require 'rails_helper'

RSpec.describe EditorContentController, type: :controller do
#  let(:user) { create(:admin_user) }
#  let(:sess) { { user_id: user.id } }
#
#  describe "#create" do
#    let(:key_name) { "some-key" }
#    let(:value) { "Some text" }
#    let(:locale) { "es" }
#    let(:habitat) { create(:habitat) }
#    let!(:model_state) do 
#      create(:content_model_state, 
#             :content_model => habitat, 
#             :editor_content_version => 0, 
#             :locale => locale)
#    end
#    let(:request_body) do
#      { 
#        format: :json, 
#        state: {
#          content_model_type: habitat.class.name,
#          content_model_id: habitat.id,
#          locale: locale,
#        },
#        key: key_name,
#        value: value, 
#      }
#    end
#
#    context "when a request is made" do
#      context "when the request is valid" do
#        before(:each) do 
#          post :create, request_body, sess
#          model_state.reload
#        end
#
#        it "sends a 200 response" do
#          expect(response.status).to eq(200)
#        end
#
#        it "creates a EditorContentValue from the request parameter values" do
#          saved_values = model_state.editor_contents.where(
#            :key => key_name,
#            :version => 1,
#            :value => value
#          )
#
#          expect(saved_values.length).to eq(1)
#        end
#      end
#
#      context "when the request is missing a parameter" do
#        shared_examples_for :missing_parameter do
#          it "sets the HTTP status to 400" do 
#            post :create, request_body, sess
#            expect(response.status).to eq(400)
#          end
#        end
#
#        context "when the request is missing the one of the key parameters" do
#          context "when it is missing the locale" do 
#            before { request_body[:state].delete(:locale) }
#            it_behaves_like :missing_parameter
#          end
#
#          context "when it is missing the content_model_id" do 
#            before { request_body[:state].delete(:content_model_id) }
#            it_behaves_like :missing_parameter
#          end
#
#          context "when it is missing the content_model_type" do 
#            before { request_body[:state].delete(:content_model_type) }
#            it_behaves_like :missing_parameter
#          end
#        end
#
#        context "when the request is missing the value" do
#          before { request_body.delete(:value) }
#          it_behaves_like :missing_parameter
#        end
#
#        context "when the request is missing the key" do
#          before { request_body.delete(:key) }
#          it_behaves_like :missing_parameter
#        end
#      end
#    end
#  end
end
