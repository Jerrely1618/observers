pipeline {
    agent any
    
    environment {
        CI = 'true'
    }
    
    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Deploy to Vercel') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN')]) {
                        if (isUnix()) {
                            sh "vercel deploy --token $VERCEL_TOKEN --prod"
                        } else {
                            bat "vercel deploy --token $VERCEL_TOKEN --prod"
                        }
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment has been successful.'
        }
        failure {
            echo 'Deployment has failed. Please check the Jenkins logs for more details.'
        }
    }
}
