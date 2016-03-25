class UserMigrationInvitationMailer < ApplicationMailer
  def invitation_email(invitation)
    @invitation = invitation
    @user = @invitation.legacy_user
    @url = migrate_user_url(invitation_token: @invitation.token)
    mail(to: @invitation.legacy_user.email, subject: "Change your EOL E&L password")
  end
end
