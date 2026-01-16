#!/bin/bash

# EC2 Deployment Script for Corporate Banking Application

echo "🚀 Starting EC2 Deployment..."

# Update system
sudo yum update -y

# Install Java 17
sudo yum install java-17-amazon-corretto -y

# Install Maven
sudo yum install maven -y

# Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Create application directory
sudo mkdir -p /opt/corporate-banking
sudo chown ec2-user:ec2-user /opt/corporate-banking
cd /opt/corporate-banking

# Clone your repository (replace with your repo URL)
# git clone <your-repo-url> .

# Build backend
echo "📦 Building backend..."
cd corporate-banking-backend
mvn clean package -DskipTests

# Run backend with production profile
echo "🚀 Starting backend..."
nohup java -jar target/corporate-banking-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > backend.log 2>&1 &

# Build frontend
echo "📦 Building frontend..."
cd ../corporate-banking-frontend
npm install
npm run build -- --configuration production

# Serve frontend with nginx
echo "🌐 Setting up nginx..."
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Copy frontend build to nginx
sudo cp -r dist/corporateUi/* /usr/share/nginx/html/

# Configure nginx to proxy API calls
sudo tee /etc/nginx/conf.d/corporate-banking.conf > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:9090/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Restart nginx
sudo systemctl restart nginx

# Open firewall ports
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=9090/tcp
sudo firewall-cmd --reload

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://$(curl -s http://checkip.amazonaws.com)"
echo "🔧 Backend API: http://$(curl -s http://checkip.amazonaws.com):9090/api"
