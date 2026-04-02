# AdTech UI & BFF Template

This repository serves as a template for building AdTech UI and Backend for Frontend (BFF) applications. It provides a structured setup to help you quickly start developing your own projects.

Please update the README with your project-specific information after cloning this template.

## Prerequisites

- [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
- A node package manager (pick one)
  - [pnpm](https://pnpm.io/) for fast, disk-efficient package management (✨ recommended ✨)
  - [npm](https://docs.npmjs.com/cli/v11/commands/npm) comes bundled with NodeJS and is the default package manager
  - [yarn classic](https://classic.yarnpkg.com/en/) or [yarn](https://yarnpkg.com/) are alternative package managers created by Facebook. For a more _npm-like_ experience, use `yarn classic`.

Follow the installation steps for your chosen package manager.

### Specific Package Manager Setup

This template is optimized for `pnpm`, but you can use `npm` or `yarn` if you prefer; however you will need to update the following files accordingly:

- Add workspaces to `package.json`:
  ```json
  "workspaces": [
    "app",
    "server",
    "shared/*"
  ]
  ```
- Update the `Dockerfile` to use your package manager and to copy the appropriate `lock` file.

## Using the Template

This template is structured as a monorepo using [pnpm](https://pnpm.io/) to manage multiple packages. It includes:

```
.
├── app/                # Frontend application code
├── server/             # Backend server code
├── shared/             # Shared code (utilities, types, etc.). Each subdirectory is a separate package that can be imported by the app, server or eachother.
├── package.json        # Root package.json for the monorepo
├── pnpm-workspaces.yaml # pnpm workspaces configuration (if using pnpm)
├── .github/            # GitHub workflows and templates
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

To use this template, either click the "Use this template" button on GitHub to create a new repository based on this template, or select it as a template during the repo creation process.

## Created your Template Project?

1. Clone your new repository:
   ```sh
   git clone <your repository-url>
   cd <your repository-name>
   ```
2. Update the CODEOWNERS file to include your GitHub username or team name, so that you can receive notifications for pull requests and issues.
3. Run the initialization script to set up the project (ensure there are no spaces in the project name):
   ```sh
   npm run init 'your-project-name' # or yarn init, or pnpm run init
   ```
   This script will:
   - Rename the project from `<project-name>` to your project's name.
   - Update all occurrences of `<project-name>` in the codebase to your project's name.
   - Ensure that all files are properly formatted and ready for development.
4. Install dependencies for all packages:
   ```sh
   pnpm install # if using pnpm
   # OR
   npm install # if using npm
   # OR
   yarn install # if yarn or yarn classic
   ```
5. Commit your changes:
   ```sh
   git add .
   git commit -m "Initial project setup"
   git push origin main
   ```
6. Start coding. UI code should go into the `app` package, server code into the `server` package, and shared code into the `shared` directory. But feel free to create additional packages as needed.
