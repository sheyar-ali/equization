# eQuization Backend - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 14.x or higher
- MongoDB 4.x or higher
- SSL Certificate (for HTTPS)
- Domain name
- Email service account

## 📦 Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 globally
sudo npm install -g pm2
```

#### 2. Deploy Application
```bash
# Clone repository
git clone your-repo-url
cd webapp/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Start with PM2
pm2 start server.js --name equization-api
pm2 save
pm2 startup
```

#### 3. Configure Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/equization-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/equization-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/equization
    env_file:
      - .env
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

```bash
# Deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Option 3: Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create equization-api

# Add MongoDB
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USERNAME=your_email
heroku config:set EMAIL_PASSWORD=your_password

# Deploy
git push heroku master

# View logs
heroku logs --tail
```

#### AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 equization-api

# Create environment
eb create equization-api-prod

# Deploy
eb deploy

# Open application
eb open
```

## 🔐 Production Environment Variables

Create `.env.production`:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://username:password@host:port/equization?authSource=admin

# JWT
JWT_SECRET=your_super_long_random_secret_key_min_32_characters
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@equization.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=https://equization.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Use strong MongoDB credentials
- [ ] Disable MongoDB remote access (if possible)
- [ ] Keep dependencies updated
- [ ] Enable MongoDB authentication
- [ ] Use firewall (UFW, AWS Security Groups)
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Set up error tracking (Sentry, etc.)

## 📊 Monitoring

### PM2 Monitoring
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name equization-api

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart equization-api

# Stop
pm2 stop equization-api
```

### Setup PM2 Startup
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

## 🔄 Database Backup

### MongoDB Backup Script
```bash
#!/bin/bash
# backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="equization"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mongodump --db $DB_NAME --out $BACKUP_DIR/$TIMESTAMP

# Compress backup
tar -czf $BACKUP_DIR/equization_$TIMESTAMP.tar.gz $BACKUP_DIR/$TIMESTAMP

# Remove uncompressed backup
rm -rf $BACKUP_DIR/$TIMESTAMP

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: equization_$TIMESTAMP.tar.gz"
```

### Automate Backups with Cron
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/mongodb-backup.log 2>&1
```

## 📈 Performance Optimization

### 1. Database Indexing
The models already include indexes, but verify:
```javascript
// Run in MongoDB shell
use equization
db.quizzes.getIndexes()
db.users.getIndexes()
```

### 2. Enable Compression
```javascript
// In server.js, add:
const compression = require('compression');
app.use(compression());
```

### 3. Caching (Redis)
```bash
# Install Redis
sudo apt install redis-server
npm install redis
```

```javascript
// Add to server.js
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});
```

### 4. Load Balancing (Nginx)
```nginx
upstream backend {
    least_conn;
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check Node.js version
node --version

# Check MongoDB status
sudo systemctl status mongod

# Check ports
sudo lsof -i :5000

# Check logs
pm2 logs equization-api
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongo

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Verify connection string
echo $MONGODB_URI
```

### Memory Issues
```bash
# Check memory usage
free -h

# PM2 memory monitoring
pm2 monit

# Increase Node.js memory
pm2 start server.js --max-memory-restart 1G
```

## 📱 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: cd backend && npm ci
    
    - name: Run tests
      run: cd backend && npm test
    
    - name: Deploy to server
      uses: easingthemes/ssh-deploy@main
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: /var/www/equization-api
    
    - name: Restart PM2
      run: ssh ${{ secrets.REMOTE_USER }}@${{ secrets.REMOTE_HOST }} "pm2 restart equization-api"
```

## 🎯 Post-Deployment

### 1. Verify Deployment
```bash
# Health check
curl https://api.yourdomain.com/api/v1/health

# Test Socket.IO
wscat -c wss://api.yourdomain.com
```

### 2. Seed Database
```bash
node config/seed.js
```

### 3. Monitor Logs
```bash
# PM2 logs
pm2 logs --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 4. Setup Alerts
Consider using:
- UptimeRobot (uptime monitoring)
- Sentry (error tracking)
- LogDNA (log management)
- New Relic (performance monitoring)

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Weekly: Check logs and system health
- Monthly: Update dependencies (`npm update`)
- Quarterly: Review security advisories
- Annually: Update Node.js and MongoDB versions

### Emergency Procedures
```bash
# Quick restart
pm2 restart equization-api

# Rollback deployment
git reset --hard previous-commit
pm2 restart equization-api

# Database restore
mongorestore --db equization /backups/mongodb/backup.tar.gz
```

## ✅ Launch Checklist

- [ ] Server configured and secured
- [ ] MongoDB installed and secured
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Application deployed
- [ ] Database seeded
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] DNS configured
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team notified

## 🎉 You're Live!

Your eQuization backend is now deployed and ready to serve thousands of users!

Remember to:
- Monitor performance regularly
- Keep dependencies updated
- Backup database frequently
- Review logs for errors
- Scale as needed
