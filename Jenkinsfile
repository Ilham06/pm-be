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
                    def port = branchName == 'development' ? '3001' : '5001'  // Menentukan port berdasarkan branch
                    def version = branchName == 'development' ? 'dev' : 'prod'  // Menentukan versi berdasarkan branch
                    def envFile = branchName == 'development' ? '.env.dev' : '.env.prod'  // Menentukan file .env sesuai branch
                    
                    echo "Building for ${branchName} with version ${version} on port ${port} using env file ${envFile}"

                    // Set environment variables
                    env.PORT = port
                    env.ENV_FILE = envFile

                    // Build Docker image dengan tag yang sudah disesuaikan
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

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    script {
                        def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
                        def port = branchName == 'development' ? '3001' : '5001'  // Menentukan port berdasarkan branch
                        def envFile = branchName == 'development' ? '.env.dev' : '.env.prod'  // Menentukan file .env sesuai branch

                        echo "Deploying ${branchName} on port ${port} using env file ${envFile}"

                        // Set PORT dan ENV_FILE untuk digunakan di Docker Compose
                        env.PORT = port
                        env.ENV_FILE = envFile

                        sh '''
                            mkdir -p ~/.ssh
                            cp $SSH_KEY ~/.ssh/id_rsa
                            chmod 600 ~/.ssh/id_rsa

                            ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << EOF
                                cd /root/projects/project-management/pm-be
                                docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                                docker-compose down || true
                                IMAGE_TAG=${IMAGE_TAG} PORT=${port} ENV_FILE=${envFile} docker-compose up -d
EOF
                        '''
                    }
                }
            }
        }
    }
}

