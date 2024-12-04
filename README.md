# React Leave Request Application with Outlook Integration

This project is a **React** application built using **TailwindCSS** for styling, **ShadCN** for UI components, and **Microsoft 365** authentication. It is a **Minimum Viable Product (MVP)** to demonstrate the integration of Outlook APIs, allowing employees to apply for leave and reflect leave requests on everyone’s calendars without sending emails.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building the Application](#building-the-application)
- [Components and Styling](#components-and-styling)
- [Microsoft 365 Authentication](#microsoft-365-authentication)
- [Leave Request Features](#leave-request-features)
- [Project Structure](#project-structure)
- [License](#license)

## Prerequisites

Before running the application, ensure that you have the following installed:

- **Node.js**: Version 16 or higher. You can download it from the [official Node.js website](https://nodejs.org/).
- **npm**: Comes with Node.js, but if you need to install it separately, use the following command:
  ```bash
  npm install -g npm
  ```

## Installation

1. **Clone the repository**:
   Clone the project repository to your local machine:
   ```bash
   git clone https://github.com/glendisraptor/leave-management-app.git
   ```

2. **Navigate to the project directory**:
   Change into the project folder:
   ```bash
   cd leave-management-app
   ```

3. **Install dependencies**:
   Install the necessary dependencies using npm (or yarn, if preferred):
   ```bash
   npm install
   ```

   This will install the dependencies listed in `package.json`.

## Running the Application

Once the dependencies are installed, you can run the development server:

1. **Start the development server**:
   Run the following command:
   ```bash
   npm run dev
   ```

   This will start Vite in development mode. By default, the application will be accessible at [http://localhost:5173](http://localhost:5173).

2. **Access the application**:
   Open your browser and visit [http://localhost:5173](http://localhost:5173) to see the application in action.

## Building the Application

To build the application for production:

1. **Build the application**:
   Run the following command:
   ```bash
   npm run build
   ```

   This will create a production-ready build in the `dist` directory.

2. **Preview the production build**:
   After building, you can preview the production build by running:
   ```bash
   npm run preview
   ```

   This will start a local server to preview the production version of the app.

## Components and Styling

This application uses the following tools for components and styling:

- **ShadCN**: We use ShadCN components to quickly build modern, reusable, and customizable UI elements in the app.
- **TailwindCSS**: All styles are applied using **TailwindCSS**, a utility-first CSS framework that makes styling easy and efficient by applying classes directly in your markup.

## Microsoft 365 Authentication

This application integrates with **Microsoft 365** for **Google authentication** (Microsoft accounts) to ensure that users can sign in with their Microsoft credentials. Once authenticated, employees can interact with the application and utilize the features related to leave requests and calendar integration.

## Leave Request Features

The primary goal of this MVP application is to demonstrate the integration with Outlook and the management of leave requests. The application supports the following functionalities:

- **Employee Role**:
  - Employees can **apply for leave** and view their **leave statistics** (how many days taken this year).
  - Employees can also view their **profile section** and update their information.

- **Manager Role**:
  - Managers can **approve or reject leave requests**.
  - Managers can see **who is assigned to which project/task** and track leave requests for their team.

- **Project Management**:
  - Employees can be **assigned to projects/tasks**. (Potential integration with **Loop Workspaces** to manage projects).

- **Outlook Calendar Integration**:
  - When an employee applies for leave, the application interacts with the **Outlook calendar API** and reflects the leave as an event in everyone’s calendar.
  - This MVP does **not send emails** to the users but rather updates the calendar events accordingly.

- **Role-Based Permissions**:
  - The application will distinguish between **employee** and **manager** roles. Managers have extra permissions, such as approving or rejecting leave requests.

## Project Structure

Here is an overview of the project structure:

```
├── README.md               # This file
├── components.json          # Component configuration or settings
├── eslint.config.js         # ESLint configuration for linting
├── index.html               # HTML entry point for the application
├── package-lock.json        # Lockfile for npm dependencies
├── package.json             # Project metadata and dependencies
├── postcss.config.js        # Configuration for PostCSS
├── public/                  # Static files (vite.svg, etc.)
│   └── vite.svg
├── src/                     # Source code for the application
│   ├── App.css              # Styles for App component
│   ├── App.tsx              # Main component for the app
│   ├── assets/              # Static assets like images and fonts
│   ├── components/          # Reusable UI components (using ShadCN)
│   ├── config/              # Configuration files
│   ├── hooks/               # Custom React hooks
│   ├── index.css            # Global styles
│   ├── lib/                 # Utility libraries
│   ├── main.tsx             # Entry point for the application
│   ├── pages/               # Different pages of the app
│   ├── services/            # API or external service integrations
│   ├── store/               # Zustand store files
│   └── vite-env.d.ts        # Vite environment types
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.app.json        # TypeScript configuration for the app
├── tsconfig.json            # Base TypeScript configuration
├── tsconfig.node.json       # TypeScript configuration for Node.js
└── vite.config.ts           # Vite configuration file
```

## License

This project is licensed under the [MIT License](LICENSE).

---

### Project Brief for the Leave Request Application

**Project Overview**:

This project is a **React** application that demonstrates the **MVP (Minimum Viable Product)** integration of Outlook APIs for leave request management. The application is styled using **TailwindCSS** and leverages **ShadCN** for the UI components. The application allows employees to apply for leave, track leave statistics, and have their leave requests reflected on everyone’s calendar without sending emails.

**Core Features**:
- **React Application**: Built with modern React, TypeScript, and Zustand for state management.
- **ShadCN Components**: Utilizes ShadCN UI components for a fast and customizable UI.
- **TailwindCSS Styling**: All UI elements are styled using TailwindCSS.
- **Microsoft 365 Authentication**: Employees can log in using their Microsoft credentials.
- **Role-Based Permissions**:
  - **Employees**: Apply for leave, view their leave stats, and update their profile.
  - **Managers**: Approve/reject leave requests, assign employees to projects/tasks, and track leave.
- **Leave Request System**: Allows employees to request leave and see the number of leave days taken in the current year.
- **Outlook Calendar Integration**: Reflect leave requests on users’ calendars without sending emails.
- **Project/Task Management**: Employees can be assigned to projects or tasks, and their availability is tracked based on leave requests.

**Goal**:
This MVP application aims to demonstrate whether it’s feasible to integrate Outlook’s calendar API into a React application to manage leave requests. It does not yet include email notifications but focuses on calendar integration and role-based permissions for leave management.

**Next Steps**:
- Integrate with **Loop Workspaces** for project management (potentially).
- Enhance email notifications (if required in the future).
- Scale the application for larger teams and organizations. 