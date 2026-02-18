# Low-Level Design Document
## AI Powered Meal Prep Application

### 1. System Architecture

#### 1.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Backend       │    │   External      │
│ (React Native)  │◄──►│  (Express.js)   │◄──►│   Services      │
│                 │    │                 │    │                 │
│ - React Native  │    │ - REST API      │    │ - TheMealDB     │
│ - Expo SDK      │    │ - Business      │    │ - AWS Bedrock   │
│ - Auth (Clerk)  │    │   Logic         │    │ - Walmart API   │
│ - Navigation    │    │ - AI Service    │    │ - Google Maps   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Database      │
                       │   (MongoDB)     │
                       │                 │
                       │ - Users         │
                       │ - Recipes       │
                       │ - Meal Plans    │
                       │ - Inventory     │
                       └─────────────────┘
```

#### 1.2 Technology Stack Details

**Frontend (Mobile App):**
- React Native 0.72+ with Expo SDK 49+
- TypeScript for type safety
- React Navigation 6 for navigation
- NativeBase or React Native Elements for UI components
- Expo SecureStore for secure token storage
- React Query for API state management

**Backend:**
- Express.js 4.18+ with Node.js 18+
- Mongoose ODM for MongoDB
- Joi or Zod for request validation
- JWT tokens via Clerk
- CORS middleware for cross-origin requests

**Database:**
- MongoDB Atlas (cloud-hosted)
- Indexes on user_id, recipe_id, created_at fields

**External Services:**
- Clerk for authentication
- AWS Bedrock (Claude-3) for AI meal planning
- TheMealDB API for recipe data
- Walmart API for pricing
- Google Maps API for route optimization
- Expo Application Services (EAS) for app builds

### 2. Database Design

#### 2.1 User Schema
```typescript
interface User {
  _id: ObjectId;
  clerkId: string; // Clerk user ID
  email: string;
  firstName: string;
  lastName: string;
  preferences: {
    dietaryRestrictions: string[]; // ['vegetarian', 'gluten-free']
    cuisinePreferences: string[]; // ['italian', 'mexican']
    cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
    budgetLimit: number; // weekly budget in dollars
    servingSize: number; // default serving size
  };
  schedule: {
    [day: string]: { // 'monday', 'tuesday', etc.
      availableSlots: {
        startTime: string; // '18:00'
        endTime: string; // '20:00'
        type: 'prep' | 'cook' | 'both';
      }[];
      noCookingDay: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.2 Recipe Schema
```typescript
interface Recipe {
  _id: ObjectId;
  externalId?: string; // TheMealDB ID if from external API
  name: string;
  description: string;
  imageUrl: string;
  cuisine: string;
  category: string; // 'breakfast', 'lunch', 'dinner', 'snack'
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: {
    name: string;
    amount: number;
    unit: string; // 'cups', 'tbsp', 'lbs'
    category: string; // 'produce', 'dairy', 'meat'
  }[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber: number; // grams
  };
  tags: string[]; // ['quick', 'healthy', 'budget-friendly']
  ratings: {
    userId: ObjectId;
    rating: number; // 1-5
    review?: string;
    createdAt: Date;
  }[];
  averageRating: number;
  isCustom: boolean; // true if user-created
  createdBy?: ObjectId; // user ID if custom recipe
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.3 Inventory Schema
```typescript
interface Inventory {
  _id: ObjectId;
  userId: ObjectId;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
    category: string;
    expirationDate?: Date;
    purchaseDate: Date;
    cost?: number;
  }[];
  updatedAt: Date;
}
```

#### 2.4 Meal Plan Schema
```typescript
interface MealPlan {
  _id: ObjectId;
  userId: ObjectId;
  weekStartDate: Date; // Monday of the week
  meals: {
    [day: string]: { // 'monday', 'tuesday', etc.
      breakfast?: {
        recipeId: ObjectId;
        servings: number;
        scheduledTime?: string;
        status: 'planned' | 'prepped' | 'cooked' | 'eaten' | 'skipped';
      };
      lunch?: {
        recipeId: ObjectId;
        servings: number;
        scheduledTime?: string;
        status: 'planned' | 'prepped' | 'cooked' | 'eaten' | 'skipped';
      };
      dinner?: {
        recipeId: ObjectId;
        servings: number;
        scheduledTime?: string;
        status: 'planned' | 'prepped' | 'cooked' | 'eaten' | 'skipped';
      };
    };
  };
  shoppingList: {
    ingredient: string;
    quantity: number;
    unit: string;
    category: string;
    estimatedCost?: number;
    purchased: boolean;
    store?: string;
  }[];
  totalEstimatedCost: number;
  aiRecommendationReason: string; // explanation from AI
  feedback?: {
    rating: number; // 1-5
    comments: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.5 Leftovers Schema
```typescript
interface Leftovers {
  _id: ObjectId;
  userId: ObjectId;
  recipeId: ObjectId;
  recipeName: string;
  portionsRemaining: number;
  expirationDate: Date;
  createdAt: Date;
  consumed: boolean;
}
```

### 3. API Design

#### 3.1 Authentication Endpoints
```typescript
// Handled by Clerk middleware
// All protected routes require valid JWT token
```

#### 3.2 User Management Endpoints
```typescript
// GET /api/users/profile
// Response: User profile data

// PUT /api/users/profile
// Body: Partial<User>
// Response: Updated user profile

// PUT /api/users/preferences
// Body: User preferences object
// Response: Updated preferences

// PUT /api/users/schedule
// Body: Schedule object
// Response: Updated schedule
```

#### 3.3 Recipe Endpoints
```typescript
// GET /api/recipes
// Query: ?search=string&cuisine=string&category=string&page=number
// Response: Paginated recipe list

// GET /api/recipes/:id
// Response: Full recipe details with ratings

// POST /api/recipes
// Body: Recipe object (for custom recipes)
// Response: Created recipe

// PUT /api/recipes/:id/rating
// Body: { rating: number, review?: string }
// Response: Updated recipe with new rating

// GET /api/recipes/suggestions
// Query: ?ingredients=string[] (comma-separated)
// Response: Recipes that use available ingredients
```

#### 3.4 Inventory Endpoints
```typescript
// GET /api/inventory
// Response: User's current inventory

// PUT /api/inventory
// Body: { ingredients: InventoryItem[] }
// Response: Updated inventory

// POST /api/inventory/ingredient
// Body: { name: string, quantity: number, unit: string, expirationDate?: Date }
// Response: Updated inventory

// DELETE /api/inventory/ingredient/:name
// Response: Updated inventory
```

#### 3.5 Meal Plan Endpoints
```typescript
// POST /api/meal-plans/generate
// Body: { weekStartDate: Date, preferences?: Partial<User['preferences']> }
// Response: Generated meal plan

// GET /api/meal-plans
// Query: ?weekStartDate=Date
// Response: Meal plan for specified week

// PUT /api/meal-plans/:id
// Body: Partial<MealPlan>
// Response: Updated meal plan

// PUT /api/meal-plans/:id/meal-status
// Body: { day: string, mealType: string, status: string }
// Response: Updated meal plan

// POST /api/meal-plans/:id/feedback
// Body: { rating: number, comments: string }
// Response: Updated meal plan with feedback
```

#### 3.6 AI Service Endpoints
```typescript
// POST /api/ai/meal-plan
// Body: { 
//   userPreferences: User['preferences'],
//   inventory: Inventory['ingredients'],
//   schedule: User['schedule'],
//   previousPlans?: MealPlan[]
// }
// Response: { mealPlan: MealPlan, reasoning: string }

// POST /api/ai/recipe-suggestions
// Body: { ingredients: string[], preferences: User['preferences'] }
// Response: { recipes: Recipe[], reasoning: string }
```

### 4. AI Service Design

#### 4.1 RAG Implementation
```typescript
interface RAGService {
  // Vector embeddings for recipes stored in MongoDB Vector Search
  embedRecipes(recipes: Recipe[]): Promise<void>;
  
  // Find similar recipes based on user preferences and ingredients
  findSimilarRecipes(
    userPreferences: User['preferences'],
    availableIngredients: string[],
    limit: number
  ): Promise<Recipe[]>;
  
  // Generate meal plan using Claude-3 via AWS Bedrock
  generateMealPlan(context: {
    user: User;
    inventory: Inventory;
    availableRecipes: Recipe[];
    previousFeedback?: MealPlan['feedback'][];
  }): Promise<{
    mealPlan: Omit<MealPlan, '_id' | 'userId' | 'createdAt' | 'updatedAt'>;
    reasoning: string;
  }>;
}
```

#### 4.2 AI Prompt Structure
```typescript
const MEAL_PLAN_PROMPT = `
You are a professional meal planning assistant. Generate a weekly meal plan based on:

USER PROFILE:
- Dietary restrictions: {dietaryRestrictions}
- Cuisine preferences: {cuisinePreferences}
- Cooking skill: {cookingSkillLevel}
- Budget limit: ${budgetLimit}/week
- Schedule constraints: {schedule}

AVAILABLE INGREDIENTS:
{inventoryList}

AVAILABLE RECIPES:
{recipeList}

REQUIREMENTS:
1. Prioritize recipes using available ingredients
2. Respect dietary restrictions and preferences
3. Consider cooking time vs available schedule slots
4. Aim for nutritional balance across the week
5. Stay within budget constraints
6. Provide variety in cuisines and cooking methods

Return a JSON object with meal assignments for each day and explain your reasoning.
`;
```

### 5. Component Architecture

#### 5.1 Mobile App Component Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── auth/                  # Authentication components
│   │   ├── LoginScreen.tsx
│   │   └── ProfileSetup.tsx
│   ├── recipes/               # Recipe-related components
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeList.tsx
│   │   ├── RecipeDetail.tsx
│   │   └── RecipeForm.tsx
│   ├── inventory/             # Inventory management
│   │   ├── InventoryList.tsx
│   │   ├── AddIngredient.tsx
│   │   └── ExpirationAlert.tsx
│   ├── meal-plan/             # Meal planning components
│   │   ├── WeeklyPlan.tsx
│   │   ├── DayView.tsx
│   │   ├── MealCard.tsx
│   │   └── ShoppingList.tsx
│   └── layout/                # Layout components
│       ├── Header.tsx
│       ├── TabNavigation.tsx
│       └── DrawerNavigation.tsx
├── screens/
│   ├── auth/                  # Auth screens
│   ├── recipes/               # Recipe screens
│   ├── inventory/             # Inventory screens
│   ├── meal-plans/            # Meal planning screens
│   └── profile/               # User profile screens
├── navigation/
│   ├── AppNavigator.tsx       # Main navigation setup
│   ├── AuthNavigator.tsx      # Auth flow navigation
│   └── TabNavigator.tsx       # Bottom tab navigation
├── services/
│   ├── api.ts                 # API client setup
│   ├── auth.ts                # Auth utilities
│   ├── storage.ts             # Secure storage utilities
│   └── external-apis.ts       # External API clients
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   ├── validation.ts          # Validation schemas
│   ├── formatting.ts          # Data formatting utilities
│   └── constants.ts           # App constants
└── hooks/
    ├── useAuth.ts             # Authentication hook
    ├── useApi.ts              # API hooks
    └── useStorage.ts          # Storage hooks
```

#### 5.2 Backend (Express.js) Structure
```
backend/
├── src/
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── recipeController.js
│   │   ├── inventoryController.js
│   │   ├── mealPlanController.js
│   │   └── aiController.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── recipes.js
│   │   ├── inventory.js
│   │   ├── mealPlans.js
│   │   └── ai.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   ├── Inventory.js
│   │   ├── MealPlan.js
│   │   └── Leftovers.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── services/              # Business logic services
│   │   ├── aiService.js
│   │   ├── recipeService.js
│   │   └── externalApiService.js
│   ├── config/                # Configuration files
│   │   ├── database.js
│   │   └── environment.js
│   └── utils/
│       ├── validation.js
│       └── helpers.js
├── app.js                     # Express app setup
├── server.js                  # Server entry point
└── package.json
```

### 6. Security Considerations

#### 6.1 Authentication & Authorization
- JWT tokens managed by Clerk
- API routes protected with middleware
- User data isolation by userId
- Rate limiting on AI endpoints

#### 6.2 Data Protection
- Input validation using Zod schemas
- SQL injection prevention (NoSQL injection for MongoDB)
- XSS protection via React's built-in escaping
- CSRF protection via SameSite cookies

#### 6.3 API Security
- API key rotation for external services
- Request/response logging for audit trails
- Error handling that doesn't expose sensitive data
- HTTPS enforcement in production

### 7. Performance Optimizations

#### 7.1 Database Optimization
- Compound indexes on frequently queried fields
- Aggregation pipelines for complex queries
- Connection pooling via Mongoose
- Data pagination for large result sets

#### 7.2 Mobile App Optimization
- React Native performance optimization with FlatList for large datasets
- Image optimization with Expo Image component
- Code splitting and lazy loading for screens
- React Query for caching API responses and offline support
- Bundle size optimization with Metro bundler

#### 7.3 AI Service Optimization
- Response caching for similar requests
- Batch processing for multiple meal plans
- Fallback to simpler algorithms if AI service fails
- Request queuing to manage API rate limits

### 8. Monitoring & Logging

#### 8.1 Application Monitoring
- Expo Analytics for app usage metrics
- Sentry for error tracking and crash reporting
- Backend API response time monitoring
- User engagement analytics through Expo
- App store performance metrics

#### 8.2 AI Service Monitoring
- Token usage tracking for cost management
- Response quality metrics
- Fallback activation monitoring
- User satisfaction scores for AI recommendations