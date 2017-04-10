# Pass-through to card service

require 'card_service_caller'

class CardgenController < ApplicationController
  skip_before_action :verify_authenticity_token

  # POST /cardgen/cards.json
  def create
    response = CardServiceCaller.create_card(request.raw_post)

    respond_to do |format|
      format.json { render :json => response }
    end
  end

  # PUT /cardgen/cards/:card_id/data.json
  def update_card
    response =
      CardServiceCaller.update_card_data(params[:card_id], request.raw_post)

    respond_to do |format|
      format.json { render :json => response }
    end
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

  # POST /cardgen/images.json
  def upload_image
    response = CardServiceCaller.upload_image(request.body.read)

    respond_to do |format|
      format.json { render :json => response }
    end
  end
end
