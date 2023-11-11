pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building Node.js application...'
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        
        stage('Dockerize') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t finfi-app .'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying Node.js application...'
                sh 'docker run -d -p 3000:3000 finfi-app'
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed. Send notifications...'
            // Add notification steps (email, Slack, etc.) here
        }
    }
}
