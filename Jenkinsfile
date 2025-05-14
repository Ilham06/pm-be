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
                    // Set dynamic IMAGE_TAG from build number
                    env.IMAGE_TAG = "build-${env.BUILD_NUMBER}"
                    echo "Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Determine environment (dev or prod) based on the branch
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
                    def version = branchName == 'origin/development' ? 'dev' : 'prod'
                    def port = branchName == 'origin/development' ? '3001' : '5001'
                    def nodeEnv = branchName == 'origin/development' ? 'development' : 'production'

                    // Build Docker image with environment variables
                    echo "Building for ${branchName} with version ${version} on port ${port} using NODE_ENV ${nodeEnv}"
                    sh "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} --build-arg VERSION=${version} --build-arg PORT=${port} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        // stage('Deploy to VPS') {
        //     steps {
        //         withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
        //             script {
        //                 def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
        //                 def deployEnv = branchName == 'origin/development' ? 'dev' : 'prod'

        //                 // Deploy to VPS with a single docker-compose.yml
        //                 echo "Deploying to ${deployEnv} environment"

        //                 sh '''
        //                     mkdir -p ~/.ssh
        //                     cp $SSH_KEY ~/.ssh/id_rsa
        //                     chmod 600 ~/.ssh/id_rsa

        //                     ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << EOF
        //                         cd /root/projects/project-management/pm-be
        //                         docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                                
        //                         # Set environment variables for the specific environment (dev or prod)
        //                         export NODE_ENV=${deployEnv}
        //                         export PORT=${deployEnv == 'dev' ? '3001' : '5001'}
                                
        //                         docker-compose down || true
        //                         IMAGE_TAG=${IMAGE_TAG} docker-compose up -d
        //                     EOF
        //                 '''
        //             }
        //         }
        //     }
        // }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY')]) {
                    script {

                        def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH
                        def deployEnv = branchName == 'origin/development' ? 'dev' : 'prod'

                        // Deploy to VPS with a single docker-compose.yml
                        echo "Deploying to ${deployEnv} environment"

                        sh """
    mkdir -p ~/.ssh
    cp \$SSH_KEY ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa

    # Gunakan bash untuk menjalankan ekspansi variabel yang lebih kompleks
    bash -c '
        export IMAGE_NAME=${IMAGE_NAME}
        export IMAGE_TAG=${IMAGE_TAG}
        export NODE_ENV=${deployEnv}
        export PORT=$(if [ "$deployEnv" == "dev" ]; then echo "3001"; else echo "5001"; fi)

        # Deploy ke server remote
        cd /root/projects/project-management/pm-be

        # Pull image terbaru
        docker pull ${IMAGE_NAME}:${IMAGE_TAG}

        # Matikan container lama dan jalankan yang baru
        docker-compose down || true
        IMAGE_TAG=${IMAGE_TAG} docker-compose up -d
    '
"""

                    }
                }
            }
        }
    }
}
