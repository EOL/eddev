class EditorContentController < ApplicationController
  include EditorContentHelper

  skip_before_filter :set_locale

  def create
    key = EditorContentKey.find_or_create(key_params)
    value = key.build_value(params[:value])

    if value.save
      head :ok
    else
      logger.warn("Failed to create EditorContent. Errors: #{value.errors.full_messages.join(",") if value.errors}")
      head :bad_request
    end
  end

  private
  def key_params
    params.require(:key).permit(:content_model_id, :content_model_type, :name, :locale)
  end
end
