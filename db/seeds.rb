# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

#License.create_with(code: "CC BY").find_or_create_by!(translation_key: "attrib")
#License.create_with(code: "CC BY-SA").find_or_create_by!(translation_key: "attrib_share")
#License.create_with(code: "CC BY-NC").find_or_create_by!(translation_key: "attrib_noncom")
#License.create_with(code: "CC BY-NC-SA").find_or_create_by!(translation_key: "attrib_noncom_share")
#
#SinglePageContentModel.find_or_create_by!(name: "tinymce_test")
#
## Basic/admin user accounts (development only)
#case Rails.env
#when "development"
#  User.create_with(full_name: "Basic User",
#                   email: "basicuser@fakeemail.com",
#                   password: "pass1234",
#                   password_confirmation: "pass1234",
#                   active: true)
#      .find_or_create_by!(user_name: "basic")
#
#  User.create_with(full_name: "Admin User",
#                   email: "adminuser@fakeemail.com",
#                   password: "pass1234",
#                   password_confirmation: "pass1234",
#                   active: true,
#                   role: 'admin')
#      .find_or_create_by!(user_name: "admin")
#end

LessonPlanPerk.delete_all

species_card_perk = LessonPlanPerk.create!(
  :name_key => "species_cards",
  :icon_name => "card",
  :human_name => "species_cards"
)

bio_stats_perk = LessonPlanPerk.create!(
  :name_key => "bio_stats",
  :icon_name => "stats",
  :human_name => "bio_stats"
)

field_work_perk = LessonPlanPerk.create!(
  :name_key => "field_work",
  :icon_name => "tree",
  :human_name => "field_work"
)

#  create_table "lesson_plan_themes", force: :cascade do |t|
#    t.string   "name_key",   limit: 255
#    t.string   "icon_file",  limit: 255
#    t.datetime "created_at",             null: false
#    t.datetime "updated_at",             null: false
#  end
LessonPlanTheme.delete_all

classification_theme = LessonPlanTheme.create!(
  :name_key => "classification",
  :icon_file => "classification_icon.jpg",
  :human_name => "classification"
)

science_skills_theme = LessonPlanTheme.create!(
  :name_key => "science_skills",
  :icon_file => "science_skills_icon.jpg",
  :human_name => "science_skills"
)

human_impact_theme = LessonPlanTheme.create!(
  :name_key => "human_impact",
  :icon_file => "human_impact_icon.jpg",
  :human_name => "human_impact"
)

adaptations_theme = LessonPlanTheme.create!(
  :name_key => "adaptations",
  :icon_file => "adaptations_icon.jpg",
  :human_name => "adaptations"
)

energy_flow_theme = LessonPlanTheme.create!(
  :name_key => "energy_flow",
  :icon_file => "energy_flow_icon.jpg",
  :human_name => "energy_flow"
)

LessonPlanGradeLevel.delete_all
grade_level_0 = LessonPlanGradeLevel.create!(
  :name_key => "grades_2_5",
  :human_name => "2_5",
)

grade_level_1 = LessonPlanGradeLevel.create!(
  :name_key => "grades_6_8",
  :human_name => "6_8",
)

grade_level_2 = LessonPlanGradeLevel.create!(
  :name_key => "grades_9_12",
  :human_name => "9_12",
)

