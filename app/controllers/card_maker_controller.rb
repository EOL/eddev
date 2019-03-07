class CardMakerController < ApplicationController
  before_action :disable_main_col
  before_action :set_js_translations
  before_action :main_nopad_bot
  before_action :nohero
  before_action :nofooter
  before_action :header_slim

  def index
    referrer = begin
                 request.referer ? URI(request.referer) : nil
               rescue => e
                 logger.warn("failed to parse request.referer", e)
                 nil
               end

    @back_path = (
      !session[:card_maker_referrer].blank? && 
      session[:card_maker_referrer] == referrer&.path
    ) ? 
    session[:card_maker_referrer] :
    root_path
  end

  def set_js_translations
    set_js_translations_root('shared')
  end
end
