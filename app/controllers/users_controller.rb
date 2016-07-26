class UsersController < ApplicationController
  #before_action :set_user, only: [:show, :edit, :update, :destroy]
  #before_filter :ensure_admin
  before_action :set_password_reset_vars, :only => [:reset_password_form, :reset_password]

  # GET /users/new
  def new
    @user = User.new
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      SignupConfirmationMailer.confirmation_email(@user).deliver_now
      render :confirmation_pending
    else
      render :new
    end
  end

  def confirm
    @user = User.find_by_confirm_token!(params[:token])

    if !@user.confirmed?
      @user.confirm!
      redirect_to login_path, :notice => t(".success", :user_name => @user.user_name)
    else
      raise NotFoundError
    end
  end

  def forgot_password
  end

  def mail_password_reset_token
    @user = User.find_by_user_name(params[:user_name])

    if @user && @user.confirmed?
      token = PasswordResetToken.create_for_user(@user)
      ForgotPasswordMailer.forgot_password_email(token).deliver_now
    else
      @error_msg = t(".invalid_user_name")
      render :forgot_password
    end
  end

  def reset_password_form
  end

  def reset_password
    if @user.update(change_password_params.merge(:force_password_validation => true))
      @reset_token.mark_used  
      redirect_to login_path, :notice => t(".success")
    else
      render :reset_password_form
    end
  end

  private
  def set_user
    @user = User.find(params[:id])
  end

  def set_password_reset_vars
    @reset_token = PasswordResetToken.find_by_token!(params[:token])
    @user = @reset_token.user
  end

  def user_params
    params.fetch(:user, {}).permit(:email, :user_name, :full_name, :password, :password_confirmation)
  end

  def change_password_params
    params.fetch(:user, {}).permit(:password, :password_confirmation)
  end
end