LessonPlan.delete_all
LessonPlan.create_with(:grade_level => grade_level_0).create!([
  {
    :theme => classification_theme,
    :name_key => "classification_1",
    :objective_keys => ["classify_adaptations_traits_html", "compare_contrast_discuss_html"],
    :perks => [],
    :desc_key => "what_is_classification_html",
    :file_name => "2-5_Classification1_WhatIsClassification",
    :overview_file_name => "2-5_Classification_LessonOverview"
  },
  {
    :theme => classification_theme,
    :name_key => "classification_2",
    :objective_keys => ["classify_traits_characteristics_html", "compare_contrast_discuss_html"],
    :perks => [species_card_perk, field_work_perk],
    :desc_key => "students_use_eol_species_html",
    :file_name => "2-5_Classification2_AnimalClassification",
    :overview_file_name => "2-5_Classification_LessonOverview"
  },
  {
    :theme => classification_theme,
    :name_key => "plant_classification",
    :objective_keys => ["classify_flowering_html", "compare_contrast_plants_html"],
    :perks => [species_card_perk, field_work_perk],
    :desc_key => "after_learning_flowering_html",
    :file_name => "2-5_Classification3_PlantClassification",
    :overview_file_name => "2-5_Classification_LessonOverview"
  },
  {
    :theme => classification_theme,
    :name_key => "thats_classified",
    :objective_keys => ["classify_adaptations_traits_html", "compare_contrast_discuss_html"],
    :perks => [species_card_perk],
    :desc_key => "students_apply_go_fish_html",
    :file_name => "2-5_Classification4_ThatsClassified",
    :overview_file_name => "2-5_Classification_LessonOverview",
    :human_name => "thats_classified"
  },
  {
    :theme => energy_flow_theme,
    :name_key => "predators_and_prey",
    :objective_keys => ["understand_predator_prey_html", "investigate_predator_prey_html", "visualize_energy_food_chains_html"],
    :perks => [field_work_perk],
    :desc_key => "observations_predator_prey_html",
    :file_name => "2-5_EnergyFlow1_PredatorsAndPrey",
    :overview_file_name => "2-5_EnergyFlow_LessonOverview"
  },
  {
    :theme => energy_flow_theme,
    :name_key => "producers_consumers",
    :desc_key => "students_become_experts_html",
    :objective_keys => ["investigate_organisms_energy_html", "identify_producers_consumers_html"],
    :perks => [],
    :file_name => "2-5_EnergyFlow2_ProducersConsumersDecomposers",
    :overview_file_name => "2-5_EnergyFlow_LessonOverview"
  },
  {
    :theme => energy_flow_theme,
    :name_key => "building_food_chains",
    :desc_key => "after_learning_food_chains_html",
    :objective_keys => ["model_interrelationships_html", "manipulate_ecological_html"],
    :perks => [field_work_perk],
    :file_name => "2-5_EnergyFlow3_BuildingFoodChains",
    :overview_file_name => "2-5_EnergyFlow_LessonOverview"
  },
  {
    :theme => energy_flow_theme,
    :name_key => "food_chains_rummy",
    :desc_key => "synthesize_energy_flow_html",
    :objective_keys => ["build_food_chains_html", "discuss_interconnectedness_html", "explore_roles_html"],
    :perks => [species_card_perk],
    :file_name => "2-5_EnergyFlow4_FoodChainsRummy",
    :overview_file_name => "2-5_EnergyFlow_LessonOverview"
  },
  {
    :theme => energy_flow_theme,
    :name_key => "decomposition",
    :desc_key => "podcast_destructive_power",
    :objective_keys => ["understand_fungi_sustain_html"],
    :perks => [],
    :external_url => "https://listenwise.com/lessons/71-fungi-sustains-ecosystems"
  },
  {
    :theme => adaptations_theme,
    :name_key => "adapting_to_environment",
    :desc_key => "after_learning_adaptations_html",
    :objective_keys => ["understand_adaptations_thrive_html", "differentiate_adaptations_html", "explore_growth_reproductive_html", "identify_key_adaptations_html"],
    :perks => [],
    :file_name => "2-5_Adaptations1_AdaptingToTheEnvironment",
    :overview_file_name => "2-5_Adaptations_LessonOverview"
  },
  {
    :theme => adaptations_theme,
    :name_key => "physical_adaptations",
    :desc_key => "explore_adaptations_beavers_html",
    :objective_keys => ["understand_physical_structural_html", "observe_beaks_infer_html"],
    :perks => [],
    :file_name => "2-5_Adaptations2_PhysicalAdaptations",
    :overview_file_name => "2-5_Adaptations_LessonOverview"
  },
  {
    :theme => adaptations_theme,
    :name_key => "behavioral_adaptations",
    :desc_key => "discuss_migration_monarch_html",
    :objective_keys => ["understand_actions_behaviors_html", "visualize_purpose_migration_html"],
    :perks => [],
    :file_name => "2-5_Adaptations3_BehavioralAdaptations",
    :overview_file_name => "2-5_Adaptations_LessonOverview"
  },
  {
    :theme => adaptations_theme,
    :name_key => "go_adapt",
    :desc_key => "synthesize_adaptations_go_fish_html",
    :objective_keys => ["identify_behavioral_physical_html", "classify_organisms_adaptations_html", "compare_contrast_adaptations_html", "interpret_explain_adaptations_html"],
    :perks => [species_card_perk],
    :file_name => "2-5_Adaptations4_GoAdapt",
    :overview_file_name => "2-5_Adaptations_LessonOverview",
    :human_name => "go_adapt"
  },
  {
    :theme => adaptations_theme,
    :name_key => "create_a_creature",
    :desc_key => "apply_understanding_adaptations_html",
    :objective_keys => ["design_share_adaptations_html", "synthesize_physical_behavioral_html"],
    :perks => [species_card_perk],
    :file_name => "2-5_Adaptations5_CreateACreature",
    :overview_file_name => "2-5_Adaptations_LessonOverview",
    :human_name => "create_a_creature"
  },
  {
    :theme => science_skills_theme,
    :name_key => "meet_a_creature",
    :desc_key => "practice_observations_describing_html",
    :objective_keys => ["interpret_draw_organism_html"],
    :perks => [],
    :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder1",
    :overview_file_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
  },
  {
    :theme => science_skills_theme,
    :name_key => "id_that_bird",
    :desc_key => "observe_cutouts_birds_html",
    :objective_keys => ["understand_binoculars_html", "practice_observation_field_html", "identify_birds_field_html"],
    :perks => [],
    :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder2",
    :overview_file_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
  },
  {
    :theme => science_skills_theme,
    :name_key => "how_diverse",
    :desc_key => "explore_bio_stats_html",
    :objective_keys => ["hypothesize_number_species_html", "explore_groups_animals_html"],
    :perks => [bio_stats_perk],
    :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder3",
    :overview_file_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
  },
  {
    :theme => science_skills_theme,
    :name_key => "modeling_classification",
    :desc_key => "classify_themselves_html",
    :objective_keys => ["classify_themselves_html", "practice_observation_skills_html", "apply_understanding_classification_html"],
    :perks => [],
    :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder4",
    :overview_file_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
  },
  {
    :theme => science_skills_theme,
    :name_key => "using_dichotomous_key",
    :desc_key => "observations_dichotomous_html",
    :objective_keys => ["practice_dichotomous_html"],
    :perks => [],
    :file_name => "2-5_ScienceSkills_BioblitzSkillbuilder5",
    :overview_file_name => "2-5_ScienceSkills_BioblitzSkillbuilderOverview"
  },
  {
    :theme => science_skills_theme,
    :name_key => "analyzing_bioblitz",
    :desc_key => "investigate_analyze_biodiversity",
    :objective_keys => ["analyze_biodiversity_bioblitz_html", "descriptive_statistics_html", "inferences_biodiversity_html"],
    :perks => [bio_stats_perk],
    :external_url => "http://nationalgeographic.org/activity/analyzing-bioblitz-data/"
  },
])

