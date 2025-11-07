# NutriVerse Backend API

Backend API proxy to protect OpenAI API key and provide endpoints for the NutriVerse mobile app.

## Features

- 🖼️ **Image Generation** - gpt-image-1 integration for recipe images
- 📝 **Recipe Parsing** - Parse recipes from text using GPT-4
- 🖼️ **Image Recipe Parsing** - Extract recipes from images using GPT-4 Vision
- 🔄 **Swap Generation** - Generate healthy ingredient swaps using AI
- 💡 **Swap Explanations** - Get detailed explanations for swaps

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```

### Generate Image
```
POST /api/generate-image
Body: { "prompt": "Beautiful food photography..." }
Response: { "success": true, "url": "https://..." }
```

### Parse Recipe from Text
```
POST /api/parse-recipe
Body: { "text": "Recipe text here..." }
Response: { "success": true, "recipe": {...} }
```

### Parse Recipe from Image
```
POST /api/parse-recipe-image
Body: { "imageUrl": "https://..." }
Response: { "success": true, "recipe": {...} }
```

### Generate Swaps
```
POST /api/generate-swaps
Body: { "recipe": {...}, "goal": "lose_weight", "preferences": {...} }
Response: { "success": true, "swaps": [...] }
```

### Explain Swap
```
POST /api/explain-swap
Body: { "swap": {...} }
Response: { "success": true, "explanation": "..." }
```

## Deployment on Render

1. Connect your GitHub repository
2. Set Root Directory to `backend`
3. Set Build Command to `npm install`
4. Set Start Command to `npm start`
5. Add Environment Variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key

## Environment Variables

- `OPENAI_API_KEY` - Required. Your OpenAI API key
- `PORT` - Optional. Server port (default: 3000, Render sets this automatically)

## License

Private project - All rights reserved
