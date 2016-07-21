class SignupConfirmationMailer < ApplicationMailer
  def confirmation_email(user)
    @user = user
    @confirm_url = users_confirm_url @user.confirm_token
    mail(to: @user.email, subject: 'Complete your EOL L&E registration')
  end
end
