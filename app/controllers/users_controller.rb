class UsersController < ApplicationController
  #before_action :set_user, only: [:show, :edit, :update, :destroy]
  #before_filter :ensure_admin
  before_action :require_user, :only => [:change_password_form, :change_password]
  before_action :set_password_reset_vars, :only => [:reset_password_form, :reset_password]

  # GET /users/new
  def new
    @user = User.new
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        SignupConfirmationMailer.confirmation_email(@user).deliver_now
        format.html { render :confirmation_pending }
        format.json do
          render :json => {
            :success => true,
            :msg => t("welcome.index.accounts.signup_success_msg")
          }
        end
      else
        format.html { render :new }

        format.json do
          render :json => {
            :success => false,
            :msg => t("welcome.index.accounts.signup_failure_msg"),
            :errors => @user.errors
          }
        end
      end
    end
  end

  def confirm
    @user = User.find_by_confirm_token!(params[:token])

    if !@user.confirmed?
      @user.confirm!
      flash[:notice] = t(".success", :user_name => @user.user_name)
      redirect_to login_path
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

  def change_password_form
  end

  def change_password
    auth_success = @user.authenticate(params[:user][:current_password])
    if !auth_success
      @user.errors.add(:current_password, :invalid, :message => "Current password is invalid")
    elsif @user.update(change_password_params.merge(:force_password_validation => true))
      @msg = t(".success")
    end

    render :change_password_form
  end

  def reset_password_form
  end

  def reset_password
    change_password_shared
  end

  def reset_password
    if @user.update(change_password_params.merge(:force_password_validation => true))
      @reset_token.mark_used if @reset_token
      flash[:notice] = t(".success")
      redirect_to login_path
    else
      render :reset_password_form
    end
  end

  def email_test
    @user = User.first
    render :confirmation_pending
  end

  private
  def set_user
    @user = User.find(params[:id])
  end

  def require_user
    @user = logged_in_user
    raise NotFoundError if @user.nil?
  end

  def set_password_reset_vars
    @reset_token = PasswordResetToken.find_valid_by_token(params[:token])
    @user = @reset_token.user
  end

  def user_params
    params.fetch(:user, {}).permit(:email, :user_name, :full_name, :password, :password_confirmation)
  end

  def change_password_params
    params.fetch(:user, {}).permit(:password, :password_confirmation)
  end
end
