# Bitkart Server

Welcome to the Bitkart Server repository! This server application powers the Bitkart platform, facilitating the buying and selling of used items for BIT Mesra students. Hosted on DigitalOcean, the server adheres to best coding practices to ensure security, scalability, and robust error handling.

## Technologies and Tools Used

### Core Framework

- **Node.js:** JavaScript runtime environment for building efficient and scalable server-side applications.
- **Express.js:** Web application framework used to develop RESTful APIs and manage server routes with ease.

### Database

- **MongoDB:** A flexible NoSQL database that supports scalable data storage.
- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB that provides schema-based solutions to model application data.

### Authentication

- **JWT (JSON Web Tokens):** Secure method for user authentication and session management.
- **Bcrypt:** Password hashing library ensuring secure storage of user credentials.
- **Passport.js:** Middleware for implementing Google OAuth 2.0 authentication, enhancing user login and registration.

### File Handling

- **AWS S3 and CloudFront:** Solutions for secure image storage and efficient content delivery. S3 handles secure storage while CloudFront optimizes image delivery and caching. Images are served via pre-signed URLs to provide secure and temporary access to private files.
- **Multer:** Middleware for managing file uploads, configured to temporarily store files on disk before transferring them to S3.

### Utilities

- **Nodemailer:** For sending OTPs and other automated emails to users.
- **Morgan:** HTTP request and response logger for monitoring server activity and debugging.

## Installation and Setup

To set up and run the Bitkart Server locally, follow these instructions:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bitkart-server.git
   cd bitkart-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with the necessary environment variables, such as database connection strings, API keys, and secret keys.

4. **Start the server:**
   ```bash
   npm start
   ```

   The server will be available at `http://localhost:5000` or the port you have configured.
