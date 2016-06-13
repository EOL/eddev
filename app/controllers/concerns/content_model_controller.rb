module ContentModelController 
  extend ActiveSupport::Concern

  included do
    before_action :set_content_model
    before_action :set_draft_page,     :only => :draft
    before_action :set_draftable_page, :only => :show
  end

  def show
  end

  def draft
    set_content_model_state(@content_model.state_for_locale(I18n.locale))
    render :show
  end

  private
    def set_content_model
      klazz = model_class_name.constantize
      @content_model = klazz.find(params[:id])
      instance_variable_set("@#{model_class_name.downcase}", @content_model)
    end

    def model_class_name
      self.class.name.sub(/Controller$/, "").singularize
    end
end
