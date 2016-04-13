class EditorContentController < ApplicationController
  skip_before_filter :set_locale

  def create
    params_valid = validate_create_request

    respond_to do |format| 
      format.json do
        if params_valid
          # TODO: recover from errors
          EditorContent.create!(key: params[:key], value: params[:value], locale: params[:locale])

          render json: {success: true}
        else
          # TODO: error messages? 
          render json: {success: false}, status: :bad_request
        end
      end
    end
  end

  private
  def validate_create_request
    !(params[:key].blank? || params[:value].blank? || params[:locale].blank?)
  end
end
