# Poker Hands

A project for Texas Hold'em poker hand evaluation, odds calculation, and more. This project provides three packages: a core library, an HTTP/WebSocket service, and a command-line interface.

What started as a code-workout has become an exercise in vibe coding – substantial parts of this code has been AI-generated.

## 📦 Monorepo Structure

This project is organized as a monorepo with three main packages:

```
poker-hands/
├── packages/
│   ├── library/          # Core poker logic library
│   ├── service/          # HTTP/WebSocket service
│   └── cli/             # Command-line interface
├── package.json         # Workspace configuration
└── README.md            # This file
```

### Package Overview

| Package                                                           | Description                                   | Installation                                  |
| ----------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| **[@malte.muth/poker-hands](packages/library/README.md)**         | Core poker hand evaluation library            | `npm install @malte.muth/poker-hands`         |
| **[@malte.muth/poker-hands-service](packages/service/README.md)** | HTTP service for poker calculations           | `npm install @malte.muth/poker-hands-service` |
| **[@malte.muth/poker-hands-cli](packages/cli/README.md)**         | Command-line interface for poker calculations | `npm install -g @malte.muth/poker-hands-cli`  |

## 🚀 Quick Start

### Prerequisites

- Node.js >= 24.21.0 (see [`.nvmrc`](.nvmrc))
- npm >= 10.8.2

### Workspace Installation

```bash
# Clone the repository
git clone https://github.com/malte-muth/poker-hands.git
cd poker-hands

# Install all dependencies
npm install

# Build all packages
npm run build

# Run all tests
npm test
```

## 📋 Package Features

### Library Package (`@malte.muth/poker-hands`)

- **Hand Evaluation**: Determine the best possible poker hand from any set of cards
- **Hand Comparison**: Compare two poker hands to determine which is better
- **Odds Calculation**: Calculate winning probabilities for given hole cards and board
- **Hand Percentages**: Calculate the probability of making each hand type
- **Card Manipulation**: Create, shuffle, and manipulate poker decks and cards
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

### Service Package (`@malte.muth/poker-hands-service`)

- **HTTP API**: HTTP endpoints for odds calculations

### CLI Package (`@malte.muth/poker-hands-cli`)

- **Command-line Interface**: CLI for poker calculations

## 📖 Documentation

- [Library Documentation](packages/library/README.md) - API reference and usage examples
- [Service Documentation](packages/service/README.md) - API endpoints and WebSocket usage
- [CLI Documentation](packages/cli/README.md) - Command-line interface usage
- [Changelog](CHANGELOG.md) - Changes per version

## 🔧 Development

### Working with Individual Packages

```bash
# Build a specific package
npm run build:library
npm run build:service
npm run build:cli

# Test a specific package
npm run test:library
npm run test:service
npm run test:cli

# Lint a specific package
npm run lint:library
npm run lint:service
npm run lint:cli
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 See Also

- [ProPokerTools](http://www.propokertools.com/) - Online poker calculator
- [poker-odds](https://github.com/CookPete/poker-odds) - CLI poker odds calculator

## 🙏 Acknowledgments

This project was inspired by and tested against ProPokerTools and poker-odds. For production poker equity calculations, both tools are strictly better than this one.
