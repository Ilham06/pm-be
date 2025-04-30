pipeline {
    agent any

    environment {
        IMAGE_NAME = "ilhammuhamad/pm-be"
        VPS_HOST = "168.231.118.205"
        VPS_USER = "root"
        SSH_CREDENTIALS_ID = "vps-key"
    }

    stages {
        stage('Set Tag') {
            steps {
                script {
                    env.IMAGE_TAG = "build-${env.BUILD_NUMBER}"
                    echo "Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} ."
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
                    script {
                        sh '''
                            mkdir -p ~/.ssh
                            cp $SSH_KEY ~/.ssh/id_rsa
                            chmod 600 ~/.ssh/id_rsa

                            ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << EOF
                                cd /root/projects/project-management/pm-be
                                docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                                docker-compose down || true
                                IMAGE_TAG=${IMAGE_TAG} docker-compose up -d
EOF
                        '''
                    }
                }
            }
        }
    }
}
