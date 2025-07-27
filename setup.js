#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍅 Setting up Tomato Food Delivery App...\n');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
    console.log(`${colors[color]}${message}${colors.reset}`);
};

// Check if Node.js is installed
try {
    const nodeVersion = process.version;
    log(`✅ Node.js version: ${nodeVersion}`, 'green');
} catch (error) {
    log('❌ Node.js is not installed. Please install Node.js first.', 'red');
    process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
    log('📝 Creating .env file...', 'yellow');
    
    const envContent = `# Database Configuration

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Server Configuration
PORT=4000

# Frontend URLs (for CORS and redirects)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# Environment
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
`;
    
    fs.writeFileSync(envPath, envContent);
    log('✅ .env file created successfully', 'green');
    log('⚠️  Please update the .env file with your actual credentials', 'yellow');
} else {
    log('✅ .env file already exists', 'green');
}

// Install dependencies for backend
log('\n📦 Installing backend dependencies...', 'blue');
try {
    execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });
    log('✅ Backend dependencies installed', 'green');
} catch (error) {
    log('❌ Failed to install backend dependencies', 'red');
}

// Install dependencies for frontend
log('\n📦 Installing frontend dependencies...', 'blue');
try {
    execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
    log('✅ Frontend dependencies installed', 'green');
} catch (error) {
    log('❌ Failed to install frontend dependencies', 'red');
}

// Install dependencies for admin
log('\n📦 Installing admin dependencies...', 'blue');
try {
    execSync('npm install', { cwd: path.join(__dirname, 'admin'), stdio: 'inherit' });
    log('✅ Admin dependencies installed', 'green');
} catch (error) {
    log('❌ Failed to install admin dependencies', 'red');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'backend', 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    log('✅ Uploads directory created', 'green');
} else {
    log('✅ Uploads directory already exists', 'green');
}

// Create package.json scripts
log('\n📝 Creating package.json scripts...', 'yellow');

const rootPackageJson = {
    name: "tomato-food-delivery",
    version: "1.0.0",
    description: "A full-featured food delivery application",
    scripts: {
        "dev": "concurrently \"npm run server\" \"npm run client\" \"npm run admin\"",
        "server": "cd backend && npm run server",
        "client": "cd frontend && npm run dev",
        "admin": "cd admin && npm run dev",
        "build": "cd frontend && npm run build && cd ../admin && npm run build",
        "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install && cd ../admin && npm install",
        "setup": "node setup.js"
    },
    devDependencies: {
        "concurrently": "^8.2.2"
    },
    keywords: ["food-delivery", "mern-stack", "react", "nodejs", "mongodb"],
    author: "Your Name",
    license: "MIT"
};

const rootPackagePath = path.join(__dirname, 'package.json');
if (!fs.existsSync(rootPackagePath)) {
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackageJson, null, 2));
    log('✅ Root package.json created', 'green');
} else {
    log('✅ Root package.json already exists', 'green');
}

// Create README with setup instructions
const setupInstructions = `
# 🍅 Tomato Food Delivery App - Setup Complete!

## 🚀 Quick Start

1. **Configure Environment Variables**
   - Edit \`backend/.env\` with your actual credentials
   - Update MongoDB URI, JWT secret, and Stripe keys

2. **Start the Application**
   \`\`\`bash
   # Start all services (backend, frontend, admin)
   npm run dev
   
   # Or start individually:
   npm run server    # Backend API (port 4000)
   npm run client    # Frontend (port 5173)
   npm run admin     # Admin panel (port 5174)
   \`\`\`

## 📁 Project Structure
- \`backend/\` - Node.js/Express API server
- \`frontend/\` - React customer interface
- \`admin/\` - React admin panel

## 🔧 Available Scripts
- \`npm run dev\` - Start all services concurrently
- \`npm run server\` - Start backend only
- \`npm run client\` - Start frontend only
- \`npm run admin\` - Start admin panel only
- \`npm run build\` - Build for production
- \`npm run install-all\` - Install all dependencies

## 🌐 Access Points
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:5174
- API: http://localhost:4000
- Health Check: http://localhost:4000/health

## 📝 Next Steps
1. Set up your MongoDB database
2. Configure Stripe for payments
3. Add your first food items through the admin panel
4. Test the complete order flow

Happy coding! 🎉
`;

const setupReadmePath = path.join(__dirname, 'SETUP.md');
fs.writeFileSync(setupReadmePath, setupInstructions);

log('\n🎉 Setup completed successfully!', 'green');
log('\n📋 Next steps:', 'blue');
log('1. Edit backend/.env with your actual credentials', 'yellow');
log('2. Run "npm run dev" to start all services', 'yellow');
log('3. Check SETUP.md for detailed instructions', 'yellow');
log('\n🌐 Access points:', 'blue');
log('- Frontend: http://localhost:5173', 'green');
log('- Admin Panel: http://localhost:5174', 'green');
log('- API: http://localhost:4000', 'green');
log('- Health Check: http://localhost:4000/health', 'green'); 
