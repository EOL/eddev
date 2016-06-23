class UserMigrationsController < ApplicationController
  before_action :find_invitation
  skip_before_filter :ensure_user

  def new
    @user = User.new
  end

  def create

    legacy_user = @invitation.legacy_user
    
    @user = User.new(password:              user_params[:password],
                     password_confirmation: user_params[:password_confirmation],
                     user_name:             legacy_user.user_name,
                     full_name:             legacy_user.full_name,
                     email:                 legacy_user.email,
                     api_key:               legacy_user.api_key,
                     legacy_user:           legacy_user) 

    if @user.save
      # Neither of these update calls are expected to fail. If they do, we have
      # a deep issue, and a 500 error is appropriate.
      legacy_user.update!(:user => @user)
      @invitation.update!(force_expiration: true)

      redirect_to login_url
    else
      render :new
    end
  end

  private
    def find_invitation
      @invitation = UserMigrationInvitation.find_by_token!(params[:invitation_token])
    end

    def user_params
      @user_params ||= params.fetch(:user, {}).permit(:password, :password_confirmation)
    end
end
