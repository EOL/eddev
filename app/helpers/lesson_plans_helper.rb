module LessonPlansHelper
  def lesson_plan_id(cat_id, lp_id) 
    "#{cat_id}-#{(lp_id)}"
  end

  def theme_order_class_for_index(index)
    THEME_ORDER_CLASSES[index]
  end

  private
    THEME_ORDER_CLASSES = ["first", "second", "third", "fourth", "fifth"]
end
