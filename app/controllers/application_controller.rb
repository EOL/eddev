class ApplicationController < ActionController::Base
  before_filter :set_locale
  before_filter :ensure_user
  before_filter :init_content_editor_state

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def default_url_options(options = {})
    { locale: I18n.locale }.merge options
  end

  # Raise ApplicationController::ForbiddenError to trigger default 404 response. We use 404 instead of 403 to avoid exposing the existence of forbidden resources to unauthorized users.
  class ForbiddenError < StandardError; end

  rescue_from ForbiddenError do |e|
    render(:file => File.join(Rails.root, 'public/404'), :status => 404, :layout => false)
  end

  def logged_in_user
    nil

    if session[:user_id]
      @logged_in_user ||= User.find(session[:user_id])
    end
  end
  helper_method :logged_in_user

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

    def set_content_model_state(state)
      @content_editor_state[:locale]     = state.locale
      @content_editor_state[:model_type] = state.content_model.class.name
      @content_editor_state[:model_id]   = state.content_model.id 
      @content_editor_state[:enable_publish] = state.has_unpublished_content?
    end

    def content_editor_state
      @content_editor_state
    end
    helper_method :content_editor_state

    def set_draft_page(draft_model)
      @draft_page = true
      @draft_model = draft_model
    end

    def set_draftable_page(draft_model)
      @draftable_page = true
      @draft_model = draft_model
    end

    def content_model
      @content_model
    end

    def draft_page?
      logged_in_user && @draft_page && @draft_model.can_be_edited_by?(logged_in_user)
    end
    helper_method :draft_page?

    def draftable_page?
      logged_in_user && @draftable_page && @draft_model.can_be_edited_by?(logged_in_user)
    end
    helper_method :draftable_page?

    def forbidden_unless(condition)
      raise ApplicationController::ForbiddenError unless condition
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

  def init_content_editor_state
    @content_editor_state = {}
  end
end
