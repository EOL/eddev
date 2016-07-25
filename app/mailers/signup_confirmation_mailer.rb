class SignupConfirmationMailer < ApplicationMailer
  def confirmation_email(user)
    @user = user
    @confirm_url = users_confirm_url @user.confirm_token
    mail(:to => @user.email, :subject => t(".subject"))
  end
end
