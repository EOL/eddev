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
      :file_name => "2-5_Classification4_ThatsClassified",
      :guide_name => "2-5_Classification_LessonOverview"
    },
    {
      :category => :energy_flow,
      :title_key => "predators_and_prey",
      :objective_keys => ["understand_predator_prey_html", "investigate_predator_prey_html", "visualize_energy_food_chains_html"],
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
      :file_name => "2-5_EnergyFlow3_BuildingFoodChains",
      :guide_name => "2-5_EnergyFlow_LessonOverview"
    },
    {
      :category => :energy_flow,
      :title_key => "food_chains_rummy",
      :desc_key => "synthesize_energy_flow_html",
      :objective_keys => ["build_food_chains_html", "discuss_interconnectedness_html", "explore_roles_html"],
      :icons => [:card],
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
    {
      :category => :adaptations,
      :title_key => "adapting_to_environment",
      :desc_key => "after_learning_adaptations_html",
      :objective_keys => ["understand_adaptations_thrive_html", "differentiate_adaptations_html", "explore_growth_reproductive_html", "identify_key_adaptations_html"],
      :icons => [],
      :file_name => "2-5_Adaptations1_AdaptingToTheEnvironment",
      :guide_name => "2-5_Adaptations_LessonOverview"
    },
    {
      :category => :adaptations,
      :title_key => "physical_adaptations",
      :desc_key => "explore_adaptations_beavers_html",
      :objective_keys => ["understand_physical_structural_html", "observe_beaks_infer_html"],
      :icons => [],
      :file_name => "2-5_Adaptations2_PhysicalAdaptations",
      :guide_name => "2-5_Adaptations_LessonOverview"
    },
    {
      :category => :adaptations,
      :title_key => "behavioral_adaptations",
      :desc_key => "discuss_migration_monarch_html",
      :objective_keys => ["understand_actions_behaviors_html", "visualize_purpose_migration_html"],
      :icons => [],
      :file_name => "2-5_Adaptations3_BehavioralAdaptations",
      :guide_name => "2-5_Adaptations_LessonOverview"
    },
    {
      :category => :adaptations,
      :title_key => "go_adapt",
      :desc_key => "synthesize_adaptations_go_fish_html",
      :objective_keys => ["identify_behavioral_physical_html", "classify_organisms_adaptations_html", "compare_contrast_adaptations_html", "interpret_explain_adaptations_html"],
      :icons => [:card],
      :file_name => "2-5_Adaptations4_GoAdapt",
      :guide_name => "2-5_Adaptations_LessonOverview"
    },
    {
      :category => :adaptations,
      :title_key => "create_a_creature",
      :desc_key => "apply_understanding_adaptations_html",
      :objective_keys => ["design_share_adaptations_html", "synthesize_physical_behavioral_html"],
      :icons => [:card],
      :file_name => "2-5_Adaptations5_CreateACreature",
      :guide_name => "2-5_Adaptations_LessonOverview"
    },
    {
      :category => :science_skills,
      :title_key => "meet_a_creature",
      :desc_key => "practice_observations_describing_html",
      :objective_keys => ["interpret_draw_organism_html"],
      :icons => [],
      :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder1",
      :guide_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
    },
    {
      :category => :science_skills,
      :title_key => "id_that_bird",
      :desc_key => "observe_cutouts_birds_html",
      :objective_keys => ["understand_binoculars_html", "practice_observation_field_html", "identify_birds_field_html"],
      :icons => [],
      :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder2",
      :guide_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
    },
    {
      :category => :science_skills,
      :title_key => "how_diverse",
      :desc_key => "explore_bio_stats_html",
      :objective_keys => ["hypothesize_number_species_html", "explore_groups_animals_html"],
      :icons => [:stats],
      :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder3",
      :guide_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
    },
    {
      :category => :science_skills,
      :title_key => "modeling_classification",
      :desc_key => "classify_themselves_html",
      :objective_keys => ["classify_themselves_html", "practice_observation_skills_html", "apply_understanding_classification_html"],
      :icons => [],
      :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder4",
      :guide_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
    },
    {
      :category => :science_skills,
      :title_key => "using_dichotomous_key",
      :desc_key => "observations_dichotomous_html",
      :objective_keys => ["practice_dichotomous_html"],
      :icons => [],
      :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder5",
      :guide_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
    },
    {
      :category => :science_skills,
      :title_key => "analyzing_bioblitz",
      :desc_key => "investigate_analyze_biodiversity",
      :objective_keys => ["analyze_biodiversity_bioblitz_html", "descriptive_statistics_html", "inferences_biodiversity_html"],
      :icons => [:stats],
      :absolute_url => "http://nationalgeographic.org/activity/analyzing-bioblitz-data/"
    },
  ]

  GRADE_2_LESSONS = [
    {
      :category => :science_skills,
      :title_key => "meet_a_creature",
      :desc_key => "practice_observations_describing_html",
      :objective_keys => ["interpret_draw_organism_html"],
      :icons => [],
      :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder1",
      :guide_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
    },
    {
      :category => :science_skills,
      :title_key => "id_that_bird",
      :desc_key => "observe_cutouts_birds_html",
      :objective_keys => ["understand_binoculars_html", "practice_observation_field_html", "identify_birds_field_html"],
      :icons => [],
      :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder2",
      :guide_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
    },
    {
      :category => :science_skills,
      :title_key => "how_diverse",
      :desc_key => "explore_bio_stats_html",
      :objective_keys => ["hypothesize_number_species_html", "explore_groups_animals_html"],
      :icons => [:stats],
      :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder3",
      :guide_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
    },
    {
      :category => :science_skills,
      :title_key => "modeling_classification",
      :desc_key => "classify_themselves_html",
      :objective_keys => ["classify_themselves_html", "practice_observation_skills_html", "apply_understanding_classification_html"],
      :icons => [],
      :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder4",
      :guide_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
    },
    {
      :category => :science_skills,
      :title_key => "using_dichotomous_key",
      :desc_key => "observations_dichotomous_html",
      :objective_keys => ["practice_dichotomous_html"],
      :icons => [],
      :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder5",
      :guide_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
    },
    {
      :category => :science_skills,
      :title_key => "analyzing_bioblitz",
      :desc_key => "investigate_analyze_biodiversity",
      :objective_keys => ["analyze_biodiversity_bioblitz_html", "descriptive_statistics_html", "inferences_biodiversity_html"],
      :icons => [:stats],
      :absolute_url => "http://nationalgeographic.org/activity/analyzing-bioblitz-data/"
    },
    {
      :category => :energy_flow,
      :title_key => "producers_consumers2",
      :desc_key => "students_become_experts_html",
      :objective_keys => ["investigate_organisms_energy_html", "identify_producers_consumers_html"],
      :icons => [],
      :file_name => "6-8_FoodWebs1_ProducersConsumersDecomposers",
      :guide_name => "6-8_FoodWebs_LessonOverview",
    },
    {
      :category => :energy_flow,
      :title_key => "food_web_systems",
      :desc_key => "model_complex_system_html",
      :objective_keys => ["model_interrelationships_html"],
      :icons => [],
      :file_name => "6-8_FoodWebs2_FoodWebSystems",
      :guide_name => "6-8_FoodWebs_LessonOverview",
    },
    {
      :category => :energy_flow,
      :title_key => "food_chains_webs",
      :desc_key => "practice_chains_webs_html",
      :objective_keys => ["describe_energy_food_chains_html", "model_interrelationships_html", "manipulate_ecological_html"],
      :icons => [:card],
      :file_name => "6-8_FoodWebs3_FoodChainsAndWebs",
      :guide_name => "6-8_FoodWebs_LessonOverview",
    },
    {
      :category => :energy_flow,
      :title_key => "food_webs_chains_rummy",
      :desc_key => "synthesize_energy_flow_html",
      :objective_keys => ["build_food_chains_html", "discuss_interconnectedness_html", "synthesize_understanding_roles_html"],
      :icons => [:card],
      :file_name => "6-8_FoodWebs4_FoodChainsRummy",
      :guide_name => "6-8_FoodWebs_LessonOverview",
    },
    {
      :category => :adaptations,
      :title_key => "whale_communication",
      :desc_key => "podcast_whale_communication_html",
      :objective_keys => ["discuss_studying_whales_html", "how_why_whale_communication_html"],
      :icons => [],
      :absolute_url => "https://listenwise.com/teach/lessons/84-right-whales" 
    },
    {
      :category => :adaptations,
      :title_key => "behavior_hibernation",
      :desc_key => "simulation_hibernation_html",
      :objective_keys => ["experiment_habitat_hibernating_html"],
      :icons => [],
      :absolute_url => "http://www.outdoorbiology.com/files/resources/activities/Anti-freeze.pdf"
    },
    {
      :category => :adaptations,
      :title_key => "behavior_camouflage",
      :desc_key => "invent_imaginary_animal_html",
      :objective_keys => ["understand_coloring_markings_html"],
      :icons => [],
      :absolute_url => "http://www.outdoorbiology.com/files/resources/activities/InventAnAnimal.pdf"
    },
    {
      :category => :human_impact,
      :title_key => "coral_bleaching",
      :desc_key => "podcast_climate_coral_html",
      :objective_keys => ["understand_physical_corals_html", "discuss_threats_coral_html"],
      :icons => [],
      :absolute_url => "https://listenwise.com/teach/lessons/63-corals-and-climate-change"
    },
    {
      :category => :human_impact,
      :title_key => "crayfish_commerce",
      :desc_key => "podcast_business_crawfish_html",
      :objective_keys => ["examine_business_biodiversity_html"],
      :icons => [],
      :absolute_url => "http://nationalgeographic.org/media/tiny-travelers/"
    },
    {
      :category => :human_impact,
      :title_key => "dolphins_bycatch",
      :desc_key => "podcast_dolphins_tuna_html",
      :objective_keys => ["discuss_tuna_dolphins_html", "understand_dolphin_tissue_html"],
      :icons => [],
      :absolute_url => "https://listenwise.com/teach/lessons/87-spotted-dolphins-and-spinner-dolphins"
    },
    {
      :category => :human_impact,
      :title_key => "ocean_acidification",
      :desc_key => "podcast_ocean_acidification_html",
      :objective_keys => ["understand_role_sea_butterflies_html", "observe_acidification_pteropods_html"],
      :icons => [],
      :absolute_url => "http://nationalgeographic.org/media/one-species-time-sea-butterfly/"
    },
  ]

  GRADE_3_LESSONS = [
    {
      :category => :science_skills,
      :title_key => "investigating_bio_inat",
      :desc_key => "explore_inat_data",
      :objective_keys => ["explore_local_observations_html", "investigate_analyze_inat_html", "draw_inferences_patterns_html"],
      :icons => [:stats, :tree],
      :file_name => "9-12_ScienceSkills_iNaturalistDataAnalysis",
    },
    {
      :category => :energy_flow,
      :title_key => "interdependence_food_chains_webs",
      :desc_key => "practice_chains_webs_html",
      :objective_keys => ["describe_energy_food_chains_html", "build_examine_food_chains_html", "manipulate_ecological_html"],
      :icons => [:card],
      :file_name => "9-12_Interdependence1_FoodChainsAndWebs",
      :guide_name => "9-12_Interdependence_LessonOverview",
    },
    {
      :category => :energy_flow,
      :title_key => "interdependence_food_web_systems",
      :desc_key => "model_complex_system_html",
      :objective_keys => ["model_interrelationships_html"],
      :icons => [],
      :file_name => "9-12_Interdependence2_FoodWebSystems",
      :guide_name => "9-12_Interdependence_LessonOverview",
    },
    {
      :category => :energy_flow,
      :title_key => "interdependence_rummy",
      :desc_key => "synthesize_energy_flow_html",
      :objective_keys => ["build_food_chains_webs_html", "discuss_interconnectedness_html", "synthesize_understanding_roles_html"],
      :icons => [:card],
      :file_name => "9-12_Interdependence3_FoodChainsRummy",
      :guide_name => "9-12_Interdependence_LessonOverview",
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

  def lesson_plan_path(name)
    "/lesson_plans/#{name}.pdf"
  end

  def lesson_plan_id(cat_id, lp_id) 
    "#{cat_id}-#{(lp_id)}"
  end
end
