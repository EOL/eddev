class PlacesController < ApplicationController
  include ContentModelController

  before_action :ensure_admin, :only => [:new, :edit, :create, :update, :destroy]

  # GET /places
  def index
    @places = Place.all
  end

  # GET /places/new
  def new
    @place = Place.new
  end

  # GET /places/1/edit
  def edit
  end

  # POST /places
  def create
    @place = Place.new(place_params)

    respond_to do |format|
      if @place.save
        format.html { redirect_to @place, notice: 'Place was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /places/1
  def update
    respond_to do |format|
      place_update_success = false

      Place.transaction do
        place_update_success = @place.update(place_params)

        if place_update_success
          published_locales = params[:published_locales]

          states_by_locale = @place.states_by_locale

          I18n.available_locales.each do |locale|
            locale_state = states_by_locale[locale]
            locale_state.published = published_locales.nil? ? false : published_locales.include?(locale.to_s)
            locale_state.save!
          end
        end
      end

      if place_update_success
        format.html { redirect_to @place, notice: 'Place was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /places/1
  def destroy
    @place.destroy

    respond_to do |format|
      format.html { redirect_to places_url, notice: 'Place was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_params
      params.require(:place).permit(:name)
    end
end
