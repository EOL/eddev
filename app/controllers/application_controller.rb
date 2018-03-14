class ApplicationController < ActionController::Base
  before_action :set_locale
  before_action :store_user_sessions_referrer

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery :with => :exception

#  def default_url_options(options = {})
#    { locale: I18n.locale }.merge options
#  end

  # Raise ApplicationController::ForbiddenError to trigger default 404 response. We use 404 instead of 403 to avoid exposing the existence of forbidden resources to unauthorized users.
  class ForbiddenError < StandardError; end
  class NotFoundError  < StandardError; end

  rescue_from ForbiddenError, NotFoundError do |e|
    render_404
  end

  def logged_in_user
    nil

    if session[:user_id]
      @logged_in_user ||= User.find_by(:id => session[:user_id])
    end
  end
  helper_method :logged_in_user

  def ensure_user
    redirect_to login_path unless logged_in_user
  end

  def ensure_admin
    ensure_user
    forbidden_unless(logged_in_user.admin?)
  end

  protected
    def log_in(user_name, password)
      @logged_in_user = User.find_by(user_name: user_name).try(:authenticate, password)

      if @logged_in_user && @logged_in_user.confirmed?
        session[:user_id] = @logged_in_user.id
        @logged_in_user
      else
        nil
      end
    end

    def log_out
      session[:user_id] = cookies["logged_in"] = cookies["logged_in_user"] = nil
    end

    # Convenience method that raises ApplicationController::ForbiddenError if condition does not evaluate to true.
    def forbidden_unless(condition)
      raise ApplicationController::ForbiddenError unless condition
    end

    def disable_main_col
      @disable_main_col = true
    end

    def js_packs
      @js_packs || []
    end
    helper_method :js_packs

    def js_packs=(packs)
      @js_packs = packs
    end

    def set_js_translations_root(rootKey)
      @js_translations = I18n.t(rootKey).to_json.html_safe
    end

    def main_nopad_bot
      @main_nopad_bot = true
    end

    def main_nopad_bot?
      @main_nopad_bot || false    
    end
    helper_method :main_nopad_bot?
  private
  def set_locale
    locale = params[:locale]

    # If we have a locale from the URL, set it for the duration of the request
    if !locale.nil?
      I18n.locale = locale
    # If there is a user, redirect to the url from the request with the locale added
    elsif logged_in_user && logged_in_user.locale != I18n.default_locale
      redirect_to url_for request.params.merge({locale: logged_in_user.locale})
    end
    # Otherwise, we are on the / version of the site, and I18n will correctly
    # use the default locale
  end

  def init_content_editor_state
    @content_editor_state = {}
  end

  # Populate @content_editor_state (accessible by content_editor_state method) from a ContentModelState.
  # @content_editor_state is dumped to JSON in the footer for use by content_editor.js.
  def set_content_editor_state(state)
    @content_editor_state[:locale]     = state.locale
    @content_editor_state[:model_type] = state.content_model.class.name
    @content_editor_state[:model_id]   = state.content_model.id
    @content_editor_state[:enable_publish] = state.has_unpublished_content?
  end

  # Render standard 404 page
  def render_404
    render(:file => File.join(Rails.root, 'public/404'), :status => 404, :layout => false)
  end

  def store_user_sessions_referrer
    if (
      request.get? && 
      request.format.html? &&
      request.controller_class != UserSessionsController &&
      request.controller_class != UsersController &&
      !request.xhr?
    )
      session[:user_sessions_referrer] = request.fullpath
    end
  end
end
