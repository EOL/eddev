# Card service pass-through endpoints

require "card_service_caller"

class CardMakerAjaxController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :ensure_user, :except => [
    :get_public_cards, 
    :get_public_decks,
    :get_card,
    :create_deck_pdf,
    :deck_pdf_status,
    :deck_pdf_result
  ]

  before_action :ensure_admin, :only => [ 
    :make_deck_public, 
    :make_deck_private, 
    :add_deck_user, 
    :remove_deck_user,
    :deck_users 
  ]

  # TODO: add exceptions where appropriate
  before_action :set_cache_headers

  wrap_parameters :post_json, :format => :json

  # POST /card_maker_ajax/cards
  def create_card
    json_response(
      CardServiceCaller.create_card(logged_in_user.id, request.raw_post)
    )
  end

  # POST /card_maker_ajax/decks/:deck_id/cards
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

  # PUT /card_maker_ajax/cards/:card_id/data
  def save_card
    json_response(
      CardServiceCaller.save_card(
        logged_in_user.id,
        params[:card_id],
        request.raw_post
      )
    )
  end

  def get_card
    respond_to do |format|
      format.json do
        ensure_user
        json_response(CardServiceCaller.json(logged_in_user.id, params[:card_id]))
      end

      format.svg do 
        svc_res = CardServiceCaller.svg(params[:card_id])
        data_pass_thru_response(svc_res)
      end

      format.png do
        data = CardServiceCaller.png(params[:card_id])
        send_data data, :type => "image/png", :disposition => "attachment"
      end
    end
  end

  # POST /card_maker_ajax/images
  def upload_image
    json_response(
      CardServiceCaller.upload_image(
        logged_in_user.id,
        request.body.read
      )
    )
  end

  # GET /card_maker_ajax/templates/:template_name/:template_version
  def template
    json_response(CardServiceCaller.get_template(params[:template_name], params[:template_version]))
  end

  # GET /card_maker_ajax/card_ids
  def card_ids
    json_response(CardServiceCaller.card_ids(logged_in_user.id))
  end

  # GET /card_maker_ajax/card_summaries
  def card_summaries
    json_response(CardServiceCaller.card_summaries(logged_in_user.id))
  end

  # GET /card_maker_ajax/decks/:deck_id/card_ids
  def deck_card_ids
    json_response(CardServiceCaller.card_ids_for_deck(
      logged_in_user.id,
      params[:deck_id])
    )
  end

  def decks
    json_response(CardServiceCaller.get_decks(logged_in_user.id))
  end


  # DELETE /card_maker_ajax/cards/:card_id
  def delete_card
    json_response(CardServiceCaller.delete_card(
      logged_in_user.id,
      params[:card_id]
    ))
  end

  # DELETE /card_maker_ajax/decks/:deck_id
  def delete_deck
    json_response(CardServiceCaller.delete_deck(
      logged_in_user.id,
      params[:deck_id]
    ))
  end

  # GET /card_maker_ajax/decks/:deck_id
  def get_deck
    json_response(CardServiceCaller.get_deck(
      logged_in_user.id,
      params[:deck_id]
    ))
  end

  # PUT /card_maker_ajax/cards/:card_id/deck_id
  def set_card_deck
    json_response(CardServiceCaller.set_card_deck(
      logged_in_user.id,
      params[:card_id],
      request.raw_post
    ))
  end

  # DELETE /card_maker_ajax/cards/:card_id/deck_id
  def remove_card_deck
    json_response(CardServiceCaller.remove_card_deck(
      logged_in_user.id,
      params[:card_id]
    ))
  end

  # GET /card_maker_ajax/taxon_search/:query
  def taxon_search
    json_response(CardServiceCaller.taxon_search(params[:query]))
  end

  # POST /card_maker_ajax/decks/:id/populateFromCollection
  def populate_deck_from_collection
    json_response(CardServiceCaller.populate_deck_from_collection(
      logged_in_user.id,
      params[:id],
      request.raw_post
    ))
  end

  # GET /card_maker_ajax/collectionJob/:id/status
  def collection_job_status
    json_response(CardServiceCaller.collection_job_status(params[:id]))
  end

  # POST /card_maker_ajax/deck_pdfs
  def create_deck_pdf
    json_response(CardServiceCaller.create_deck_pdf(
      request.raw_post
    ))
  end

  # GET /card_maker_ajax/deck_pdfs/:id/status
  def deck_pdf_status
    json_response(CardServiceCaller.deck_pdf_status(
      params[:id]
    ))
  end

  # GET /card_maker_ajax/deck_pdfs/:id/result
  def deck_pdf_result
    svc_res = CardServiceCaller.deck_pdf_result(params[:id])
    data_pass_thru_response(svc_res)
  end

  # POST /card_maker_ajax/decks/:deck_id/
  def set_deck_desc
    json_response(CardServiceCaller.set_deck_desc(
      logged_in_user.id, 
      params[:deck_id], 
      request.raw_post
    ))
  end


  # GET /card_maker_ajax/public/decks
  def get_public_decks
    json_response(CardServiceCaller.get_public_decks)
  end
  
  # GET /card_maker_ajax/public/cards
  def get_public_cards
    json_response(CardServiceCaller.get_public_cards)
  end

  ######################
  # Admin-only actions #
  ######################

  # POST /card_maker_ajax/decks/:deck_id/make_public
  def make_deck_public
    json_response(CardServiceCaller.make_deck_public(
      logged_in_user.id,
      params[:deck_id]
    ))
  end

  # POST /card_maker_ajax/decks/:deck_id/make_private
  def make_deck_private
    json_response(CardServiceCaller.make_deck_private(
      logged_in_user.id,
      params[:deck_id]
    ))
  end
  
  # POST /card_maker_ajax/decks/:deck_id/users
  def add_deck_user
    json_response(CardServiceCaller.add_deck_user(
      logged_in_user.id, 
      params[:deck_id],
      request.raw_post
    ))
  end

  # DELETE /card_maker_ajax/decks/:deck_id/users/:user_id
  def remove_deck_user
    json_response(CardServiceCaller.remove_deck_user(
      logged_in_user.id, 
      params[:deck_id],
      params[:user_id]
    ))
  end

  # GET /card_maker_ajax/decks/:deck_id/users
  def deck_users
    svcRes = CardServiceCaller.deck_users(
      logged_in_user.id,
      params[:deck_id]
    )

    if svcRes.code != 200
      return json_response(svcRes)
    end

    ownerId = svcRes["ownerId"]
    userIds = svcRes["userIds"]

    owner = User.find(ownerId)
    users = userIds.any? ? User.find(userIds) : []

    json_response_helper({
      :owner => {
        :userName => owner.user_name,
        :id => owner.id
      }, 
      :users => users.map do |u|
        {
          :id => u.id,
          :userName => u.user_name
        }
      end
    }, :ok) 
  end

  private
    def json_response(httpartyResponse)
      json_response_helper(httpartyResponse.body, httpartyResponse.code)
    end

    def json_response_helper(body, code)
      respond_to do |format|
        format.json do
          render(
            :json => body,
            :status => code
          )
        end
      end
    end

    def data_pass_thru_response(svc_res)
      content_type = svc_res.headers["content-type"]
      opts = {
        :status => svc_res.code,
        :type => svc_res.headers["content-type"]
      }

      opts[:disposition] = :inline unless svc_res.code != 200

      send_data svc_res.body, opts
    end

    def set_cache_headers
      response.headers["Cache-Control"] = "no-cache, no-store"
      response.headers["Pragma"] = "no-cache"
      response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
    end
end
