class EditorContentController < ApplicationController
  skip_before_filter :set_locale

  def create
    content = EditorContent.create(key: params[:key], value: params[:value], locale: params[:locale])

    if content.valid?
      head :ok
    else
      logger.warn("Failed to create EditorContent. Errors: #{content.errors.full_messages.join(",") unless !content.errors}")
      head :bad_request
    end
  end
end
