#!/bin/bash

# Setup script for deployment configuration
# This script helps you set up the deployment environment

echo "🚀 Data Tracker Deployment Setup"
echo "================================="

# Check if required tools are installed
echo "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need Docker to test builds locally."
fi

echo "✅ Prerequisites check complete"
echo ""

# Generate NextAuth secret
echo "🔐 Generating NextAuth secret..."
if command -v openssl &> /dev/null; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "Generated NextAuth secret: $NEXTAUTH_SECRET"
    echo "Save this for your GitHub secrets!"
else
    echo "⚠️  OpenSSL not found. Please generate a random 32+ character string for NEXTAUTH_SECRET"
fi

echo ""

# Test Docker build
echo "🐳 Testing Docker build (optional)..."
read -p "Do you want to test the Docker build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Building Docker image..."
    if docker build -t stillraining-tracker-test .; then
        echo "✅ Docker build successful!"
        echo "Cleaning up test image..."
        docker rmi stillraining-tracker-test
    else
        echo "❌ Docker build failed. Please check your Dockerfile."
    fi
fi

echo ""

# Checklist
echo "📋 Deployment Checklist"
echo "======================="
echo "Before pushing to GitHub, make sure you have:"
echo ""
echo "□ Created Neon PostgreSQL database"
echo "□ Created GitHub repository 'stillraining-tracker'"
echo "□ Set up GCP project"
echo "□ Created GCP service account with proper roles"
echo "□ Downloaded service account JSON key"
echo "□ Added all required GitHub secrets:"
echo "  - GCP_PROJECT_ID"
echo "  - GCP_SERVICE_ACCOUNT_KEY"
echo "  - DATABASE_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXTAUTH_URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""

# Git status
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "📊 Git Status:"
    git status --short
    echo ""
    echo "Ready to commit and push? Run:"
    echo "git add ."
    echo "git commit -m 'Add deployment configuration'"
    echo "git push origin main"
else
    echo "⚠️  Not in a Git repository. Initialize Git first:"
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Initial commit'"
fi

echo ""
echo "🎉 Setup complete! Follow DEPLOYMENT.md for next steps."
