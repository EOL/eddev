class HabitatsController < ApplicationController
  include ContentModelController

  before_action :set_place
  before_action :ensure_place_owner, :only => [:new, :create, :update, :edit, :destroy, :copy]
  before_action :set_all_habitats, :only => [:new, :create]

  # GET /places/1/habitats
  def index
    @habitats = Habitat.where(place: @place)
  end

  # GET /places/1/habitats/new
  def new
    @habitat = Habitat.new(place: @place)
  end

  # GET /places/1/habitats/1/langs_with_content.json
  def langs_with_content
    respond_to do |format|
      json_langs = @habitat.locales_with_content.collect do |locale|
        { lang: locale }
      end

      format.json { render json: { langs: json_langs } }
    end
  end

  # GET /places/1/habitats/1/edit
  def edit
  end

  # POST /places/1/habitats
  def create
    @habitat = Habitat.new(habitat_params)
    saved = @habitat.save

    to_copy_id = params[:habitat_to_copy_id]

    if saved && !to_copy_id.blank?
      to_copy = Habitat.find(params[:habitat_to_copy_id])
    
      if saved
        to_copy.copy_locale_contents(@habitat, params[:habitat_copy_langs])
      end
    end

    respond_to do |format|
      if saved
        format.html { redirect_to place_habitat_path(@place, @habitat), notice: 'Habitat was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /places/1/habitats/1
  def update
    respond_to do |format|
      habitat_update_success = false

      Habitat.transaction do
        habitat_update_success = @habitat.update(habitat_params)

        if habitat_update_success
          update_published_locales(@habitat, params[:published_locales])
        end
      end

      if habitat_update_success
        format.html { redirect_to place_habitat_path(@place, @habitat), notice: 'Habitat was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /places/1/habitats/1
  def destroy
    @habitat.destroy
    respond_to do |format|
      format.html { redirect_to place_path(@place), notice: 'Habitat was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_habitat
      @habitat = Habitat.find(params[:id])
    end

    def set_all_habitats
      @all_habitats = Habitat.all_ordered_alpha_with_place
    end

    def set_place
      @place = Place.find(params[:place_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def habitat_params
      params.require(:habitat).permit(:name, :place_id).merge(place_id: @place.id)
    end

    def ensure_place_owner
      forbidden_unless(@place.is_owned_by?(logged_in_user)) 
    end
end
