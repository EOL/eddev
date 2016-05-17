class HabitatsController < ApplicationController
  before_action :set_habitat, only: [:show, :edit, :update, :destroy]
  before_action :set_place

  # GET /places/1/habitats
  def index
    @habitats = Habitat.where(place: @place)
  end

  # GET /places/1/habitats/1
  def show
  end

  # GET /places/1/habitats/new
  def new
    @habitat = Habitat.new(place: @place)
  end

  # GET /places/1/habitats/1/edit
  def edit
  end

  # POST /places/1/habitats
  def create
    @habitat = Habitat.new(habitat_params)

    respond_to do |format|
      if @habitat.save
        format.html { redirect_to place_habitat_path(@place, @habitat), notice: 'Habitat was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /places/1/habitats/1
  def update
    respond_to do |format|
      if @habitat.update(habitat_params)
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
      format.html { redirect_to place_habitats_path(@place), notice: 'Habitat was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_habitat
      @habitat = Habitat.find(params[:id])
    end

    def set_place
      @place = Place.find(params[:place_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def habitat_params
      params.require(:habitat).permit(:name, :place_id)
    end
end
