class UserSessionsController < ApplicationController
  skip_before_filter :ensure_user, only: [:new, :create, :destroy]

  def new
    redirect_to root_url if logged_in_user
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user
      redirect_to { "welcome#index" }
    else
      render :new
    end
  end

  def destroy
    log_out
  end

  private
  def log_in(user_name, password)
    @logged_in_user = User.find_by(user_name: user_name).try(:authenticate, password)

    session[:user_id] = @logged_in_user.id if @logged_in_user 

    return @logged_in_user
  end

  def log_out
    session[:user_id] = nil
  end
end
