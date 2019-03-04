class CardMakerController < ApplicationController
  before_action :disable_main_col
  before_action :set_js_translations
  before_action :main_nopad_bot
  before_action :nohero
  before_action :nofooter
  before_action :header_slim

  def index
  end

  def set_js_translations
    set_js_translations_root('shared')
  end
end
