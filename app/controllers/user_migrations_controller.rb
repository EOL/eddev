class UserMigrationsController < ApplicationController
  def create
    invitation = UserMigrationInvitation.find_by_token!(params[:invitation_token])

    legacy_user = invitation.legacy_user
    User.create!(password:              params[:password],
                 password_confirmation: params[:password_confirmation],
                 user_name:             legacy_user.user_name,
                 full_name:             legacy_user.full_name,
                 email:                 legacy_user.email,
                 api_key:               legacy_user.api_key) 

    invitation.update!(force_expiration: true)
    legacy_user.update!(migrated: true)
  end
end
