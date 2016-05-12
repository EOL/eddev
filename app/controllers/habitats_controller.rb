class HabitatsController < ApplicationController
  before_action :set_habitat, only: [:show, :edit, :update, :destroy]

  # GET /habitats
  # GET /habitats.json
  def index
    @habitats = Habitat.all
  end

  # GET /habitats/1
  # GET /habitats/1.json
  def show
  end

  # GET /habitats/new
  def new
    @habitat = Habitat.new
  end

  # GET /habitats/1/edit
  def edit
  end

  # POST /habitats
  # POST /habitats.json
  def create
    @habitat = Habitat.new(habitat_params)

    respond_to do |format|
      if @habitat.save
        format.html { redirect_to @habitat, notice: 'Habitat was successfully created.' }
        format.json { render :show, status: :created, location: @habitat }
      else
        format.html { render :new }
        format.json { render json: @habitat.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /habitats/1
  # PATCH/PUT /habitats/1.json
  def update
    respond_to do |format|
      if @habitat.update(habitat_params)
        format.html { redirect_to @habitat, notice: 'Habitat was successfully updated.' }
        format.json { render :show, status: :ok, location: @habitat }
      else
        format.html { render :edit }
        format.json { render json: @habitat.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /habitats/1
  # DELETE /habitats/1.json
  def destroy
    @habitat.destroy
    respond_to do |format|
      format.html { redirect_to habitats_url, notice: 'Habitat was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_habitat
      @habitat = Habitat.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def habitat_params
      params.require(:habitat).permit(:name)
    end
end
