class UserSessionsController < ApplicationController
  def new
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]
    @msg = "Invalid username/password"

    user = log_in(user_name, password)

    if user
      @msg = "Success!"
    elsif !User.find_by(user_name: user_name)
      # If there isn't a User with that user_name, check if there is a LegacyUser.
      # If so, generate a UserMigrationInvitation.
      legacy_user = LegacyUser.find_by(user_name: user_name)
     
      if legacy_user
        # Create invitation    
        invitation = UserMigrationInvitation.create!(legacy_user: legacy_user) 
        invitation_email = UserMigrationInvitationMailer.invitation_email(invitation) 
        invitation_email.deliver_no

        @msg = "Check your email for a link to change your password"
      end
    end

    render :new
  end

  def destroy
    log_out
  end
end
