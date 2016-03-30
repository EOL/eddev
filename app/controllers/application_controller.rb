class ApplicationController < ActionController::Base
  before_action :set_locale

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected
    def log_in(user_name, password)
      @logged_in_user = User.find_by(user_name: user_name).try(:authenticate, password)

      session[:user_id] = @logged_in_user.id if @logged_in_user 

      return @logged_in_user
    end

    def log_out
      session[:user_id] = nil
    end

    def logged_in_user
      @logged_in_user ||= User.find(session[:user_id])
    end
  
  private
    def set_locale
      I18n.locale = params[:locale] || I18n.default_locale
    end
end