LessonPlan.create_with(:grade_level => grade_level_1).create!([
  {
    :theme => science_skills_theme,
    :name_key => "meet_a_creature",
    :desc_key => "practice_observations_describing_html",
    :objective_keys => ["interpret_draw_organism_html"],
    :perks => [],
    :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder1",
    :overview_file_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
  },
  {
    :theme => science_skills_theme,
    :name_key => "id_that_bird",
    :desc_key => "observe_cutouts_birds_html",
    :objective_keys => ["understand_binoculars_html", "practice_observation_field_html", "identify_birds_field_html"],
    :perks => [],
    :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder2",
    :overview_file_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
  },
  {
    :theme => science_skills_theme,
    :name_key => "how_diverse",
    :desc_key => "explore_bio_stats_html",
    :objective_keys => ["hypothesize_number_species_html", "explore_groups_animals_html"],
    :perks => [bio_stats_perk],
    :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder3",
    :overview_file_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
  },
  {
    :theme => science_skills_theme,
    :name_key => "modeling_classification",
    :desc_key => "classify_themselves_html",
    :objective_keys => ["classify_themselves_html", "practice_observation_skills_html", "apply_understanding_classification_html"],
    :perks => [],
    :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder4",
    :overview_file_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
  },
  {
    :theme => science_skills_theme,
    :name_key => "using_dichotomous_key",
    :desc_key => "observations_dichotomous_html",
    :objective_keys => ["practice_dichotomous_html"],
    :perks => [],
    :file_name => "6-8_ScienceSkills_BioblitzSkillbuilder5",
    :overview_file_name => "6-8_ScienceSkills_BioblitzSkillbuilderOverview",
  },
  {
    :theme => science_skills_theme,
    :name_key => "analyzing_bioblitz",
    :desc_key => "investigate_analyze_biodiversity",
    :objective_keys => ["analyze_biodiversity_bioblitz_html", "descriptive_statistics_html", "inferences_biodiversity_html"],
    :perks => [bio_stats_perk],
    :external_url => "http://nationalgeographic.org/activity/analyzing-bioblitz-data/"
  },
  {
    :theme => energy_flow_theme,
    :name_key => "producers_consumers2",
    :desc_key => "students_become_experts_html",
    :objective_keys => ["investigate_organisms_energy_html", "identify_producers_consumers_html"],
    :perks => [],
    :file_name => "6-8_FoodWebs1_ProducersConsumersDecomposers",
    :overview_file_name => "6-8_FoodWebs_LessonOverview",
  },
  {
    :theme => energy_flow_theme,
    :name_key => "food_web_systems",
    :desc_key => "model_complex_system_html",
    :objective_keys => ["model_interrelationships_html"],
    :perks => [],
    :file_name => "6-8_FoodWebs2_FoodWebSystems",
    :overview_file_name => "6-8_FoodWebs_LessonOverview",
  },
  {
    :theme => energy_flow_theme,
    :name_key => "food_chains_webs",
    :desc_key => "practice_chains_webs_html",
    :objective_keys => ["describe_energy_food_chains_html", "model_interrelationships_html", "manipulate_ecological_html"],
    :perks => [species_card_perk],
    :file_name => "6-8_FoodWebs3_FoodChainsAndWebs",
    :overview_file_name => "6-8_FoodWebs_LessonOverview",
  },
  {
    :theme => energy_flow_theme,
    :name_key => "food_webs_chains_rummy",
    :desc_key => "synthesize_energy_flow_html",
    :objective_keys => ["build_food_chains_html", "discuss_interconnectedness_html", "synthesize_understanding_roles_html"],
    :perks => [species_card_perk],
    :file_name => "6-8_FoodWebs4_FoodChainsRummy",
    :overview_file_name => "6-8_FoodWebs_LessonOverview",
    :human_name => "food_chains_rummy"
  },
  {
    :theme => adaptations_theme,
    :name_key => "whale_communication",
    :desc_key => "podcast_whale_communication_html",
    :objective_keys => ["discuss_studying_whales_html", "how_why_whale_communication_html"],
    :perks => [],
    :external_url => "https://listenwise.com/teach/lessons/84-right-whales" 
  },
  {
    :theme => adaptations_theme,
    :name_key => "behavior_hibernation",
    :desc_key => "simulation_hibernation_html",
    :objective_keys => ["experiment_habitat_hibernating_html"],
    :perks => [],
    :external_url => "http://www.outdoorbiology.com/files/resources/activities/Anti-freeze.pdf"
  },
  {
    :theme => adaptations_theme,
    :name_key => "behavior_camouflage",
    :desc_key => "invent_imaginary_animal_html",
    :objective_keys => ["understand_coloring_markings_html"],
    :perks => [],
    :external_url => "http://www.outdoorbiology.com/files/resources/activities/InventAnAnimal.pdf"
  },
  {
    :theme => human_impact_theme,
    :name_key => "coral_bleaching",
    :desc_key => "podcast_climate_coral_html",
    :objective_keys => ["understand_physical_corals_html", "discuss_threats_coral_html"],
    :perks => [],
    :external_url => "https://listenwise.com/teach/lessons/63-corals-and-climate-change"
  },
  {
    :theme => human_impact_theme,
    :name_key => "crayfish_commerce",
    :desc_key => "podcast_business_crawfish_html",
    :objective_keys => ["examine_business_biodiversity_html"],
    :perks => [],
    :external_url => "http://nationalgeographic.org/media/tiny-travelers/"
  },
  {
    :theme => human_impact_theme,
    :name_key => "dolphins_bycatch",
    :desc_key => "podcast_dolphins_tuna_html",
    :objective_keys => ["discuss_tuna_dolphins_html", "understand_dolphin_tissue_html"],
    :perks => [],
    :external_url => "https://listenwise.com/teach/lessons/87-spotted-dolphins-and-spinner-dolphins"
  },
  {
    :theme => human_impact_theme,
    :name_key => "ocean_acidification",
    :desc_key => "podcast_ocean_acidification_html",
    :objective_keys => ["understand_role_sea_butterflies_html", "observe_acidification_pteropods_html"],
    :perks => [],
    :external_url => "http://nationalgeographic.org/media/one-species-time-sea-butterfly/"
  },
])

