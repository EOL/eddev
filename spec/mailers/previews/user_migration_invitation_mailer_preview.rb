# Preview all emails at http://localhost:3000/rails/mailers/user_migration_invitation_mailer
class UserMigrationInvitationMailerPreview < ActionMailer::Preview
  def invitation_email
    UserMigrationInvitationMailer.invitation_email(UserMigrationInvitation.first)
  end
end
