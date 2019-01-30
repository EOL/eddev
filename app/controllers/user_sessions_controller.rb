class UserSessionsController < ApplicationController
  before_action :redirect_if_logged_in, :only => [:new, :create]

  def new
    # This is added to the form as a hidden field
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user && user.confirmed?
      session_redirect
    else
      if !user
        @error_msg = t(".invalid_creds")
      else
        @error_msg = t(".please_confirm_account")
      end
      render :new
    end
  end

  def destroy
    log_out
    session_redirect
  end

  def user_info
    respond_to do |format|
      format.json do
        role = if !logged_in_user
          nil
        elsif logged_in_user.admin?
          "admin"
        else
          "user"
        end
        render :json => { role: role }
      end
    end
  end

  private
  def redirect_if_logged_in
    session_redirect if logged_in_user
  end

  def session_redirect
    if session[:user_sessions_referrer]
      redirect_target = session[:user_sessions_referrer]
    else
      redirect_target = root_url
    end

    redirect_to redirect_target
  end
end