LessonPlan.create_with(:grade_level => grade_level_2).create!([
  {
    :theme => science_skills_theme,
    :name_key => "investigating_bio_inat",
    :desc_key => "explore_inat_data",
    :objective_keys => ["explore_local_observations_html", "investigate_analyze_inat_html", "draw_inferences_patterns_html"],
    :perks => [bio_stats_perk, field_work_perk],
    :file_name => "9-12_ScienceSkills_iNaturalistDataAnalysis",
  },
  {
    :theme => energy_flow_theme,
    :name_key => "interdependence_food_chains_webs",
    :desc_key => "practice_chains_webs_html",
    :objective_keys => ["describe_energy_food_chains_html", "build_examine_food_chains_html", "manipulate_ecological_html"],
    :perks => [species_card_perk],
    :file_name => "9-12_Interdependence1_FoodChainsAndWebs",
    :overview_file_name => "9-12_Interdependence_LessonOverview",
  },
  {
    :theme => energy_flow_theme,
    :name_key => "interdependence_food_web_systems",
    :desc_key => "model_complex_system_html",
    :objective_keys => ["model_interrelationships_html"],
    :perks => [],
    :file_name => "9-12_Interdependence2_FoodWebSystems",
    :overview_file_name => "9-12_Interdependence_LessonOverview",
  },
  {
    :theme => energy_flow_theme,
    :name_key => "interdependence_rummy",
    :desc_key => "synthesize_energy_flow_html",
    :objective_keys => ["build_food_chains_webs_html", "discuss_interconnectedness_html", "synthesize_understanding_roles_html"],
    :perks => [species_card_perk],
    :file_name => "9-12_Interdependence3_FoodChainsRummy",
    :overview_file_name => "9-12_Interdependence_LessonOverview",
    :human_name => "food_chains_rummy"
  },
])

