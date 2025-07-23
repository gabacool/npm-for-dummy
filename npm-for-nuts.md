require('../utils/logger'); // From our project
```

**Step 4:** src/ai/task-analyzer.js
```javascript
const { logger } = require('../utils/logger');
// Pure JavaScript - no external dependencies!
```

### **Visualization Exercise**

```bash
# See the import chain:
grep -r "require.*src/" scripts/
grep -r "require.*\.\." src/
```

This shows how files import each other.

---

## 🎯 Hands-On Learning Exercises {#learning-exercises}

### **Exercise 1: Command Detective**

Pick any command and investigate it completely:

```bash
# Choose a command
npm run ai:suggestions

# Step 1: Find its definition
grep -A 1 '"ai:suggestions"' package.json

# Step 2: Look at the script file
cat scripts/ai-suggestions.js

# Step 3: See what it imports
grep "require" scripts/ai-suggestions.js

# Step 4: Follow one of those imports
head -20 src/ai/suggestion-engine.js

# Step 5: Run it and understand what it does
npm run ai:suggestions
```

### **Exercise 2: Create a Useful Command**

**Goal:** Create a command that shows project statistics

**Step 1:** Create the script
```bash
cat > scripts/project-stats.js << 'EOF'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 Project Statistics');
console.log('====================');

// Count JavaScript files
const jsFiles = [];
function findJsFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.includes('node_modules')) {
      findJsFiles(filePath);
    } else if (file.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  });
}

findJsFiles('.');

console.log('JavaScript files:', jsFiles.length);
console.log('Source files:', jsFiles.filter(f => f.includes('src/')).length);
console.log('Test files:', jsFiles.filter(f => f.includes('test')).length);
console.log('Script files:', jsFiles.filter(f => f.includes('scripts/')).length);

// Count lines of code
let totalLines = 0;
jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  totalLines += content.split('\n').length;
});

console.log('Total lines of code:', totalLines);
console.log('Average lines per file:', Math.round(totalLines / jsFiles.length));
EOF
```

**Step 2:** Add to package.json (manually edit the scripts section)
```json
"project-stats": "node scripts/project-stats.js"
```

**Step 3:** Test your new command
```bash
npm run project-stats
```

### **Exercise 3: Understand Tool Chains**

**Goal:** See how tools are connected

```bash
# See what linting actually does:
npm run lint

# See the raw command:
npx eslint src/ --ext .js

# See ESLint's configuration:
cat .eslintrc.json

# See what ESLint would change:
npx eslint src/ --ext .js --fix-dry-run
```

### **Exercise 4: Build Your Own Workflow**

**Goal:** Create a command that does multiple things

**Add to package.json:**
```json
{
  "scripts": {
    "my-workflow": "run-s my-clean my-check my-info",
    "my-clean": "echo '🧹 Cleaning...' && rm -rf coverage/",
    "my-check": "echo '🔍 Checking...' && npm run lint",
    "my-info": "echo '📊 Info...' && npm run project-stats"
  }
}
```

**Try it:**
```bash
npm run my-workflow
```

---

## 🔄 Common Patterns Explained {#common-patterns}

### **Pattern 1: Parallel vs Sequential**

```json
{
  "dev": "run-p dev:server dev:watch",      // Parallel - both run together
  "test": "run-s test:lint test:unit"       // Sequential - one after another
}
```

**When to use parallel:**
- Starting multiple services
- Running independent tasks
- Development environment setup

**When to use sequential:**
- Quality gates (lint → test → build)
- Setup processes (env → deps → db)
- Deployment pipelines

### **Pattern 2: Environment Variants**

```json
{
  "start": "npm run start:dev",
  "start:dev": "NODE_ENV=development nodemon src/server.js",
  "start:prod": "NODE_ENV=production node src/server.js",
  "start:test": "NODE_ENV=test node src/server.js"
}
```

### **Pattern 3: Conditional Execution**

```json
{
  "deploy": "npm test && npm run build && npm run upload",
  "ci": "npm run lint || exit 1; npm test || exit 1; npm run build"
}
```

**Operators explained:**
- `&&` = "and" - run next command only if previous succeeded
- `||` = "or" - run next command only if previous failed
- `;` = always run next command regardless

### **Pattern 4: Tool Composition**

```json
{
  "lint": "eslint src/",
  "lint:fix": "eslint src/ --fix",
  "lint:watch": "nodemon --exec 'npm run lint' --watch src/",
  "quality": "npm run lint && npm run test && npm run audit"
}
```

### **Pattern 5: File Watching**

```json
{
  "dev:watch": "chokidar 'src/**/*.js' -c 'npm run lint:fix'",
  "test:watch": "jest --watch",
  "build:watch": "webpack --watch"
}
```

---

## 🚀 Advanced Concepts Made Simple {#advanced-concepts}

### **Lifecycle Scripts**

npm automatically runs certain scripts:

```json
{
  "scripts": {
    "preinstall": "echo 'About to install dependencies'",
    "postinstall": "echo 'Dependencies installed, setting up...' && npm run setup",
    
    "prestart": "echo 'Preparing to start...' && npm run build",
    "start": "node src/server.js",
    "poststart": "echo 'Server started!'",
    
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "npm run coverage"
  }
}
```

### **Cross-Platform Scripts**

Make scripts work on Windows, Mac, and Linux:

```json
{
  "scripts": {
    "clean": "rimraf dist/",                    // Works everywhere
    "copy": "copyfiles 'src/**/*' dist/",       // Cross-platform copy
    "env": "cross-env NODE_ENV=production",     // Set env vars everywhere
    "serve": "http-server dist/ -p 8080"        // Universal server
  }
}
```

### **Script Arguments**

Pass arguments to underlying commands:

```bash
# Basic usage
npm run test -- --watch
npm run lint -- --fix
npm run build -- --production

