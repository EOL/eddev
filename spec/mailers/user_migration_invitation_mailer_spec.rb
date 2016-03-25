require "rails_helper"

describe UserMigrationInvitationMailer, type: :mailer do

  describe "#invitation_email" do
    let(:subject)    { "Change your EOL E&L password" }
    let(:invitation) { create(:user_migration_invitation) }
    let(:user)       { invitation.legacy_user }
    let(:mail)       { UserMigrationInvitationMailer.invitation_email(invitation) }

    before :each do
      @invitation = create :user_migration_invitation
    end  

    it "sets the correct subject" do
      expect(mail.subject).to eq(subject)
    end

    it "sets the correct recipient" do
      expect(mail.to).to eq([user.email])
    end

#    it "sets the correct @full_name" do
#      expect(mail.body.encoded).to match(user.full_name)
#    end
#
    it "sets the correct @user_name" do
      expect(mail.body.raw_source).to match(user.user_name)
    end

    it "sets the correct url" do
      url = migrate_user_url(invitation_token: invitation.token)
      expect(mail.body.raw_source).to match(url)
    end
  end
end