Deck.delete_all
Deck.create!([
  {
    :title_key  => "aquatic",
    :desc_key   => "aquatic",
    :image_file_name => "aquatic_insects",
    :file_name => "aquatic_insects"
  },
  {
    :title_key => "bioblitz",
    :subtitle_key => "common_animal_groups",
    :desc_key => "bioblitz_common",
    :image_file_name => "bioblitz_common",
    :file_name => "bioblitz",
    :human_name => "bioblitz_common"
  },
  {
    :title_key => "earthwatch",
    :subtitle_key => "california_urban_tree",
    :desc_key => "earthwatch_cali_tree",
    :image_file_name => "earthwatch",
    :file_name => "earthwatch_trees"
  },
  {
    :title_key => "new_england",
    :subtitle_key => "bh_rocky_inter",
    :desc_key => "ne_bh_rocky",
    :image_file_name => "new_england_rocky",
    :file_name => "ne_rocky_intertidal"
  },
  {
    :title_key  => "new_england",
    :subtitle_key    => "ecocolumn",
    :desc_key   => "ecocolumn",
    :image_file_name => "ecocolumn",
    :file_name => "ne_ecocolumn"
  },
  {
    :title_key => "new_england",
    :subtitle_key => "urban_habitat_adaptations",
    :desc_key => "ne_urban",
    :image_file_name => "ne_urban",
    :file_name => "ne_urban",
  },
#  {
#    :title_key => "new_england",
#    :subtitle_key => "vernal_pools",
#    :desc_key => "ne_vernal",
#    :image_file_name => "ne_vernal",
#    :file_name => "not_found"
#  },
#  {
#    :title_key => "new_england",
#    :subtitle_key => "wright_farm",
#    :desc_key => "ne_wright",
#    :image_file_name => "ne_wright",
#    :file_name => "not_found"
#  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "adaptations",
    :desc_key => "okaloosa_adapt",
    :image_file_name => "okaloosa_adapt",
    :file_name => "okaloosa_adaptations"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "biodiversity",
    :desc_key => "okaloosa_bio",
    :image_file_name => "okaloosa_bio",
    :file_name => "okaloosa_biodiversity",
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "coastal_uplands",
    :desc_key => "okaloosa_coastal",
    :image_file_name => "okaloosa_coastal",
    :file_name => "okaloosa_coastal"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "common_mammals",
    :desc_key => "okaloosa_common_mammals",
    :image_file_name => "okaloosa_mammals",
    :file_name => "okaloosa_mammals"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "common_plants",
    :desc_key => "okaloosa_common_plants",
    :image_file_name => "okaloosa_plants",
    :file_name => "okaloosa_plants" 
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "freshwater_forested",
    :desc_key => "okaloosa_freshwater",
    :image_file_name => "okaloosa_freshwater",
    :file_name => "okaloosa_freshwater_forested"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "hardwood_forested",
    :desc_key => "okaloosa_hardwood",
    :image_file_name => "okaloosa_hardwood",
    :file_name => "okaloosa_hardwood_forested"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "pines_sandhill",
    :desc_key => "okaloosa_pines",
    :image_file_name => "okaloosa_pine",
    :file_name => "okaloosa_pines_sandhill"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "sea_turtles",
    :desc_key => "okaloosa_sea_turtles",
    :image_file_name => "okaloosa_turtles",
    :file_name => "okaloosa_sea_turtles"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "urban_habitats",
    :desc_key => "okaloosa_urban",
    :image_file_name => "okaloosa_urban",
    :file_name => "okaloosa_urban"
  },
#  {
#    :title_key => "okaloosa",
#    :subtitle_key => "common_birds",
#    :desc_key => "okaloosa_common_birds",
#    :image_file_name => "okaloosa_birds",
#    :file_name => "not_found"
#  },
#  {
#    :title_key => "okaloosa",
#    :subtitle_key => "emammal_camera",
#    :desc_key => "okaloosa_emammal",
#    :image_file_name => "okaloosa_emammal",
#    :file_name => "not_found"
#  },
])
