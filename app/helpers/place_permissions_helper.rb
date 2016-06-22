module PlacePermissionsHelper
  def user_select_options
    user_options = User.all.map do |user|
      [user.user_name, user.id]  
    end

    options_for_select(user_options)
  end
end