# Multiple arguments
npm run serve -- --port 8080 --cors
```

### **Environment Variables in Scripts**

```json
{
  "scripts": {
    "debug": "DEBUG=* npm start",
    "prod": "NODE_ENV=production PORT=80 npm start",
    "test:ci": "CI=true npm test"
  }
}
```

### **Workspace Management** (for large projects)

```json
{
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "test:all": "npm run test --workspaces",
    "build:all": "npm run build --workspaces"
  }
}
```

---

## 🎓 Your Learning Roadmap {#learning-roadmap}

### **Week 1: Foundations**
**Daily Practice:**
```bash
npm --version
npm list
npm run health
npm start
npm test
```

**Goals:**
- [ ] Understand what npm is and isn't
- [ ] Navigate package.json confidently
- [ ] Run basic scripts without fear
- [ ] Install and uninstall packages

**Exercises:**
- Trace 3 different commands through the system
- Create your first custom script
- Understand the difference between dependencies and devDependencies

### **Week 2: Practical Usage**
**Daily Practice:**
```bash
npm run setup
npm run dev
npm run lint:fix  
npm test
npm run build
```

**Goals:**
- [ ] Set up development environments quickly
- [ ] Use npm scripts for daily development
- [ ] Understand testing workflows
- [ ] Basic code quality practices

**Exercises:**
- Build a complete development workflow
- Create scripts for common tasks
- Learn to debug failing scripts

### **Week 3: Intermediate Skills**
**Daily Practice:**
```bash
npm run setup:env
npm run ai:analyze
npm run deploy:staging
npm audit
npm outdated
```

**Goals:**
- [ ] Manage multiple environments
- [ ] Integrate external tools and services
- [ ] Understand deployment workflows
- [ ] Security and dependency management

**Exercises:**
- Create environment-specific scripts
- Build a CI/CD pipeline with npm scripts
- Add new tools to existing workflow

### **Week 4: Advanced Mastery**
**Daily Practice:**
```bash
# Create your own custom workflows
# Optimize existing scripts
# Contribute to team npm practices
```

**Goals:**
- [ ] Write complex multi-step workflows
- [ ] Optimize team development processes
- [ ] Troubleshoot npm issues
- [ ] Mentor others on npm usage

**Exercises:**
- Build a complete project from scratch using npm patterns
- Create reusable npm script templates
- Document best practices for your team

### **Continuous Learning**

**Stay Updated:**
```bash
npm audit                    # Regular security checks
npm outdated                 # Check for updates
npm docs <package-name>      # Learn about new packages
```

**Community Resources:**
- npmjs.com - Package registry and documentation
- GitHub - See how other projects use npm scripts
- Stack Overflow - Solutions to common problems
- npm blog - Updates and best practices

---

## 🎯 Key Takeaways

### **What You Now Know**

✅ **npm is NOT magic** - everything is just files calling other files  
✅ **Commands are completely customizable** - you define everything in package.json  
✅ **Scripts can do anything** - from simple shell commands to complex workflows  
✅ **Tools are just packages** - installed in node_modules/, configured by files  
✅ **Workflows are composable** - build complex processes from simple commands  

### **The Power of Understanding**

🎯 **You can now read any project's package.json and understand exactly what it does**  
🔧 **You can customize workflows to match your exact needs**  
👥 **You can collaborate effectively with teams using npm**  
🚀 **You can build professional-grade development environments**  
🔍 **You can debug npm issues because you understand the system**  

### **What npm Really Is**

**npm is NOT:**
❌ A magical tool that knows what your project needs  
❌ Just a package installer  
❌ Limited to specific types of projects  
❌ Hard to understand once you see behind the curtain  

**npm IS:**
✅ **A universal command runner** that executes what YOU define  
✅ **A package manager** that handles dependencies  
✅ **A workflow orchestrator** that can run any command-line tool  
✅ **A team collaboration platform** that standardizes development processes  
✅ **Your development assistant** that remembers complex commands for you  

---

## 🎪 Real-World Examples

### **Example 1: E-commerce Website**
```json
{
  "scripts": {
    "dev": "run-p dev:frontend dev:backend dev:payment",
    "dev:frontend": "next dev",
    "dev:backend": "nodemon api/server.js",
    "dev:payment": "stripe listen --forward-to localhost:3000/webhook",
    
    "test": "run-s test:unit test:integration test:e2e",
    "test:e2e": "playwright test",
    
    "deploy": "run-s build deploy:frontend deploy:backend",
    "deploy:frontend": "vercel --prod",
    "deploy:backend": "railway deploy"
  }
}
```

### **Example 2: Mobile App**
```json
{
  "scripts": {
    "ios": "react-native run-ios",
    "android": "react-native run-android",
    "test": "jest",
    "test:detox": "detox test",
    
    "build:ios": "cd ios && xcodebuild -scheme MyApp archive",
    "build:android": "cd android && ./gradlew assembleRelease",
    
    "deploy:ios": "fastlane ios deploy",
    "deploy:android": "fastlane android deploy"
  }
}
```

### **Example 3: Data Science Project**
```json
{
  "scripts": {
    "extract": "node scripts/extract-data.js",
    "transform": "python scripts/clean_data.py",
    "analyze": "jupyter notebook analysis.ipynb",
    "visualize": "node scripts/generate-charts.js",
    
    "pipeline": "run-s extract transform analyze visualize",
    "schedule": "node scripts/scheduler.js",
    
    "model:train": "python models/train.py",
    "model:evaluate": "python models/evaluate.py",
    "model:deploy": "python models/deploy.py"
  }
}
```

---

## 🔧 Troubleshooting Guide

### **Common Issues and Solutions**

#### **"Command not found" Error**
```bash
# Error: eslint: command not found
# Solution: Install the package
npm install --save-dev eslint

