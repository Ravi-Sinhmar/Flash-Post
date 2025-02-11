Here’s a professional and comprehensive `README.md` file for your **Flash Post** project. It includes all the details you provided, structured in a clear and organized manner.

---

# Flash Post

Flash Post is a powerful automation tool designed to streamline the process of uploading posts on Instagram, Facebook, and sending bulk emails. It provides a seamless experience for managing social media content and email campaigns, with advanced features like OAuth integration, token management, and automated scheduling.

---

## Features

### Social Media Automation
- **Cross-Platform Posting**: Automatically upload posts to Instagram and Facebook.
  - **Single Post**: Upload a single image or text post.
  - **Carousel Post**: Upload multiple images in a carousel format.
  - **Video Post**: (In Progress) Upload videos using AWS S3 for storage.
- **Scheduling**: Schedule posts to be published on specific days and times.
- **OAuth Integration**: Secure authentication using OAuth for Instagram, Facebook, and Google (Gmail).
- **Token Management**:
  - Auto-refresh tokens every 15 days to ensure uninterrupted service.
  - Token revocation logic for enhanced security.

### Email Automation
- **Bulk Email Sending**: Send emails to multiple recipients at once.
- **Email Segregation**: Automatically segregate emails into:
  - **Replied Emails**: Track responses from recipients.
  - **Unreplied Emails**: Identify emails that require follow-up.
- **Reply Management**: Allow users to reply to emails directly from the website.

### User Authentication
- **Full App Authentication**: Secure login using name, email, and password.
- **Individual Service Authentication**: Users can authenticate individual services (Instagram, Facebook, Gmail) after logging in.
- **Facebook Graph API**: Utilized for Instagram and Facebook access tokens and automation.

### Technology Stack
- **Backend**: Node.js with Express.js for robust server-side logic.
- **Database**: MongoDB for efficient data storage and management.
- **AWS S3**: (In Progress) Used for storing videos and images for video posts.

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- AWS S3 Account (for video and image storage)
- Facebook Developer Account (for Instagram and Facebook API access)
- Google Cloud Console Account (for Gmail API access)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ravi-Sinhmar/FlashPost.git
   ```
2. Navigate to the project directory:
   ```bash
   cd flash-post
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     NODE_ENV = "DEV"
LOCAL_PORT = 3000
REMOTE_DB_STR = mongodb+srv://{username}:{password}@cluster0.bsrjbs4.mongodb.net/sample_mflix?
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=example@gmail.com
EMAIL_PASS=ksdk kdkd ksld jdhf     // sample
DOMAIN = https://f322-185-107-56-129.ngrok-free.app   

# Instagram Credentials // sample
INSTAGRAM_APP_ID = "834543949125892349" 
INSTAGRAM_APP_SECRET = "eaksfd93485ad8fsf8df8df9s9" 
INSTAGRAM_REDIRECT_URI ="https://f322-185-107-56-129.ngrok-free.app/auth/instagram/callback"  // insta will only work on https
INSTAGRAM_GRAPH_BASE_URL = "https://graph.instagram.com"
INSTAGRAM_SESSION_SECRET = "SECRET"
INSTAGRAM_SCOPEs = 'instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments'
INSTAGRAM_APP_ACCESS_TOKEN = "39285793475983849|eaksfd93485ad8fsf8df8df9s9"

# Facebook Credentials // sapmple
Facebook_APP_ID = '153793475949395489'
Facebook_APP_SECRET = 'sdk3587fhdh93589sdjf5348385hsdf'
Facebook_REDIRECT_URI = "http://localhost:3000/auth/facebook/callback"
Facebook_GRAPH_BASE_URL = "https://graph.facebook.com/983475394598345783"
Facebook_SCOPE = ["email", "pages_read_engagement", "pages_manage_posts"]
     ```
5. Start the server:
   ```bash
   npm start
   ```

---

## Usage

### Social Media Posting
1. Log in to the app using your email and password.
2. Authenticate your Instagram and Facebook accounts using OAuth.
3. Create a new post:
   - Choose the platform (Instagram or Facebook).
   - Select the type of post (Single, Carousel, or Video).
   - Upload media (images or videos).
   - Add a caption and schedule the post.
4. View scheduled posts and their status.

### Email Campaigns
1. Authenticate your Gmail account using OAuth.
2. Upload a list of email recipients.
3. Compose an email and send it in bulk.
4. Track replied and unreplied emails.
5. Reply to emails directly from the app.

---

## API Reference

### Social Media APIs
- **Facebook Graph API**: Used for accessing Facebook and Instagram functionalities.
- **Instagram Graph API**: Used for posting and managing Instagram content.

### Email APIs
- **Gmail API**: Used for sending emails and managing replies.

---

## Contributing

Contributions are welcome! If you'd like to contribute to Flash Post, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your branch and submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- **Facebook Graph API** for Instagram and Facebook integration.
- **Google Gmail API** for email automation.
- **AWS S3** for media storage.
- **Node.js** and **Express.js** for backend development.
- **MongoDB** for database management.

---

## Contact

For any questions or feedback, feel free to reach out:
- **Email**: ravi.sinhmar28gmail.com
- **GitHub**: [Ravi-Sinhmar](https://github.com/Ravi-Sinhmar)

---

This `README.md` provides a professional overview of your project, making it easy for users and contributors to understand and use **Flash Post**. You can further customize it to suit your needs!