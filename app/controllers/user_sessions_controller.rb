class UserSessionsController < ApplicationController
  before_action :redirect_if_logged_in, :only => [:new, :create]

  def new
    # This is added to the form as a hidden field
    @return_to = params[:return_to]
  end

  def create
    @return_to = params[:return_to]

    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    respond_to do |format|
      if user
        if @return_to
          redirect_target = @return_to
        else
          redirect_target = root_url
        end

        format.html { redirect_to redirect_target }
        format.json { render :json => {
          :success => true
        }}
      else
        @error_msg = t(".invalid_creds")

        format.html { render :new }
        format.json do
          render :json => {
            :success => false,
            :error_msg => @error_msg,
          }
        end
      end
    end
  end

  def destroy
    log_out
    redirect_to root_url
  end

  private
  def redirect_if_logged_in
    redirect_to root_url if logged_in_user
  end
end
