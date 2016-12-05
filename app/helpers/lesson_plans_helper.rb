module LessonPlansHelper
  GRADE_1_LESSONS = [  
    {
      :category => :classification,
      :title_key => "classification_1",
      :objective_keys => ["classify_adaptations_traits_html", "compare_contrast_discuss_html"],
      :icons => [],
      :desc_key => "what_is_classification_html",
      :file_name => "2-5_Classification1_WhatIsClassification",
      :guide_name => "2-5_Classification_LessonOverview"
    },
    {
      :category => :classification,
      :title_key => "classification_2",
      :objective_keys => ["classify_traits_characteristics_html", "compare_contrast_discuss_html"],
      :icons => [:card, :tree],
      :desc_key => "students_use_eol_species_html",
      :file_name => "2-5_Classification2_AnimalClassification",
      :guide_name => "2-5_Classification_LessonOverview"
    },
    {
      :category => :classification,
      :title_key => "plant_classification",
      :objective_keys => ["classify_flowering_html", "compare_contrast_plants_html"],
      :icons => [:card, :tree],
      :desc_key => "after_learning_flowering_html",
      :file_name => "2-5_Classification3_PlantClassification",
      :guide_name => "2-5_Classification_LessonOverview"
    },
    {
      :category => :classification,
      :title_key => "thats_classified",
      :objective_keys => ["classify_adaptations_traits_html", "compare_contrast_discuss_html"],
      :icons => [:card],
      :desc_key => "students_apply_go_fish_html",
      :file_name => "2-5_Classification3_PlantClassification",
      :guide_name => "2-5_Classification4_ThatsClassified"
    },
    {
      :category => :energy_flow,
      :title_key => "predators_and_prey",
      :objective_keys => ["classify_adaptations_traits_html", "visualize_energy_food_chains_html"],
      :icons => [:tree],
      :desc_key => "observations_predator_prey_html",
      :file_name => "2-5_EnergyFlow1_PredatorsAndPrey",
      :guide_name => "2-5_EnergyFlow_LessonOverview"
    },
    {
      :category => :energy_flow,
      :title_key => "producers_consumers",
      :desc_key => "students_become_experts_html",
      :objective_keys => ["investigate_organisms_energy_html", "identify_producers_consumers_html"],
      :icons => [],
      :file_name => "2-5_EnergyFlow2_ProducersConsumersDecomposers",
      :guide_name => "2-5_EnergyFlow_LessonOverview"
    },
    {
      :category => :energy_flow,
      :title_key => "building_food_chains",
      :desc_key => "after_learning_food_chains_html",
      :objective_keys => ["model_interrelationships_html", "manipulate_ecological_html"],
      :icons => [:tree],
      :file_name => "2-5_EnergyFlow3_BuildingFoodChains.pdf",
      :guide_name => "2-5_EnergyFlow_LessonOverview"
    },
    {
      :category => :energy_flow,
      :title_key => "food_chains_rummy",
      :desc_key => "synthesize_energy_flow_html",
      :objective_keys => ["build_food_chains_html", "discuss_interconnectedness_html", "explore_roles_html"],
      :icons => [],
      :file_name => "2-5_EnergyFlow4_FoodChainsRummy",
      :guide_name => "2-5_EnergyFlow_LessonOverview"
    },
    {
      :category => :energy_flow,
      :title_key => "decomposition",
      :desc_key => "podcast_destructive_power",
      :objective_keys => ["understand_fungi_sustain_html"],
      :icons => [],
      :absolute_url => "https://listenwise.com/lessons/71-fungi-sustains-ecosystems"
    },
  ]

  GRADE_2_LESSONS = []

  GRADE_3_LESSONS = []

  def grade_1_lessons
    GRADE_1_LESSONS
  end

  def grade_2_lessons
    GRADE_2_LESSONS
  end

  def grade_3_lessons
    GRADE_3_LESSONS
  end

  def lesson_plan_path(name)
    "/lesson_plans/#{name}.pdf"
  end
end
