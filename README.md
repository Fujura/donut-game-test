# Doughnuts Game

A vanilla TypeScript game where players collect donuts into boxes and answer a quiz question.

## Features

- **Donut Collection Phase**: Click donuts to pack them into boxes (2 per box)
- **Smooth Animations**: Donuts fly to boxes with CSS transitions
- **Box Management**: Boxes close and shift left when full, new boxes appear
- **Quiz Phase**: Answer how many donuts were collected
- **Input Validation**: Button states change based on input (disabled when empty, active when number entered)

## Setup

```bash
npm install
```

## Development

```bash
# Build once
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch
```

## Running

Serve the project via a local HTTP server (ES modules require HTTP, not `file://`):

```bash
# Using Python
python -m http.server 3000

# Using Node.js http-server
npx http-server -p 3000
```

Then open `http://localhost:3000` in your browser.

## Project Structure

```
/src
  - main.ts      # Entry point, game initialization
  - state.ts     # State machine (DONUTS → QUIZ phases)
  - donuts.ts    # Donut collection phase logic
  - quiz.ts      # Quiz phase logic
  - anim.ts      # Animation helpers
  - dom.ts       # DOM utilities
  - styles/      # CSS styles
/dist            # Compiled JavaScript (generated)
```

## Technologies

- TypeScript (compiled to ES2020)
- Vanilla JavaScript (no frameworks)
- CSS Transitions for animations
- ES Modules

## Requirements

- Node.js (for TypeScript compilation)
- Modern browser with ES module support

