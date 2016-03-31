class I18nTestController < ApplicationController
  def index
    if params[:user_lang] && logged_in_user
      logged_in_user.update!(locale: params[:user_lang]) 
      I18n.locale = params[:user_lang]
      redirect_to "/i18ntest"
    end
  end
end
