class UserSessionsController < ApplicationController
  skip_before_filter :ensure_user, only: [:new, :create, :destroy]

  def new
    redirect_to root_url if logged_in_user
  end

  def create
    user_name = params[:user_session][:user_name]
    password =  params[:user_session][:password]

    user = log_in(user_name, password)

    if user
      redirect_to { "welcome#index" }
    else
      @msg = "Invalid username/password"

      if !User.find_by(:user_name => user_name)
        # If there isn't a User with that user_name, check if there is a LegacyUser.
        # If so, generate a UserMigrationInvitation and notify the user.
        legacy_user = LegacyUser.find_by(:user_name => user_name)
       
        if legacy_user
          # Create invitation    
          invitation = UserMigrationInvitation.create!(:legacy_user => legacy_user) 
          invitation_email = UserMigrationInvitationMailer.invitation_email(invitation) 
          invitation_email.deliver_now

          @msg = "Check your email for a link to change your password"
        end 
      end

      render :new
    end
  end

  def destroy
    log_out
  end
end
