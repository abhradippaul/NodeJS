# Basics

A simple Node.js HTTP server built with TypeScript.

## Features

- Basic HTTP server using the native `http` module.
- Development mode with live reload using `tsx`.
- TypeScript support.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Project

#### Development Mode
To start the server with live reload:
```bash
pnpm dev
```

#### Production Build
To build the project:
```bash
pnpm build
```

To start the server from the build:
```bash
pnpm start
```

## API Reference

- **GET /**: Returns a "Hello, World!" message.

## License

ISC
