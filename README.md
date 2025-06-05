# Queue-Up: Modern Waitlist Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Queue-Up is a powerful, customizable waitlist management system built with Next.js 15, TypeScript, and modern UI libraries. Create viral waitlists for your product launches without writing a single line of code.

![Queue-Up Screenshot](https://placeholder-for-screenshot.com)

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Customizable waitlists** with visual editor for colors, fonts, and layout
- **Referral system** to boost growth with built-in viral loops
- **Embeddable widgets** for seamless integration into any website
- **Analytics dashboard** to track signups and referral effectiveness
- **Export functionality** for easy data management
- **Responsive design** that looks great on any device
- **Integration capabilities** with popular tools and services

## Demo

Check out the live demo: [https://queue-up-demo.vercel.app](https://queue-up-demo.vercel.app)

## Installation

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/queue-up.git
cd queue-up
```

2. Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

3. Set up your database and apply migrations:

```bash
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/queue_up"

# Authentication
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Email service for notifications
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""
```

## Usage

### Creating Your First Waitlist

1. Sign up or log in to your account
2. Click on "Create Waitlist" in the dashboard
3. Fill in the details for your waitlist:
   - Name
   - Description
   - Custom slug
   - Appearance settings
4. Customize the form layout and color scheme
5. Launch your waitlist!

### Embedding on Your Website

Add this snippet to your website:

```html
<div id="waitlist-container" data-waitlist-slug="your-waitlist-slug"></div>
<script async src="https://queue-up.app/api/widget/script"></script>
```

### Managing Signups

1. Navigate to your waitlist in the dashboard
2. View signups under the "Signups" tab
3. Export data as CSV or connect with your favorite tools using integrations

### Customizing Your Waitlist

1. Go to "Customization" in your waitlist dashboard
2. Adjust colors, fonts, button text, and more
3. Preview changes in real-time
4. Save and publish your changes

## API Reference

Queue-Up provides a REST API for programmatic access. Detailed documentation can be found at [https://docs.queue-up.app/api](https://docs.queue-up.app/api).

Example endpoint:

```
GET /api/waitlist/{waitlistSlug}/stats
```

## Contributing

We welcome contributions to Queue-Up! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add some amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

Please ensure your code follows our style guidelines and passes all tests.

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Write tests for new features
- Update documentation when necessary

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), and [Shadcn UI](https://ui.shadcn.com/)
