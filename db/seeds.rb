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
  {
    :theme => science_skills_theme,
    :name_key => "intro_to_biodiv",
    :desc_key => "explore_biodiv",
    :objective_keys => ["compare_biodiv_html", "hypo_species_html"],
    :perks => [bio_stats_perk, species_card_perk],
    :file_name => "9-12_CitSci1_IntroToBiodiversity",
    :overview_file_name => "9-12_CitSci-Overview",
    :human_name => "intro_to_biodiversity"
  },
  {
    :theme => science_skills_theme,
    :name_key => "biodiv_guided_cit_sci",
    :desc_key => "explore_broad_spectrum",
    :objective_keys => ["address_mis_sci_html", "explore_public_participate_html", "discuss_benefits_cit_sci_html"],
    :perks => [bio_stats_perk],
    :file_name => "9-12_CitSci2_CitSci-OpenSci-Presentation",
    :overview_file_name => "9-12_CitSci-Overview",
    :human_name => "citizen_science_presentation"
  },
  {
    :theme => science_skills_theme,
    :name_key => "biodiv_intro_inat",
    :desc_key => "students_learn_inat",
    :objective_keys => ["contribute_discover_biodiv_html", "practice_filter_inat_html"],
    :perks => [field_work_perk],
    :file_name => "9-12_CitSci3_IntroToINat",
    :overview_file_name => "9-12_CitSci-Overview",
    :human_name => "intro_to_inaturalist"
  },
  {
    :theme => science_skills_theme,
    :name_key => "biodiv_cnc_data",
    :desc_key => "using_data_cnc",
    :objective_keys => ["compare_cnc_html", "infer_species_html"],
    :perks => [bio_stats_perk],
    :file_name => "9-12_CitSci4_CNC-Data",
    :overview_file_name => "9-12_CitSci-Overview",
    :human_name => "cnc_data_exploration"
  },
])

