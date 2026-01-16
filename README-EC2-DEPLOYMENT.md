# EC2 Deployment Guide

## Prerequisites
- AWS EC2 instance (t3.medium or larger recommended)
- Security Group with ports 80, 443, and 9090 open
- MongoDB installed and running

## Quick Deployment Steps

### 1. Connect to EC2 Instance
```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### 2. Run Deployment Script
```bash
# Upload your project files to EC2 first, then run:
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

### 3. Manual Deployment (Alternative)

#### Install Dependencies
```bash
sudo yum update -y
sudo yum install java-17-amazon-corretto maven -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y mongodb-org nginx
```

#### Start MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Build and Run Backend
```bash
cd corporate-banking-backend
mvn clean package -DskipTests
nohup java -jar target/corporate-banking-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > backend.log 2>&1 &
```

#### Build and Deploy Frontend
```bash
cd ../corporate-banking-frontend
npm install
npm run build -- --configuration production
sudo cp -r dist/corporateUi/* /usr/share/nginx/html/
```

#### Configure Nginx
```bash
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

sudo systemctl restart nginx
```

#### Open Firewall Ports
```bash
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=9090/tcp
sudo firewall-cmd --reload
```

## Default Login Credentials
- **Admin**: username: `admin`, password: `admin123`
- **Relationship Manager**: username: `rm`, password: `rm123`
- **Analyst**: username: `analyst1`, password: `analyst123`

## Access Your Application
- Frontend: `http://your-ec2-public-ip`
- Backend API: `http://your-ec2-public-ip:9090/api`

## Troubleshooting

### Check Backend Logs
```bash
tail -f /opt/corporate-banking/corporate-banking-backend/backend.log
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
```

### Check MongoDB Status
```bash
sudo systemctl status mongod
```

### Verify Services Running
```bash
ps aux | grep java
netstat -tlnp | grep :9090
```

## Security Considerations
1. Configure HTTPS with SSL certificate
2. Restrict MongoDB access to localhost
3. Use environment variables for sensitive data
4. Set up proper IAM roles
5. Configure security groups properly

## Environment Configuration Files Updated
- `environment.prod.ts`: Updated API URL to use EC2 public IP
- `application-prod.properties`: Production backend configuration
- `SecurityConfig.java`: CORS configured for EC2 IP
