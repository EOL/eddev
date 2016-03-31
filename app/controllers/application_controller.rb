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
      nil

      if session[:user_id]
        @logged_in_user ||= User.find(session[:user_id])
      end
    end
    helper_method :logged_in_user
  
  private
  def set_locale
    locale = params[:locale]

    # Always prefer locale from url
    if !locale.nil?
      I18n.locale = locale
    # Otherwise, if the user has a locale that is not the default locale,
    # redirect to the same page with the locale parameter prepended.
    elsif logged_in_user && logged_in_user.locale != I18n.default_locale
      redirect_to url_for request.params.merge({locale: logged_in_user.locale})
    end
  end
end
