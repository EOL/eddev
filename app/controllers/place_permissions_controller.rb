class PlacePermissionsController < ApplicationController
  before_action :set_place
  before_action :ensure_place_owner
  before_action :set_place_permission, only: [:show, :edit, :update, :destroy]

  # GET /place_permissions
  def index
    @place_permissions = @place.place_permissions
  end

  # GET /place_permissions/1
  def show
  end

  # GET /place_permissions/new
  def new
    @place_permission = PlacePermission.new
  end

  # GET /place_permissions/1/edit
  def edit
  end

  # POST /place_permissions
  def create
    @place_permission = PlacePermission.new(place_permission_params)

    respond_to do |format|
      if @place_permission.save
        format.html { redirect_to place_place_permissions_path(@place), notice: 'Place permission was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /place_permissions/1
  def update
    respond_to do |format|
      if @place_permission.update(place_permission_params)
        format.html { redirect_to place_place_permissions_path(@place), notice: 'Place permission was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /place_permissions/1
  def destroy
    @place_permission.destroy
    respond_to do |format|
      format.html { redirect_to place_permissions_url, notice: 'Place permission was successfully destroyed.' }
    end
  end

  private
    def set_place
      @place = Place.find(params[:place_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_place_permission
      @place_permission = PlacePermission.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_permission_params
      params.fetch(:place_permission, {}).permit(:user_id, :role).merge(:place => @place)
    end

    def ensure_place_owner
      forbidden_unless(@place.is_owned_by?(logged_in_user)) 
    end
end
