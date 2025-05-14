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
                script {
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
                    def port = branchName == 'origin/development' ? '3001' : '5001'
                    def version = branchName == 'origin/development' ? 'dev' : 'prod'
                    def envFile = branchName == 'origin/development' ? '.env.dev' : '.env.prod'

                    echo "Building for ${branchName} with version ${version} on port ${port} using env file ${envFile}"

                    env.PORT = port
                    env.ENV_FILE = envFile

                    sh "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} --build-arg VERSION=${version} --build-arg PORT=${port} ."
                }
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

        stage('Deploy Dev') {
            when {
                expression { 
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
                    return branchName == 'origin/development'
                }
            }
            steps {
                deployApp('3001', '.env.dev')
            }
        }

        stage('Deploy Prod') {
            when {
                expression {
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
                    return branchName == 'origin/main'
                }
            }
            steps {
                deployApp('5001', '.env.prod')
            }
        }
    }
}

def deployApp(port, envFile) {
    return {
        withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
            script {
                echo "Deploying on port ${port} using env file ${envFile}"

                sh """
                    mkdir -p ~/.ssh
                    cp \$SSH_KEY ~/.ssh/id_rsa
                    chmod 600 ~/.ssh/id_rsa

                    ssh -o StrictHostKeyChecking=no ${env.VPS_USER}@${env.VPS_HOST} << EOF
                        cd /root/projects/project-management/pm-be

                        echo "IMAGE_TAG=${env.IMAGE_TAG}" > .env.compose
                        echo "PORT=${port}" >> .env.compose
                        echo "ENV_FILE=${envFile}" >> .env.compose

                        docker pull ${env.IMAGE_NAME}:${env.IMAGE_TAG}
                        docker-compose --env-file .env.compose down || true
                        docker-compose --env-file .env.compose up -d
                    EOF
                """
            }
        }
    }
}
