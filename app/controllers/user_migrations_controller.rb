class UserMigrationsController < ApplicationController
  before_action :find_invitation
  skip_before_filter :ensure_user

  def new
  end

  def create
    legacy_user = @invitation.legacy_user
    
    # None of these saving calls are expected to fail. If they do, we have
    # a deep issue, and a 500 error is appropriate.
    user = User.create!(password:              params[:password],
                        password_confirmation: params[:password_confirmation],
                        user_name:             legacy_user.user_name,
                        full_name:             legacy_user.full_name,
                        email:                 legacy_user.email,
                        api_key:               legacy_user.api_key,
                        legacy_user:           legacy_user) 

    legacy_user.update!(user: user)
    @invitation.update!(force_expiration: true)

    redirect_to login_url
  end

  private
    def find_invitation
      @invitation = UserMigrationInvitation.find_by_token!(params[:invitation_token])
    end
end