# Or use npx to run without installing
npx eslint src/
```

#### **"Missing script" Error**
```bash
# Error: Missing script: "buid"
# Problem: Typo in command name
# Solution: Check package.json for correct script names
npm run build  # (not "buid")
```

#### **Port Already in Use**
```bash
# Error: EADDRINUSE :::3000
# Solution: Kill the existing process or use different port
lsof -i :3000          # Find what's using port 3000
kill -9 [PID]          # Kill the process
# Or: PORT=3001 npm start
```

#### **Permission Errors**
```bash
# Error: EACCES permission denied
# Solution: Don't use sudo with npm
# Fix npm permissions:
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### **Module Not Found**
```bash
# Error: Cannot find module 'express'
# Solution: Install dependencies
npm install
# Or install specific module:
npm install express
```

### **Debugging Techniques**

#### **Verbose Output**
```bash
npm run test --verbose
npm install --verbose
```

#### **Check What a Script Actually Does**
```bash
# See the actual command without running it
npm run test --dry-run

# Check script definition
grep -A 1 '"test"' package.json
```

#### **Environment Debugging**
```bash
# Check environment variables
npm run env

# Check npm configuration
npm config list

# Check Node.js and npm versions
node --version
npm --version
```

---

## 📚 Advanced Resources

### **Useful npm Packages for Scripts**

