class UserSessionsController < ApplicationController
#  skip_before_filter :ensure_user, only: [:new, :create, :destroy]

  def new
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user
      redirect_to "/"
    else
      @msg = t("user_sessions.invalid_creds")
      render :new
    end
  end

  def destroy
    log_out
    redirect_to "/"
  end
end
