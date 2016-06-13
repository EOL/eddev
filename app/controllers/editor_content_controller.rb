class EditorContentController < ApplicationController
  before_action      :set_state
  skip_before_filter :set_locale

  def create
    begin
      value = @state.create_content!(params[:key], params[:value])

      head :ok
    rescue ActiveRecord::RecordInvalid
      head :bad_request
    end
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
end
