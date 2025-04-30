pipeline {
    agent any

    environment {
        IMAGE_NAME = "ilhammuhamad/pm-be"
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
        VPS_HOST = "168.231.118.205"
        VPS_USER = "root" // Misalnya root atau user di VPS
        SSH_CREDENTIALS_ID = "vps-key" // Credentials ID dari SSH Key di Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm  // Clone repo dari SCM (GitHub)
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        # Copy SSH private key ke lokasi sementara
                        mkdir -p ~/.ssh
                        cp $SSH_KEY ~/.ssh/id_rsa
                        chmod 600 ~/.ssh/id_rsa

                        # SSH ke VPS dan jalankan perintah deploy
                        ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << 'EOF'
                            cd /root/projects/project-management/pm-be
                            docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                            docker-compose down || true
                            docker-compose up -d
EOF
                    '''
                }
            }
        }
    }
}
