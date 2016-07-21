class SignupConfirmationMailerPreview < ActionMailer::Preview
  def confirmation_email
    SignupConfirmationMailer.confirmation_email(User.last)
  end
end
