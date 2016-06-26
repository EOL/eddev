# Common functionality for ContentModel controllers. Provides show and draft actions, 
# as well as utility methods for common behavior. This concern assumes that its 
# including class' name follows the convention of <SomeContentModels>Controller, and uses 
# this to instantiate the correct model in a before_action for all actions except index, 
# new, and create. This model instance is accessible via the instance variables 
# @content_model and @<model_name>, where the latter is constructed by calling underscore
# on the class name of the model (e.g., if the including class is named 
# "SomeContentModelsController", the instance variable is @some_content_model)
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

    render :show
  end

  protected
    def update_published_locales(model, locales)
      states_by_locale = model.states_by_locale

      I18n.available_locales.each do |locale|
        locale_state = states_by_locale[locale]
        locale_state.published = locales.nil? ? false : locales.include?(locale.to_s)
        locale_state.save!
      end
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
      instance_variable_set("@#{model_class_name.underscore}", @content_model)
    end

    def model_class_name
      self.class.name.sub(/Controller$/, "").singularize
    end
end
