# Card service pass-through endpoints
require 'card_service_caller'

class CardgenController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_user
  before_action :set_cache_headers

  wrap_parameters :post_json, :format => :json

  # POST /cardgen/cards
  def create
    request_params = { :userId => logged_in_user.id }.merge(params[:post_json])
    json_response(CardServiceCaller.create_card(request_params.to_json))
  end

  # PUT /cardgen/cards/:card_id/data
  def update_card
    json_response(
      CardServiceCaller.update_card_data(params[:card_id], request.raw_post)
    )
  end

  # GET /cardgen/cards/:card_id/svg
  def render_svg
    data = CardServiceCaller.svg(params[:card_id])
    send_data data, :type => "image/svg+xml", :disposition => "inline"
  end

  # GET /cardgen/cards/:card_id/png
  def render_png
    data = CardServiceCaller.png(params[:card_id])
    send_data data, :type => "image/png", :disposition => "inline"
  end

  # POST /cardgen/images
  def upload_image
    json_response(CardServiceCaller.upload_image(request.body.read))
  end

  # GET /cardgen/templates/:template_name
  def template
    json_response(CardServiceCaller.get_template(params[:template_name]))
  end

  # GET /cardgen/card_ids_for_user
  def card_ids_for_user
    json_response(CardServiceCaller.card_ids_for_user(logged_in_user.id))
  end

  # GET /cardgen/cards/:card_id/json
  def card_json
    json_response(CardServiceCaller.json(params[:card_id]))
  end

  # DELETE /cardgen/cards/:card_id
  def delete
    json_response(CardServiceCaller.delete(params[:card_id]))
  end

  private
    def json_response(httpartyResponse)
      respond_to do |format|
        format.json do
          render(
            :json => httpartyResponse.body,
            :status => httpartyResponse.code
          )
        end
      end
    end

    def set_cache_headers
      response.headers["Cache-Control"] = "no-cache, no-store"
      response.headers["Pragma"] = "no-cache"
      response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
    end
end
