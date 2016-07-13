class LegacyCookieTestController < ApplicationController
  def index
    @user_name = cookies[:logged_in_user]
    @user_id   = cookies[:logged_in]
  end
end
