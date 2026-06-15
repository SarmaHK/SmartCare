# SmartCare Deployment Guide

This document outlines the steps required to take the SmartCare monorepo from a local development environment to a production server.

## Prerequisites
- Node.js (v18+)
- MySQL (v8+) Server
- PM2 (Process Manager for Node.js)
- Nginx (Reverse Proxy)

---

## 1. Database Production Setup
1. Create a production MySQL database.
2. Execute the `backend/database_schema.sql` script against the production database to construct the tables.
3. Secure the default admin account by changing its password immediately upon first login.

---

## 2. Backend Deployment (Express)
The backend should run as a continuous background process.

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install --production
   ```

2. **Environment Configuration**:
   Create a `.env` file in the `backend/` directory with production values:
   ```env
   PORT=5000
   DB_HOST=your_production_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_secure_password
   DB_NAME=smartcare_prod
   JWT_SECRET=generate_a_very_long_secure_random_string
   ```

3. **Build the Backend** (if using TypeScript compilation):
   ```bash
   npm run build
   ```

4. **Start via PM2**:
   ```bash
   pm2 start dist/index.js --name "smartcare-api"
   pm2 save
   pm2 startup
   ```

---

## 3. Frontend Deployment (Vite/React)
The frontend should be compiled into static HTML/CSS/JS assets and served via Nginx.

1. **Configure Environment**:
   Create a `.env` file in the `frontend/` directory pointing to your live API:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api/v1
   ```

2. **Build Static Assets**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   *This command will create a `dist/` directory containing the optimized static files.*

3. **Configure Nginx**:
   Move the contents of the `frontend/dist/` directory to your web root (e.g., `/var/www/smartcare`).
   
   Create an Nginx server block:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/smartcare;
       index index.html;

       # Ensure React Router handles routing
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Enable Server**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/smartcare /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

Your SmartCare application is now live!
