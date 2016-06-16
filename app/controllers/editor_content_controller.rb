class EditorContentController < ApplicationController
  before_action      :set_state
  before_action      :ensure_edit_privileges
  skip_before_filter :set_locale

  rescue_from ActiveRecord::RecordInvalid, :with => :record_invalid

  def create
    value = @state.create_content!(params[:key], params[:value])
    head :ok
  end

  def publish_draft
    @state.publish_draft 
    head :ok
  end

  private
  def state_params
    params.require(:state).permit(:content_model_type, :content_model_id, :locale) 
  end

  def set_state
    @state = ContentModelState.find_or_create!(state_params)
  end

  def ensure_edit_privileges
    forbidden_unless(@state.content_model.can_be_edited_by?(logged_in_user))
  end

  def record_invalid
    head :bad_request
  end
end
