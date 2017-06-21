# Card service pass-through endpoints
require 'card_service_caller'

class CardMakerAjaxController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_user
  before_action :set_cache_headers

  wrap_parameters :post_json, :format => :json

  # POST /cardgen/cards
  def create_card
    json_response(
      CardServiceCaller.create_card(logged_in_user.id, request.raw_post)
    )
  end

  # POST /cardgen/decks/:deck_id/cards
  def create_deck_card
    json_response(
      CardServiceCaller.create_card_in_deck(logged_in_user.id,
        params[:deck_id], request.raw_post)
    )
  end

  def create_deck
    json_response(
      CardServiceCaller.create_deck(logged_in_user.id, request.raw_post)
    )
  end

  # PUT /cardgen/cards/:card_id/data
  def save_card
    json_response(
      CardServiceCaller.save_card(
        logged_in_user.id,
        params[:card_id],
        request.raw_post
      )
    )
  end

  # GET /cardgen/cards/:card_id/svg
  def render_svg
    svc_res = CardServiceCaller.svg(logged_in_user.id, params[:card_id])
    content_type = svc_res.headers["content-type"]
    opts = {
      :status => svc_res.code,
      :type => svc_res.headers["content-type"]
    }

    opts[:disposition] = :inline unless svc_res.code != 200

    send_data svc_res.body, opts
  end

  # GET /cardgen/cards/:card_id/png
  #def render_png
  #  data = CardServiceCaller.png(logged_in_user.id, params[:card_id])
  #  send_data data, :type => "image/png", :disposition => "inline"
  #end

  # POST /cardgen/images
  def upload_image
    json_response(
      CardServiceCaller.upload_image(
        logged_in_user.id,
        request.body.read
      )
    )
  end

  # GET /cardgen/templates/:template_name
  def template
    json_response(CardServiceCaller.get_template(params[:template_name]))
  end

  # GET /cardgen/card_ids
  def card_ids
    json_response(CardServiceCaller.card_ids(logged_in_user.id))
  end

  # GET /cardgen/card_summaries
  def card_summaries
    json_response(CardServiceCaller.card_summaries(logged_in_user.id))
  end

  # GET /cardgen/decks/:deck_id/card_ids
  def deck_card_ids
    json_response(CardServiceCaller.card_ids_for_deck(
      logged_in_user.id,
      params[:deck_id])
    )
  end

  def decks
    json_response(CardServiceCaller.get_decks(logged_in_user.id))
  end

  # GET /cardgen/cards/:card_id/json
  def card_json
    json_response(CardServiceCaller.json(logged_in_user.id, params[:card_id]))
  end

  # DELETE /cardgen/cards/:card_id
  def delete_card
    json_response(CardServiceCaller.delete_card(
      logged_in_user.id,
      params[:card_id]
    ))
  end

  # DELETE /cardgen/decks/:deck_id
  def delete_deck
    json_response(CardServiceCaller.delete_deck(
      logged_in_user.id,
      params[:deck_id]
    ))
  end

  # PUT /cardgen/cards/:card_id/deck_id
  def set_card_deck
    json_response(CardServiceCaller.set_card_deck(
      logged_in_user.id,
      params[:card_id],
      request.raw_post
    ))
  end

  # DELETE /cardgen/cards/:card_id/deck_id
  def remove_card_deck
    json_response(CardServiceCaller.remove_card_deck(
      logged_in_user.id,
      params[:card_id]
    ))
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
