class WelcomeController < ApplicationController
  def index
    @account_panel_open = true if params[:account_panel_open]
    @new_user = User.new
  end
end
