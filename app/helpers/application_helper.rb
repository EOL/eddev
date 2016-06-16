module ApplicationHelper
  def current_user_admin?
    logged_in_user && logged_in_user.admin?
  end
end
