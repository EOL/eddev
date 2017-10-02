class CardMakerController < ApplicationController
  before_action :ensure_user
  before_action :disable_main_col

  def index
  end

  def js_packs
    ['card_maker']
  end
end
