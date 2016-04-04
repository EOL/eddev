module ApplicationHelper
  def logged_in_user
    nil

    if session[:user_id]
      @logged_in_user ||= User.find(session[:user_id])
    end
  end

  def ensure_admin
    if !logged_in_user || !logged_in_user.admin?
      raise ApplicationController::ForbiddenError
    end
  end
end
