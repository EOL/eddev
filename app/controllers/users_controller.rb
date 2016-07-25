class UsersController < ApplicationController
  #before_action :set_user, only: [:show, :edit, :update, :destroy]
  #before_filter :ensure_admin
  before_action :set_password_reset_vars, :only => [:reset_password, :change_password]

  # GET /users/new
  def new
    @user = User.new
    render "new"
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)
    notice = nil

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
      redirect_to login_path, :notice => "You have successfully completed your registration, #{@user.user_name}! You may now sign in."
    else
      raise NotFoundError
    end
  end

  def forgot_password
  end

  def forgot_password_email
    @user = User.find_by_user_name(params[:user_name])

    if @user && @user.confirmed?
      token = PasswordResetToken.create_for_user(@user)
      ForgotPasswordMailer.forgot_password_email(token).deliver_now
    else
      @error_msg = t(".invalid_user_name")
      render :forgot_password
    end
  end

  def reset_password
  end

  def change_password
    if @user.update(change_password_params)
      @reset_token.mark_used  
      redirect_to login_path, :notice => "Password successfully changed. You may now log in"
    else
      render :reset_password
    end
  end
#  # GET /users
#  # GET /users.json
#  def index
#    @users = User.all
#  end
#
#  # GET /users/1
#  # GET /users/1.json
#  def show
#  end
#
#  # GET /users/1/edit
#  def edit
#  end
#
#  # PATCH/PUT /users/1
#  # PATCH/PUT /users/1.json
#  def update
#    respond_to do |format|
#      whitelisted_params = user_params
#      
#      if whitelisted_params[:password].blank? && whitelisted_params[:password_confirmation].blank?
#        whitelisted_params.delete(:password)
#        whitelisted_params.delete(:password_confirmation)
#      end
#
#      if @user.update(whitelisted_params)
#        format.html { redirect_to @user, notice: 'User was successfully updated.' }
#        format.json { render :show, status: :ok, location: @user }
#      else
#        format.html { render :edit }
#        format.json { render json: @user.errors, status: :unprocessable_entity }
#      end
#    end
#  end
#
#  # DELETE /users/1
#  # DELETE /users/1.json
#  def destroy
#    @user.destroy
#    respond_to do |format|
#      format.html { redirect_to users_url, notice: 'User was successfully destroyed.' }
#      format.json { head :no_content }
#    end
#  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    def set_password_reset_vars
      @reset_token = PasswordResetToken.find_by_token!(params[:token])
      
      raise NotFoundError if @reset_token.expired?

      @user = @reset_token.user
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.fetch(:user, {}).permit(:email, :user_name, :full_name, :password, :password_confirmation, :api_key, :active, :role)
    end

    def change_password_params
      params.fetch(:user, {}).permit(:password, :password_confirmation)
    end
end
