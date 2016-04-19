class EditorContentController < ApplicationController
  include EditorContentHelper

  skip_before_filter :set_locale

  def create
    key = params[:key]

    if key.blank?
      logger.warn("Cannot create EditorContent without valid key parameter")
      head :bad_request
      return
    end

    if !can_edit(key) 
      logger.warn("Forbidden attempt to edit key #{key}")
      head :forbidden
      return
    end

    content = EditorContent.create(key: key, value: params[:value], locale: params[:locale])

    if content.valid?
      head :ok
    else
      logger.warn("Failed to create EditorContent. Errors: #{content.errors.full_messages.join(",") unless !content.errors}")
      head :bad_request
    end
  end
end
