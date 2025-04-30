pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Branch') {
            steps {
                script {
                    // Menggunakan git untuk mendapatkan nama branch
                    def branch = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Current Branch: ${branch}"

                    // Menyimpan nama branch ke dalam env.BRANCH_NAME jika perlu
                    env.BRANCH_NAME = branch
                }
            }
        }

        stage('Build') {
            when {
                expression {
                    // Memeriksa nama branch yang sudah di-set
                    return env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'production'
                }
            }
            steps {
                echo "Building on branch: ${env.BRANCH_NAME}"
                // Tambahkan langkah build di sini
            }
        }
    }
}
