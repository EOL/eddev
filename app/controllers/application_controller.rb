class ApplicationController < ActionController::Base
  before_filter :set_locale
  before_filter :ensure_user

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def default_url_options(options = {})
    { locale: I18n.locale }.merge options
  end

  # Raise ApplicationController::ForbiddenError to trigger default 403 response
  class ForbiddenError < StandardError; end
  rescue_from ForbiddenError do |e|
    render(:file => File.join(Rails.root, 'public/403'), :status => 403, :layout => false)
  end

  def logged_in_user
    nil

    if session[:user_id]
      @logged_in_user ||= User.find(session[:user_id])
    end
  end

  def ensure_user
    if !logged_in_user
      raise ApplicationController::ForbiddenError
    end
  end

  def ensure_admin
    ensure_user

    if !logged_in_user.admin?
      raise ApplicationController::ForbiddenError
    end
  end

  protected
    def log_in(user_name, password)
      @logged_in_user = User.find_by(user_name: user_name).try(:authenticate, password)

      session[:user_id] = @logged_in_user.id if @logged_in_user 

      return @logged_in_user
    end

    def log_out
      session[:user_id] = nil
    end

  private
  def set_locale
    locale = params[:locale]

    # If we have a locale from the URL, set it for the duration of the request
    if !locale.nil?
      I18n.locale = locale
    # Always redirect to a url with an explicit locale.
    # If there is a user, redirect to the url from the request with the locale added
    elsif logged_in_user
      redirect_to url_for request.params.merge({locale: logged_in_user.locale})
    else
    # Redirect to the url from the request with the default locale added
      redirect_to url_for request.params.merge({locale: I18n.default_locale})
    end
  end
end
