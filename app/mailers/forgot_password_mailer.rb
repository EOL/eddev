class ForgotPasswordMailer < ApplicationMailer
  def forgot_password_email(reset_token)
    @user = reset_token.user
    @url = reset_password_form_url reset_token.token
    mail(:to => @user.email, :subject => t(".subject"))
  end
end
