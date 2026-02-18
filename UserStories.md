# User Stories Document
## AI Powered Meal Prep Application

### Epic 1: User Authentication & Profile Management

#### US-001: User Registration
**As a** college student  
**I want to** create an account with my email or social login  
**So that** I can access personalized meal planning features  

**Acceptance Criteria:**
- User can register using email/password or social login (Google, Facebook)
- User receives email verification
- User profile is created with default preferences
- User is redirected to onboarding flow

**Story Points:** 3  
**Priority:** High

#### US-002: Profile Setup
**As a** new user  
**I want to** set up my dietary preferences and cooking constraints  
**So that** the AI can generate relevant meal recommendations  

**Acceptance Criteria:**
- User can select dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- User can set cooking skill level (beginner, intermediate, advanced)
- User can specify cuisine preferences
- User can set budget constraints
- Profile can be updated later

**Story Points:** 5  
**Priority:** High

### Epic 2: Recipe Management

#### US-003: Browse Recipes
**As a** user  
**I want to** browse and search available recipes  
**So that** I can discover new meals to try  

**Acceptance Criteria:**
- User can view recipe list with images and basic info
- User can search recipes by name or ingredient
- User can filter by cuisine, dietary restrictions, cook time
- Recipe details show ingredients, instructions, and nutrition info
- User can view recipe ratings and reviews

**Story Points:** 8  
**Priority:** High

#### US-004: Rate Recipes
**As a** user  
**I want to** rate recipes I've tried  
**So that** the AI can learn my preferences and improve recommendations  

**Acceptance Criteria:**
- User can rate recipes 1-5 stars
- User can leave optional text review
- Ratings are saved to user profile
- AI system uses ratings for future recommendations
- User can update ratings later

**Story Points:** 3  
**Priority:** Medium

#### US-005: Create Custom Recipes
**As a** user  
**I want to** add my own recipes  
**So that** they can be included in my meal plans  

**Acceptance Criteria:**
- User can input recipe name, ingredients, and instructions
- User can add prep time, cook time, and servings
- User can upload recipe photos
- Custom recipes appear in user's recipe collection
- Custom recipes can be included in AI meal plans

**Story Points:** 8  
**Priority:** Medium

### Epic 3: Ingredient & Inventory Management

#### US-006: Manage Ingredient Inventory
**As a** user  
**I want to** track what ingredients I have at home  
**So that** meal plans can prioritize using existing ingredients  

**Acceptance Criteria:**
- User can add ingredients with quantities and expiration dates
- User can mark ingredients as used/consumed
- System shows ingredients nearing expiration
- User can scan barcodes to add ingredients (future enhancement)
- Inventory is considered in meal plan generation

**Story Points:** 13  
**Priority:** High

#### US-007: Ingredient Suggestions
**As a** user  
**I want to** get recipe suggestions based on my current ingredients  
**So that** I can use what I have before it expires  

**Acceptance Criteria:**
- System suggests recipes using available ingredients
- Recipes are ranked by percentage of ingredients available
- User can see what additional ingredients are needed
- System prioritizes recipes with expiring ingredients
- User can request alternatives if suggestions aren't appealing

**Story Points:** 8  
**Priority:** High

### Epic 4: Schedule Integration

#### US-008: Input Cooking Schedule
**As a** busy student  
**I want to** input my weekly schedule and available cooking times  
**So that** meal plans fit my availability  

**Acceptance Criteria:**
- User can input daily schedule with busy/free time blocks
- User can specify preferred meal prep times
- User can set different schedules for different weeks
- System considers schedule when generating meal plans
- User can mark certain days as "no cooking" days

**Story Points:** 8  
**Priority:** High

#### US-009: Meal Prep Reminders
**As a** user  
**I want to** receive reminders when it's time to start cooking  
**So that** I don't miss meal prep windows in my schedule  

**Acceptance Criteria:**
- System sends push notifications for meal prep times
- User can customize reminder timing (15min, 30min, 1hr before)
- User can snooze or dismiss reminders
- Reminders include recipe name and estimated prep time
- User can disable reminders for specific meals

**Story Points:** 5  
**Priority:** Medium

### Epic 5: AI Meal Planning

#### US-010: Generate Weekly Meal Plan
**As a** user  
**I want to** get an AI-generated weekly meal plan  
**So that** I don't have to spend time planning meals myself  

**Acceptance Criteria:**
- AI generates 7-day meal plan with breakfast, lunch, dinner
- Plan considers user preferences, dietary restrictions, and schedule
- Plan prioritizes available ingredients
- Plan includes variety and balanced nutrition
- User can regenerate plan if unsatisfied