#### **Script Runners**
```bash
npm install --save-dev npm-run-all    # run-p, run-s
npm install --save-dev concurrently   # Run commands in parallel
npm install --save-dev wait-on        # Wait for servers/files
```

#### **Cross-Platform Tools**
```bash
npm install --save-dev rimraf         # rm -rf that works everywhere
npm install --save-dev copyfiles      # Copy files cross-platform
npm install --save-dev cross-env      # Set environment variables
```

#### **File Watching**
```bash
npm install --save-dev chokidar-cli   # Watch files for changes
npm install --save-dev nodemon        # Auto-restart Node.js apps
npm install --save-dev live-server    # Auto-reload development server
```

#### **Utilities**
```bash
npm install --save-dev mkdirp         # mkdir -p that works everywhere
npm install --save-dev shx            # Shell commands for Node.js
npm install --save-dev opn-cli        # Open URLs and files
```

### **npm Script Libraries**

#### **Testing**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

#### **Linting and Formatting**
```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/"
  }
}
```

#### **Building and Bundling**
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:watch": "webpack --mode development --watch",
    "build:analyze": "webpack-bundle-analyzer dist/"
  }
}
```

---

## 🎭 Beyond the Basics

### **Monorepo Management**
```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "test:all": "npm run test --workspaces",
    "build:all": "npm run build --workspaces",
    "clean:all": "npm run clean --workspaces"
  }
}
```

### **Docker Integration**
```json
{
  "scripts": {
    "docker:build": "docker build -t my-app .",
    "docker:run": "docker run -p 3000:3000 my-app",
    "docker:push": "docker push my-app:latest",
    "docker:dev": "docker-compose up"
  }
}
```

### **CI/CD Integration**
```json
{
  "scripts": {
    "ci": "run-s ci:*",
    "ci:install": "npm ci",
    "ci:lint": "npm run lint",
    "ci:test": "npm run test:ci",
    "ci:build": "npm run build",
    "ci:security": "npm audit --audit-level moderate"
  }
}
```

---

## 🎉 Congratulations! You've Graduated from "npm for Nuts"

### **What You've Achieved**

🎓 **Complete understanding** of how npm really works  
🔧 **Practical skills** to customize any development workflow  
🕵️ **Detective abilities** to trace any command through the system  
🛠️ **Building skills** to create your own professional workflows  
👥 **Collaboration skills** to work effectively with development teams  

### **Your npm Superpowers**

✨ **Command Whisperer** - You can read package.json and immediately understand what any project does  
⚡ **Workflow Wizard** - You can automate complex tasks with simple npm scripts  
🔍 **Debug Detective** - You can troubleshoot npm issues because you understand the system  
🚀 **Productivity Pro** - You can set up development environments in minutes  
🎯 **Quality Guardian** - You can implement automated testing, linting, and security checks  

### **The Big Picture**

You now understand that **npm is the central nervous system of modern JavaScript development**. It's not just a package manager - it's the universal command orchestrator that:

- 📦 Manages your project dependencies
- 🛠️ Runs your development tools
- 🔄 Orchestrates complex workflows
- 🧪 Executes your testing pipelines
- 🏗️ Builds your production code
- 🚀 Deploys your applications
- 📊 Monitors your code quality
- 🔒 Ensures your security

**Every professional JavaScript developer** uses npm scripts daily. You're now equipped with the knowledge to join the ranks of developers who understand and leverage this powerful system.

### **Your Next Mission**

1. **Practice daily** with the commands in this guide
2. **Explore other projects** and see how they use npm scripts
3. **Create your own workflows** for personal projects
4. **Share your knowledge** with other developers
5. **Keep learning** as the npm ecosystem evolves

### **Remember the Core Truth**

**npm is NOT magic** - it's a simple, transparent, and incredibly powerful system. Every command is just a file calling other files. Every workflow is just a sequence of simple commands. Every complex build process is just npm orchestrating tools you can understand.

You now have the knowledge to take control of your development environment and build the workflows that make you productive. 

**Welcome to the world of professional JavaScript development!** 🚀

---

*"The best developers are not those who memorize commands, but those who understand systems."*

**You now understand the npm system. Use this power wisely!** ⚡
