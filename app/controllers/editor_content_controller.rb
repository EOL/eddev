class EditorContentController < ApplicationController
  include EditorContentHelper

  skip_before_filter :set_locale

  def create
    begin
      key = EditorContentKey.find_or_create!(key_params)
      value = key.create_value!(params[:value])

      head :ok
    rescue ActiveRecord::RecordInvalid
      head :bad_request
    end
  end

  private
  def key_params
    params.require(:key).permit(:content_model_id, :content_model_type, :name, :locale)
  end
end
