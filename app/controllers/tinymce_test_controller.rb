class TinymceTestController < ApplicationController
  PAGE_NAME = "tinymce_test"

  def index
    @model = SinglePageContentModel.find_by_page_name(PAGE_NAME)
  end
end
