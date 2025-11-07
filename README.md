# NutriVerse

A modern nutrition and fitness superapp built with React Native and Expo. Transform recipes, track macros, plan meals, and achieve your health goals with AI-powered food swaps.

## Features

- 🎯 **FitSwap Engine** - Transform any recipe into healthy variants (Lean, High-Protein, Budget) with AI-powered ingredient swaps
- 📊 **Macro Tracking** - Daily calorie and macro goals with beautiful visualizations
- 🍽️ **Meal Planning** - Weekly meal planning with automatic shopping list generation
- 🏃 **Cooking Mode** - Step-by-step cooking guide with timers and ingredient checklists
- 📸 **AI-Powered** - Recipe parsing from text, images, and links using OpenAI
- 🎨 **Beautiful UI** - Modern dark theme with lime green accents
- 📱 **Personalized** - Customizable goals, restrictions, and preferences
- 💡 **Smart Tips** - Contextual nutrition tips and weekly challenges

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Expo CLI
- iOS Simulator or physical iOS device
- OpenAI API Key (optional, for AI features)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Backend API (for OpenAI features):

   **Option A: Use Render Backend (Recommended)**
   
   Deploy the backend to Render:
   - Connect GitHub repository
   - Set Root Directory to `backend`
   - Set Build Command to `npm install`
   - Set Start Command to `npm start`
   - Add Environment Variable: `OPENAI_API_KEY` = your OpenAI API key
   - Get your Render URL (e.g., `https://nutriversee.onrender.com`)
   
   **✅ Backend já está configurado!**
   - URL do backend: `https://nutriversee.onrender.com`
   - O app já está configurado para usar essa URL por padrão
   - Para usar uma URL diferente, crie um arquivo `.env` na raiz:
     ```bash
     EXPO_PUBLIC_API_URL=https://sua-url.onrender.com
     ```
   
   **Option B: Local Development**
   
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   npm start
   ```
   
   The backend will run on `http://localhost:3000`

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation between screens
- **AsyncStorage** - Local data persistence
- **OpenAI API** - Recipe parsing and transformation (optional)
- **Expo Linear Gradient** - Gradient effects
- **React Native SVG** - Custom graphics
- **Expo Vector Icons** - Icon library

## Project Structure

```
.
├── backend/          # Backend API (Node.js/Express)
│   ├── server.js     # API server
│   ├── package.json  # Backend dependencies
│   └── .env.example  # Environment variables template
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── ui/       # Button, etc.
│   │   └── ...       # MacroRing, CategoryChip, etc.
│   ├── screens/      # App screens
│   │   ├── onboarding/  # Onboarding flow
│   │   ├── home/        # Home screen
│   │   ├── explore/     # Explore screen
│   │   ├── profile/     # Profile & goals
│   │   ├── fitswap/     # FitSwap engine
│   │   ├── cooking/     # Cooking mode
│   │   └── planning/    # Weekly planning
│   ├── services/     # Business logic
│   │   ├── fitswap/  # FitSwap engine
│   │   ├── openai/   # OpenAI integration (uses backend)
│   │   ├── api/      # API client
│   │   └── storage/  # Local storage
│   ├── navigation/   # Navigation setup
│   ├── theme/        # Design tokens
│   └── types/        # TypeScript types
└── README.md
```

## Design System

- **Colors**: Dark theme with lime green (`#9BE000`) accents
- **Typography**: Poppins (titles) and Inter (body)
- **Layout**: Card-based design with floating navigation
- **Spacing**: Consistent spacing tokens (xs, sm, md, base, lg, xl, etc.)

## Core Features

### FitSwap Engine
Transform any recipe into healthier variants:
- **Original** - Base recipe
- **Lean** - Lower calories, optimized for weight loss
- **High-Protein** - Increased protein content
- **Budget** - Cost-optimized ingredients

### Meal Planning
- Weekly meal planning with automatic macro calculation
- Shopping list generation
- Portion adjustment
- Meal distribution suggestions

### Profile & Goals
- TDEE calculator (BMR + activity level)
- Customizable macro targets
- Dietary restrictions and preferences
- Health app integrations (Apple Health, Google Fit)

## API Integration

The app is designed with API integration points ready for backend connection:
- Recipe API endpoints
- User API endpoints
- FitSwap transformation API
- OpenAI service hooks

Currently using mock data with clear integration points.

## Development

### Running the app

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Environment Variables

Create `src/config/apiKeys.ts` (see `apiKeys.example.ts`):
- `OPENAI_API_KEY` - OpenAI API key for AI features

## License

Private project - All rights reserved

## Contributing

This is a private project. Contributions are not currently accepted.
