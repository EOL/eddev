class UserSessionsController < ApplicationController
  # TODO: Change / redirects to root_path redirects once v2 homepage is deployed
  before_action :redirect_if_logged_in, :only => [:new, :create]

  def new
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user
      redirect_to "/"
    else
      @error_msg = t(".invalid_creds")
      render :new
    end
  end

  def destroy
    log_out
    redirect_to "/"
  end

  private
  def redirect_if_logged_in
    redirect_to "/" if logged_in_user
  end
end
