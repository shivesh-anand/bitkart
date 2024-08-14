# Bitkart Client

Welcome to the Bitkart Client repository! This README provides detailed information about the client-side of the Bitkart platform, which enables BIT Mesra students to buy and sell used items seamlessly. The client is hosted on Vercel, with Vercel Analytics enabled to monitor performance and user interactions, ensuring an optimized user experience based on real-time data.

## Technologies and Tools Used

### Core Framework

- **Next.js:** This powerful React framework is the backbone of the Bitkart client, offering server-side rendering and static site generation to enhance performance and search engine optimization (SEO).

### UI/UX

- **Tailwind CSS:** A utility-first CSS framework that enables rapid and efficient styling of the user interface, ensuring a clean and responsive design.
- **NextUI:** A Tailwind-based UI library featuring customizable prebuilt components, allowing for a consistent and professional look across the application.
- **React SVG Icons and Lucide React:** These libraries provide scalable vector icons that are easily integrated into the application, enhancing the visual appeal.

### State Management

- **Redux Toolkit and RTK Query:** These tools are used for managing global application state and handling API requests efficiently. They ensure a smooth and predictable user experience across the client.

### Cookie Management

- **JS Cookie:** A lightweight library for managing cookies on the client side, including handling JWT tokens for secure user authentication.

### Date and Time Management

- **Moment and Moment Timezone:** Libraries used to format the creation and update times of items, making them easily understandable and user-friendly.

### Notifications

- **React Hot Toast:** A library for providing real-time toast notifications across the application, offering immediate feedback to users on various actions.

## Installation and Setup

To run the Bitkart Client locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bitkart-client.git
   cd bitkart-client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your environment variables, such as API endpoints and keys.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The client will be available at `http://localhost:3000`.
