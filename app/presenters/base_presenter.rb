class BasePresenter < SimpleDelegator
  attr_accessor :view

  def initialize(obj, view) 
    super(obj)
    @view = view
  end
end
