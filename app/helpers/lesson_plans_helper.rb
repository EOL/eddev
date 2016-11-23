module LessonPlansHelper
  GRADE_1_LESSONS = [  
    {
      :category => :adaptations,
      :title_key => "classification_1",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:card, :stats]
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:tree, :card]
    },
    {
      :category => :adaptations,
      :title_key => "classification_1",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:card, :stats]
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:tree, :card]
    },
  ]

  GRADE_2_LESSONS = [
    {
      :category => :adaptations,
      :title_key => "classification_1",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:card, :stats]
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:tree, :card]
    },
    {
      :category => :adaptations,
      :title_key => "classification_1",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:card, :stats]
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:tree, :card]
    },
  ]
  
  GRADE_3_LESSONS = [
    {
      :category => :adaptations,
      :title_key => "classification_1",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:card, :stats]
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:tree, :card]
    },
    {
      :category => :adaptations,
      :title_key => "classification_1",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:card, :stats]
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["objective_1", "objective_2"],
      :icons => [:tree, :card]
    },
  ]

  def grade_1_lessons
    GRADE_1_LESSONS
  end

  def grade_2_lessons
    GRADE_2_LESSONS
  end

  def grade_3_lessons
    GRADE_3_LESSONS
  end
end
