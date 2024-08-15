
# Bitkart

Bitkart is a platform designed for BIT Mesra students to buy and sell used items. Built with Next.js, Express, Node.js, and MongoDB, Bitkart emphasizes scalability and handling a large user base.

### [Visit the Deployed Site](https://bitkart.live/)

## Features

-   **User Authentication:** Bitkart uses JSON Web Tokens (JWT) and cookies to ensure secure access. Users signing up with email and password are verified through an OTP, while Google Authentication is available for easier sign-up and sign-in.
    
-   **Item Management:** Users can list items with details like title, description, price, category, year of purchase, hostel number, room number, and contact number. They can also upload up to 4 images per item. Users have the ability to view, edit, and delete their listed items through a dedicated dashboard.
    
-   **Item Showcase:** All users can browse listed items across categories. Logged-in users gain additional benefits, such as viewing full item details and seller information, including contact number and email.
    
-   **Search and Filters:** Bitkart supports product searches by name and provides filters based on categories, price ranges, and ratings.
    
-   **Pagination:** To efficiently manage large inventories, Bitkart implements pagination, showing a limited number of items per page with navigation controls.
    
-   **Responsive Design:** The application is responsive, ensuring an optimal experience on desktops, tablets, and mobile devices.
    
-   **Secure and Scalable File Handling:** Bitkart leverages AWS S3 and CloudFront for storing, transforming, and serving images. This setup ensures secure uploads, efficient transformations (such as resizing or cropping), and fast delivery to users, enhancing overall performance.

- **Error Tracking and Feedback:** Sentry is integrated for user feedback, bug reports, and error tracking, helping to monitor and improve the application's performance and user experience.
    

## Security and Scalability Features

Bitkart prioritizes security and includes several measures to protect user data and maintain platform integrity:

-   **Node.js Cluster Module:** Utilizes the Node.js cluster module to distribute the load across multiple CPU cores, improving performance and reliability. This setup enhances the ability to handle concurrent requests, ensuring smooth operation during high traffic.
    
-   **Helmet:** Incorporates the `helmet` middleware to set various HTTP headers, protecting against common vulnerabilities like Clickjacking, XSS, and other web-based attacks.
    
-   **Express-Mongo-Sanitize:** Uses `express-mongo-sanitize` to prevent NoSQL injection attacks by sanitizing user inputs and blocking malicious queries.
    

## Technologies and Tools Used

**Frontend:**

-   **Next.js:** React framework for building the user interface.
-   **NextUI:** Tailwind-based UI library with customizable prebuilt components.
-   **JS Cookie:** For managing cookies on the client side.
-   **Tailwind CSS:** For styling the UI.
-   **Moment and Moment Timezone:** For formatting item creation and update times.
-   **React Hot Toast:** For toast notifications.
-   **React SVG Icons and Lucide React:** For icons.
-  **Sentry**: For reporting errors and bugs

**Backend:**

-   **Node.js:** JavaScript runtime for server-side applications.
-   **Express.js:** Framework for building RESTful APIs.
-   **MongoDB:** NoSQL database for flexible and scalable storage.
-   **Mongoose:** ODM library for MongoDB, providing schema-based models.
-   **JWT (JSON Web Tokens):** For secure authentication and authorization.
-   **Bcrypt:** For hashing passwords to ensure secure credential storage.
-   **Passport.js:** For Google OAuth 2.0 authentication.
-   **Nodemailer:** For sending OTP emails.
-   **Multer:** For temporary disk storage of files during uploads to S3.
-   **Morgan:** For logging requests.

**State Management:**

-   **Redux Toolkit and RTK Query:** For managing global state and API calls efficiently.

**Deployment and File Management:**

-   **AWS S3 and CloudFront:** For image storage, transformation, and serving. AWS S3 handles secure storage, while CloudFront provides fast delivery and caching. The image optimization follows the architecture described in this AWS blog post: [Image Optimization using Amazon CloudFront and AWS Lambda](https://aws.amazon.com/blogs/networking-and-content-delivery/image-optimization-using-amazon-cloudfront-and-aws-lambda/).

![Image Optimization Architecture](https://d2908q01vomqb2.cloudfront.net/5b384ce32d8cdef02bc3a139d4cac0a22bb029e8/2022/10/21/diagram-img-1024x416.png)


### Bitkart is continuously evolving to enhance user experience, with more features and improvements planned for future releases.