Deck.delete_all
Deck.create!([
  {
    :title_key => "andorra",
    :subtitle_key => "add_vertebrates",
    :desc_key => "andorra_add_vertebrates",
    :file_name => "andorra_additional_vertebrates",
    :image_file_name => "andorra_add_verts"
  },
  {
    :title_key => "andorra",
    :subtitle_key => "fungi",
    :desc_key => "andorra_fungi",
    :file_name => "andorra_fungi",
    :image_file_name => "andorra_fungi"
  },
  {
    :title_key => "andorra",
    :subtitle_key => "plants",
    :desc_key => "andorra_plants",
    :file_name => "andorra_plants",
    :image_file_name => "andorra_plants"
  },
  {
    :title_key => "andorra",
    :subtitle_key => "passerine",
    :desc_key => "andorra_passerine",
    :file_name => "andorra_passerines",
    :image_file_name => "andorra_passerines"
  },
  {
    :title_key => "andorra",
    :subtitle_key => "small_mammals",
    :desc_key => "andorra_small_mammals",
    :file_name => "andorra_small_mammals",
    :image_file_name => "andorra_small_mammals"
  },
  {
    :title_key => "andorra",
    :subtitle_key => "snowbed_plants",
    :desc_key => "andorra_snowbed",
    :file_name => "andorra_snowbed",
    :image_file_name => "andorra_snowbed"
  },
  {
    :title_key  => "aquatic",
    :desc_key   => "aquatic",
    :image_file_name => "aquatic_insects",
    :file_name => "aquatic_insects"
  },
  {
    :title_key => "boston_harbor_islands",
    :subtitle_key => "coastal_adaptations",
    :desc_key => "bhi_coast_adapt",
    :image_file_name => "boston_harbor_islands_adaptations",
    :file_name => "boston_harbor_islands_adaptations"
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
    :title_key  => "mt_auburn",
    :subtitle_key    => "amphibians_reptiles",
    :desc_key   => "mt_auburn",
    :image_file_name => "mt_auburn_amphibians_reptiles",
    :file_name => "mt_auburn_amphibians_reptiles"
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
  {
    :title_key => "new_england",
    :subtitle_key => "vernal_pools",
    :desc_key => "ne_vernal",
    :image_file_name => "ne_vernal",
    :file_name => "ne_vernal"
  },
  {
    :title_key => "new_england",
    :subtitle_key => "wright_farm",
    :desc_key => "ne_wright",
    :image_file_name => "ne_wright_farm",
    :file_name => "ne_wright_farm"
  },
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
    :subtitle_key => "common_amphibians",
    :desc_key => "okaloosa_common_amphibians",
    :image_file_name => "okaloosa_common_amphibians",
    :file_name => "okaloosa_common_amphibians"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "common_birds",
    :desc_key => "okaloosa_common_birds",
    :image_file_name => "okaloosa_birds",
    :file_name => "okaloosa_birds"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "common_invertebrates",
    :desc_key => "okaloosa_common_invertebrates",
    :image_file_name => "okaloosa_common_invertebrates",
    :file_name => "okaloosa_common_invertebrates"
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
    :subtitle_key => "common_reptiles",
    :desc_key => "okaloosa_common_reptiles",
    :image_file_name => "okaloosa_common_reptiles",
    :file_name => "okaloosa_common_reptiles"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "common_schoolyard",
    :desc_key => "okaloosa_common_schoolyard",
    :image_file_name => "okaloosa_common_schoolyard",
    :file_name => "okaloosa_common_schoolyard"
  },
  {
    :title_key => "okaloosa",
    :subtitle_key => "emammal",
    :desc_key => "okaloosa_emammal",
    :image_file_name => "okaloosa_emammal",
    :file_name => "okaloosa_emammal"
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
  {
    :title_key => "sea_turtles",
    :subtitle_key => "species_conservation",
    :desc_key => "sea_turtles",
    :image_file_name => "sea_turtles",
    :file_name => "sea_turtles"
  }
])

EarthTour.delete_all
EarthTour.create!([
  {
    :title_key => "monarch_migration",
    :desc_key => "monarch_migration_html",
    :embed_url => "https://www.youtube.com/embed/uqDwvuleRYc",
    :extra_link_key => "monarch_spanish",
    :extra_link_url => "http://www.youtube.com/watch?v=zr5nQ7uOxR4"
  },
  {
    :title_key => "tern_migration",
    :desc_key => "tern_migration_html",
    :embed_url => "https://www.youtube.com/embed/bte7MCSBZvo",
    :extra_link_key => "tern_discussion",
    :extra_link_url => "https://drive.google.com/file/d/0B6YygMcm7lznNXB3SGZXZ21Ed0U/view?usp=sharing"
  },
  {
    :title_key => "invasive_species",
    :desc_key => "invasive_species_html",
    :embed_url => "https://www.youtube.com/embed/1aSSKDrxkbg"
  },
  {
    :title_key => "bluefin_tuna",
    :desc_key => "bluefin_tuna_html",
    :embed_url => "https://www.youtube.com/embed/KWxGuLLEywg"
  }
])

category_groups = {}
PodcastCategoryGroup.delete_all

category_groups[:skills] = PodcastCategoryGroup.create!({
  name: "Skills"
})
category_groups[:themes] = PodcastCategoryGroup.create!({
  name: "Themes"
})
category_groups[:taxon_groups] = PodcastCategoryGroup.create!({
  name: "Taxonomic Groups"
})

PodcastCategory.delete_all

PodcastCategory.create!([
  {
    name: "Classify",
    group: category_groups[:skills],
    perm_id: 0,
    desc: "Taxonomic classification refers to the organization of organisms by traits, such as size, color, or form, or by their degree of genetic relatedness."
  },
  {
    name: "Measure",
    group: category_groups[:skills],
    perm_id: 1,
    desc: "To determine the size, amount, or degree of an object by using an instrument or device marked in standard units or by comparing it with an object of known size."
  },
  {
    name: "Experiment",
    group: category_groups[:skills],
    perm_id: 2,
    desc: "A scientific procedure undertaken to make a discovery, test a hypothesis, or demonstrate a known fact."
  },
  {
    name: "Observe",
    group: category_groups[:skills],
    perm_id: 3,
    desc: "To notice or perceive something, such as a shape, movement, sound, occurrence or behavior, and to describe or record it in a drawing, with notes or with an instrument, such as a camera or sound recorder."
  },
  {
    name: "Behavior",
    group: category_groups[:themes],
    perm_id: 4,
    desc: "Behavior is a term used to describe the actions and reactions of an organism in relation to its environment."
  },
  {
    name: "Citizen Science",
    group: category_groups[:themes],
    perm_id: 5,
    desc: "Citizen science, often called Public Participation in Scientific Research (PPSR), refers to activities in which volunteers, such as students, the general public and enthusiasts partner with scientists to collect information and answer real-world questions."
  },
  {
    name: "Conservation",
    group: category_groups[:themes],
    perm_id: 6,
    desc: "Conservation is a term used to describe efforts to save, restore and protect species and natural resources such as biodiversity, soil and water from negative human impacts."
  },
  {
    name: "Ecology",
    group: category_groups[:themes],
    perm_id: 7,
    desc: "Ecology is the study of the interrelationships among plants, animals and other organisms and their interaction with all aspects of their natural environment."
  },
  {
    name: "Evolution",
    group: category_groups[:themes],
    perm_id: 8,
    desc: "Evolution is the change in the inherited traits of biological populations over successive generations."
  },
  {
    name: "Impacts",
    group: category_groups[:themes],
    perm_id: 9,
    desc: "Human impacts on biodiversity include habitat loss and climate change as well as the work scientists, students and the general public are doing to minimize these impacts."
  },
  {
    name: "Research",
    group: category_groups[:themes],
    perm_id: 10,
    desc: "Scientific research being done to both discover new species as well us to understand how biodiversity information from the past can help us in the future."
  },
  {
    name: "Amphibians",
    group: category_groups[:taxon_groups],
    perm_id: 11,
    desc: "Amphibians are vertebrates in the taxonomic class Amphibia, including animals such as frogs and toads, salamanders, and caecilians."
  },
  {
    name: "Birds",
    group: category_groups[:taxon_groups],
    perm_id: 12,
    desc: "Birds live in a wide range of environments, from tropical rainforests to the polar regions. All birds have feathers, something that makes them unique among living animals."
  },
  {
    name: "Fishes",
    group: category_groups[:taxon_groups],
    perm_id: 13,
    desc: "Fishes are limbless cold-blooded vertebrate animals with gills and fins and living wholly in water."
  },
  {
    name: "Fungi",
    group: category_groups[:taxon_groups],
    perm_id: 14,
    desc: "Fungi, such as mushrooms, yeasts and molds are plant-like organisms that do not make chlorophyll."
  },
  {
    name: "Insects",
    group: category_groups[:taxon_groups],
    perm_id: 15,
    desc: "Insects have segmented bodies that include a head, thorax, and abdomen. They have 3 pairs of legs, one pair of antennae and one or two pairs of wings.  With around one million named species and perhaps several times that number unnamed, insects account for a great majority of the species of animals on earth."
  },
  {
    name: "Invertebrates",
    group: category_groups[:taxon_groups],
    perm_id: 16,
    desc: "Invertebrates are animals without backbones such as bugs, worms, snails, corals or sponges."
  },
  {
    name: "Mammals",
    group: category_groups[:taxon_groups],
    perm_id: 17,
    desc: "All mammals share at least three characteristics not found in other animals: three middle ear bones, hair, and the production of milk by mammary glands."
  },
  {
    name: "Microorganisms",
    group: category_groups[:taxon_groups],
    perm_id: 18,
    desc: "Microorganisms, also known as microbes, are microscopic living organisms. The most common microorganisms are bacteria, viruses, and some fungi and protozoa."
  },
  {
    name: "Plants",
    group: category_groups[:taxon_groups],
    perm_id: 19,
    desc: "Plants species include trees, forbs, shrubs, grasses, vines, ferns, and mosses."
  },
  {
    name: "Reptiles",
    group: category_groups[:taxon_groups],
    perm_id: 20,
    desc: "Reptile species include turtles, lizards, snakes, crocodiles, alligators, and lizard-like tuataras."
  }
])

Podcast.seed
