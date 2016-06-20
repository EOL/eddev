module ApplicationHelper
  def current_user_admin?
    logged_in_user && logged_in_user.admin?
  end

  def cur_user_may_edit?(model)
    model.can_be_edited_by?(logged_in_user)
  end
end
