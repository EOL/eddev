class EditorContentController < ApplicationController
  include EditorContentHelper

  skip_before_filter :set_locale

  def create
    begin
      state = ContentModelState.find_or_create!(state_params)
      value = state.create_content!(params[:key], params[:value])

      head :ok
    rescue ActiveRecord::RecordInvalid
      head :bad_request
    end
  end

  private
  def state_params
    params.require(:state).permit(:content_model_type, :content_model_id, :locale) 
  end
end
