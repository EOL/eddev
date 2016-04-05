class GalleryPhotosController < ApplicationController
  before_action :set_gallery_photo, only: [:show, :edit, :update, :destroy]

  # GET /gallery_photos
  # GET /gallery_photos.json
  def index
    @gallery_photos = GalleryPhoto.all
  end

  # GET /gallery_photos/1
  # GET /gallery_photos/1.json
  def show
  end

  # GET /gallery_photos/new
  def new
    @gallery_photo = GalleryPhoto.new
  end

  # GET /gallery_photos/1/edit
  def edit
  end

  # POST /gallery_photos
  # POST /gallery_photos.json
  def create
    @gallery_photo = GalleryPhoto.new(gallery_photo_params)

    respond_to do |format|
      if @gallery_photo.save
        format.html { redirect_to @gallery_photo, notice: 'Gallery photo was successfully created.' }
        format.json { render :show, status: :created, location: @gallery_photo }
      else
        format.html { render :new }
        format.json { render json: @gallery_photo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /gallery_photos/1
  # PATCH/PUT /gallery_photos/1.json
  def update
    respond_to do |format|
      if @gallery_photo.update(gallery_photo_params)
        format.html { redirect_to @gallery_photo, notice: 'Gallery photo was successfully updated.' }
        format.json { render :show, status: :ok, location: @gallery_photo }
      else
        format.html { render :edit }
        format.json { render json: @gallery_photo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gallery_photos/1
  # DELETE /gallery_photos/1.json
  def destroy
    @gallery_photo.destroy
    respond_to do |format|
      format.html { redirect_to gallery_photos_url, notice: 'Gallery photo was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gallery_photo
      @gallery_photo = GalleryPhoto.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def gallery_photo_params
      params.require(:gallery_photo).permit(:image, :author, :caption)
    end
end
