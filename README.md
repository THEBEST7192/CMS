# CMS

A Node.js + Express + EJS web application for content sharing with user roles, this site has tenor gifs and user uploaded images with encryption for credentials.

## Features
- User authentication and roles
- File uploads with Multer
- MySQL database integration

## Prerequisites
- Node.js v16+
- MySQL database
- Multer
- Tenor API key

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/THEBEST7192/CMS
   ```
2. Navigate into the project directory:
   ```bash
   cd CMS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Edit the `.env` file with your database credentials and `SESSION_SECRET`.
   - Add your Tenor API key to the `.env` file.

## Available Scripts
- `npm start` - Run the app

## Project Structure
```
.
├─ app.js           # Entry point
├─ config/          # Configuration files
├─ database/        # Database initialization scripts
├─ public/          # Static assets (css, js, uploads)
├─ views/           # EJS templates
└─ .env             # Environment variables
```

## License
Who gives a fuck
