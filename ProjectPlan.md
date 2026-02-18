# AI Powered Meal Prep - @Logan Barker @Zach Mattes

## Motivation

College students (and people at large) are frequently too busy to properly plan out their meals on any given day, let alone for the week or month. When it gets to be dinner time and there’s finally a break from schoolwork, the random collection of ingredients in the house are thrown together in a beautiful mess. But what if it didn’t have to be that way? What if you could tell an Agent on your phone about the bottle of ketchup in the fridge and the 2 ramen packets you have to your name and have it recommend something delicious? What if you could provide feedback on recommended recipes, input preferred cuisines, and get a tailored meal plan day-to-day, week-to-week, or month-to-month? That sounds like something good enough to eat.

## Key Features

- [ ]  Build a mobile app that creates meal plans curated to the users preferences and schedule
- [ ]  Allow users to create/add/upload their own recipes
- [ ]  Allow users to upload their own schedule/give times they are available to cook
- [ ]  Create a model that builds a weekly meal plan that meets a users needs and schedule and provides the ingredients as a shopping list
- [ ]  Additional tasks:
    - [ ]  Keep track of the ingredients a user has and favor those in the weekly schedule
    - [ ]  Provide insight into how the meal plan was formed
    - [ ]  Incorporate ratings for meals and meal plans
- [ ]  Track meal cost
- [ ]  Plan grocery routes
- [ ]  evaluate how fast groceries are consumed
- [ ]  track leftovers and include them in scheduling
- [ ]  sent out reminders to start meal prep at the right times in their schedule

## Planned Technologies

- React Native with Expo → Cross-platform mobile app development for iOS and Android
- Express.js → Node.js backend framework for API development and routing
- TheMealDB → Tentative recipe api because of free option and ease of use
- MongoDB → Ingredient, recipe, meal plan, shopping list, etc storage
- Clerk → Authentication and access control
- Bedrock → Tentative, host model for meal plan recommendation (would incur a cost, open to cheaper/no cost options if available)
- Google Maps API → If planning grocery routes
- MealMe/Walmart API → Tentative option for sourcing ingredient pricing/stores to map to

## Background

Zach and Logan already have existing projects which overlap significantly with the listed features. The hope is to focus on combining the existing codebases (yay working with existing code) and implementing the AI aspect of things. We will likely be using some kind of rag model with the recipes from TheMealDB as a knowledge base to help create the meal plans and cross reference the ingredients a user has with what they need for the recipes.

## Projected Timeline

Hoping to start in **Winter Quarter** with the goal of finishing most features listed above in **1 quarter**. I can easily see it turning into a 2 quarter long project due either to implement the rest of the features or to add additional platform support like a web version.

## Milestones

1. Combine desired aspects of Zach and Logan’s project and get them running
2. Integrate MongoDB, Clerk, and other foundational services/API’s
3. Implement the services to make requests for ingredients, recipes by type or ingredients, etc
4. Implement the services to look up ingredient pricing for the shopping cart
5. Create a response model that we want the model to use that can be parsed into a meal plan as well as rendering logic
6. Create the RAG knowledge base and choose a foundational model
7. Integrate the model with the existing project
8. Win