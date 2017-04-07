require 'card_service_caller'

class CardgenController < ApplicationController
  skip_before_action :verify_authenticity_token

  # POST cardgen.json
  def create
    response = CardServiceCaller.create_card(params)

    respond_to do |format|
      format.json { render :json => response }
    end
  end
end
