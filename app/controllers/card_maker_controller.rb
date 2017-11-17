class CardMakerController < ApplicationController
  before_action :ensure_user
  before_action :disable_main_col
  before_action :set_js_translations
  before_action :set_js_packs

  def index
  end

  def set_js_translations
    set_js_translations_root('shared')
  end

  def set_js_packs
    self.js_packs = ['card_maker']
  end
end
