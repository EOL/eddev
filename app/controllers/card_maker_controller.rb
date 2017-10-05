class CardMakerController < ApplicationController
  before_action :ensure_user
  before_action :disable_main_col
  before_action :set_js_translations

  def index
  end

  def js_packs
    ['card_maker']
  end

  def set_js_translations
    set_js_translations_root('shared')
  end
end