**Story Points:** 21  
**Priority:** High

#### US-011: Understand Meal Plan Reasoning
**As a** user  
**I want to** understand why specific meals were recommended  
**So that** I can trust and learn from the AI suggestions  

**Acceptance Criteria:**
- System provides explanation for each meal recommendation
- Explanations mention factors like available ingredients, preferences, schedule
- User can see nutritional reasoning (protein, vitamins, etc.)
- User can see how recommendations align with their goals
- Explanations are clear and non-technical

**Story Points:** 8  
**Priority:** Medium

#### US-012: Modify Meal Plans
**As a** user  
**I want to** make changes to my generated meal plan  
**So that** I can customize it to my exact needs  

**Acceptance Criteria:**
- User can swap individual meals for alternatives
- User can request vegetarian/vegan alternatives
- User can adjust portion sizes
- User can move meals to different days
- Changes update shopping list automatically

**Story Points:** 13  
**Priority:** High

### Epic 6: Shopping & Cost Management

#### US-013: Generate Shopping Lists
**As a** user  
**I want to** get a shopping list for my meal plan  
**So that** I know exactly what to buy at the store  

**Acceptance Criteria:**
- Shopping list includes all ingredients not in inventory
- List is organized by store section (produce, dairy, etc.)
- List shows quantities needed for all planned meals
- User can check off items as purchased
- List updates inventory when items are marked as purchased

**Story Points:** 8  
**Priority:** High

#### US-014: Track Meal Costs
**As a** budget-conscious student  
**I want to** see estimated costs for my meal plans  
**So that** I can stay within my food budget  

**Acceptance Criteria:**
- System shows estimated cost per meal and total weekly cost
- Costs are based on local grocery store pricing
- User can set budget limits and get warnings
- System suggests budget-friendly alternatives when over budget
- Cost tracking includes historical spending analysis

**Story Points:** 13  
**Priority:** Medium

#### US-015: Optimize Grocery Routes
**As a** user  
**I want to** get optimized routes to grocery stores  
**So that** I can shop efficiently and save time  

**Acceptance Criteria:**
- System suggests best stores for needed ingredients
- Route optimization considers store locations and traffic
- User can see estimated travel time and costs
- System considers store hours and availability
- User can manually select preferred stores

**Story Points:** 13  
**Priority:** Low

### Epic 7: Advanced Features

#### US-016: Manage Leftovers
**As a** user  
**I want to** track leftovers and have them included in future meal plans  
**So that** I don't waste food  

**Acceptance Criteria:**
- User can log leftover portions after meals
- System suggests ways to use leftovers in new recipes
- Leftovers are automatically considered in next meal plan
- User can set leftover expiration dates
- System prioritizes using leftovers before they expire

**Story Points:** 8  
**Priority:** Medium

#### US-017: Consumption Pattern Analysis
**As a** user  
**I want to** see insights about my eating patterns  
**So that** I can make better food choices  

**Acceptance Criteria:**
- System tracks which meals are actually prepared and eaten
- User sees analytics on favorite cuisines and ingredients
- System identifies patterns in cooking frequency
- User gets suggestions for improving meal plan adherence
- Analytics help optimize future meal plan generation

**Story Points:** 13  
**Priority:** Low

#### US-018: Nutritional Insights
**As a** health-conscious user  
**I want to** see nutritional information for my meal plans  
**So that** I can ensure I'm eating a balanced diet  

**Acceptance Criteria:**
- System shows calories, macros, and key vitamins for each meal
- Weekly nutritional summary shows balance across food groups
- User can set nutritional goals (protein intake, calorie limits)
- System warns if meal plan is nutritionally unbalanced
- Nutritional data is accurate and sourced from reliable databases

**Story Points:** 13  
**Priority:** Medium

### Story Point Summary by Epic:
- **Epic 1 (Authentication):** 8 points
- **Epic 2 (Recipe Management):** 19 points  
- **Epic 3 (Inventory):** 21 points
- **Epic 4 (Schedule):** 13 points
- **Epic 5 (AI Planning):** 42 points
- **Epic 6 (Shopping):** 34 points
- **Epic 7 (Advanced):** 34 points

**Total Story Points:** 171 points

### Priority Distribution:
- **High Priority:** 10 stories (89 points)
- **Medium Priority:** 6 stories (56 points)
- **Low Priority:** 2 stories (26 points)