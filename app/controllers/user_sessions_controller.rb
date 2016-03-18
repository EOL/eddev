class UserSessionsController < ApplicationController
  def new
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user
      @msg = "Success!"
    else
      @msg = "Invalid username/password"
    end

    render :new
  end

  def destroy
    log_out
  end
end
