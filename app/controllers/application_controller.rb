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
    redirect_to login_url unless logged_in_user
  end

  def ensure_admin
    ensure_user
    forbidden_unless(logged_in_user.admin?)
  end

  protected
    # Convenience method that raises ApplicationController::ForbiddenError if condition does not evaluate to true.
    def forbidden_unless(condition)
      raise ApplicationController::ForbiddenError unless condition
    end

    def log_in(user_name, password)
      @logged_in_user = User.find_by(user_name: user_name).try(:authenticate, password)

      session[:user_id] = @logged_in_user.id if @logged_in_user 

      return @logged_in_user
    end

    def log_out
      session[:user_id] = nil
    end

    # This method should be called in every controller action that results in a ContentModel draft page. 
    def set_draft_page(draft_model)
      @draft_page = true
      @draft_model = draft_model
      set_content_editor_state(draft_model.state_for_cur_locale)
    end

    # This method should be called in every controller action that results in a published ContentModel page for which there exists a draft view. 
    def set_draftable_page(draft_model)
      @draftable_page = true
      @draft_model = draft_model
    end

    # True if the current page is a draft view of a ContentModel and the current user has edit privileges, false o/w.
    def draft_page?
      logged_in_user && @draft_page && @draft_model.can_be_edited_by?(logged_in_user)
    end
    helper_method :draft_page?

    # True if the current page is a published view of a ContentModel for which there exists a draft view and the current user would be able to edit it.
    def draftable_page?
      logged_in_user && @draftable_page && @draft_model.can_be_edited_by?(logged_in_user)
    end
    helper_method :draftable_page?

    # Used to populate the window.ContentEditorState JS variable in the footer, which is used by the content editor JS.
    def content_editor_state
      @content_editor_state
    end
    helper_method :content_editor_state

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

    # Populate @content_editor_state (accessible by content_editor_state method) from a ContentModelState.
    # @content_editor_state is dumped to JSON in the footer for use by content_editor.js.
    def set_content_editor_state(state)
      @content_editor_state[:locale]     = state.locale
      @content_editor_state[:model_type] = state.content_model.class.name
      @content_editor_state[:model_id]   = state.content_model.id 
      @content_editor_state[:enable_publish] = state.has_unpublished_content?
    end
end
