class UserSessionsController < ApplicationController
  skip_before_filter :ensure_user, only: [:new, :create, :destroy]

  def new
    # redirect_to root_url if logged_in_user
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user
      @msg = t("user_sessions.sign_in_success")
    else
      @msg = t("user_sessions.invalid_creds")
    end

    render :new
  end

  def destroy
    log_out
  end
end
