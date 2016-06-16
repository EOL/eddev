module ContentModelController 
  extend ActiveSupport::Concern

  included do
    before_action :set_content_model,  :except => [:index, :new, :create]
    before_action :setup_draft_page,     :only => :draft
    before_action :setup_draftable_page, :only => :show
  end

  def show
  end

  def draft
    forbidden_unless(draft_page?)

    set_content_model_state(@content_model.state_for_locale(I18n.locale))
    render :show
  end

  private
    def setup_draft_page
      set_draft_page(@content_model)
    end

    def setup_draftable_page
      set_draftable_page(@content_model)
    end

    def set_content_model
      klazz = model_class_name.constantize
      @content_model = klazz.find(params[:id])
      instance_variable_set("@#{model_class_name.downcase}", @content_model)
    end

    def model_class_name
      self.class.name.sub(/Controller$/, "").singularize
    end
end
