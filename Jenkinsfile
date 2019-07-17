pipeline {
    agent {
        kubernetes {
            label 'node-carbon'
        }
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
                container('vault') {
                    script {
                        env.TUNNEL_IDENTIFIER = sh(script: 'echo ${GIT_COMMIT}-${BUILD_NUMBER}', returnStdout: true)
                        env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
                        env.CODECOV_TOKEN = sh(script: 'vault read -field=molgenis-app-lifelines-webshop secret/ops/token/codecov', returnStdout: true)
                        env.SAUCE_CRED_USR = sh(script: 'vault read -field=username secret/ops/token/saucelabs', returnStdout: true)
                        env.SAUCE_CRED_PSW = sh(script: 'vault read -field=value secret/ops/token/saucelabs', returnStdout: true)
                        env.NPM_TOKEN = sh(script: 'vault read -field=value secret/ops/token/npm', returnStdout: true)
                    }
                }
                container('node') {
                    sh "daemon --name=sauceconnect -- /usr/local/bin/sc -u ${SAUCE_CRED_USR} -k ${SAUCE_CRED_PSW} -i ${TUNNEL_IDENTIFIER}"
                }
            }
        }
        stage('Install and test: [ pull request ]') {
            when {
                changeRequest()
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn lint"
                    sh "yarn test:unit"
                    sh "yarn test:e2e --env ci_chrome,ci_safari,ci_ie11,ci_firefox"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
                    }
                }
            }
        }
        stage('Install, test and build: [ master ]') {
            when {
                branch 'master'
                not { 
                    changelog '.*\\[skip ci\\]$'
                }
            }
            steps {
                milestone 1
                container('node') {
                    sh "yarn install"
                    sh "yarn test:unit"
                    sh "yarn test:e2e --env ci_chrome,ci_safari,ci_ie11,ci_firefox"
                    sh "yarn build"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
                    }
                }
            }
        }
        stage('Release: [ master ]') {
            when {
                allOf {
                    branch 'master'
                    not {
                        changelog '.*\\[skip ci\\]$'
                    }
                }
            }
            environment {
                GIT_AUTHOR_EMAIL = 'molgenis+ci@gmail.com'
                GIT_AUTHOR_NAME = 'molgenis-jenkins'
                GIT_COMMITTER_EMAIL = 'molgenis+ci@gmail.com'
                GIT_COMMITTER_NAME = 'molgenis-jenkins'
            }
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    script {
                        input(message: 'Do you want to release?', ok: 'Release')
                    }
                }
                milestone 2
                container('node') {
                    sh "npx semantic-release"
                }
            }
        }
    }
    post {
        always {
            container('node') {
                sh "daemon --name=sauceconnect --stop"
            }
        }
        success {
            notifySuccess()
        }
        failure {
            notifyFailed()
        }
    }
}

def notifySuccess() {
    hubotSend(message: 'Build success', status:'INFO', site: 'slack-pr-app-team')
}

def notifyFailed() {
    hubotSend(message: 'Build failed', status:'ERROR', site: 'slack-pr-app-team')
}
