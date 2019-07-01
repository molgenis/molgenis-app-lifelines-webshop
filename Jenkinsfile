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
                        env.NEXUS_AUTH = sh(script: 'vault read -field=base64 secret/ops/account/nexus', returnStdout: true)
                    }
                }
                container('node') {
                    sh "daemon --name=sauceconnect -- /usr/local/bin/sc -u ${SAUCE_CRED_USR} -k ${SAUCE_CRED_PSW} -i ${TUNNEL_IDENTIFIER}"
                }
            }
        }
        stage('Install and test: [ PR ]') {
            when {
                changeRequest()
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn lint"
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
        stage('Build container serving the app [ PR ]') {
            when {
                changeRequest()
            }
            environment {
                TAG = "PR-${CHANGE_ID}-${BUILD_NUMBER}"
                DOCKER_CONFIG="/root/.docker"
                LOCAL_REPOSITORY = "${LOCAL_REGISTRY}/molgenis/molgenis-app-lifelines-webshop"
            }
            steps {
                container (name: 'kaniko', shell: '/busybox/sh') {
                    sh "#!/busybox/sh\nmkdir -p ${DOCKER_CONFIG}"
                    sh "#!/busybox/sh\necho '{\"auths\": {\"registry.molgenis.org\": {\"auth\": \"${NEXUS_AUTH}\"}}}' > ${DOCKER_CONFIG}/config.json"
                    sh "#!/busybox/sh\n. ${WORKSPACE}/copy_dist_dir.sh"
                    sh "#!/busybox/sh\n/kaniko/executor --context ${WORKSPACE}/docker --destination ${LOCAL_REPOSITORY}:${TAG}"
                }
            }
        }
        // TODO: deploy!
        // stage('Deploy preview [ PR ]') {
        //     when {
        //         changeRequest()
        //     }
        //     environment {
        //         TAG = "PR-${CHANGE_ID}-${BUILD_NUMBER}"
        //         NAME = "preview-frontend-${TAG.toLowerCase()}"
        //     }
        //     steps {
        //         container('vault') {
        //             sh "mkdir /home/jenkins/.rancher"
        //             sh 'vault read -field=value secret/ops/jenkins/rancher/cli2.json > /home/jenkins/.rancher/cli2.json'
        //         }
        //         container('rancher') {
        //             sh "rancher context switch dev-molgenis"
        //             sh "rancher apps install " +
        //                 "molgenis-frontend " +
        //                 "${NAME} " +
        //                 "--no-prompt " +
        //                 "--set molgenis-proxy.environment=dev " +
        //                 "--set image.tag=${TAG} " +
        //                 "--set image.repository=${LOCAL_REGISTRY} " +
        //                 "--set molgenis-proxy.url=http://master-molgenis.molgenis-abcde.svc:8080 " +
        //                 "--set image.pullPolicy=Always"
        //         }
        //     }
        //     post {
        //         success {
        //             hubotSend(message: "PR Preview available on https://${NAME}.dev.molgenis.org", status:'INFO', site: 'slack-pr-app-team')
        //             container('node') {
        //                 sh "set +x; curl -X POST -H 'Content-Type: application/json' -H 'Authorization: token ${GITHUB_TOKEN}' " +
        //                     "--data '{\"body\":\":star: PR Preview available on https://${NAME}.dev.molgenis.org\"}' " +
        //                     "https://api.github.com/repos/molgenis/molgenis-app-lifelines-webshop/issues/${CHANGE_ID}/comments"
        //             }
        //         }
        //     }
        // }
        stage('Install, test and build: [ master ]') {
            when {
                branch 'master'
            }
            steps {
                milestone 1
                container('node') {
                    sh "yarn install"
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
        stage('Release: [ master ]') {
            when {
                branch 'master'
            }
            environment {
                REPOSITORY = 'molgenis/molgenis-app-lifelines-webshop'
            }
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    script {
                        env.RELEASE_SCOPE = input(
                                message: 'Do you want to release?',
                                ok: 'Release',
                                parameters: [
                                        choice(choices: 'patch\nminor\nmajor', description: '', name: 'RELEASE_SCOPE')
                                ]
                        )
                    }
                }
                milestone 2
                container('node') {
                    sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/${REPOSITORY}.git"

                    sh "git checkout -f ${BRANCH_NAME}"

                    sh "npm config set unsafe-perm true"
                    sh "npm version ${RELEASE_SCOPE} -m '[ci skip] [npm-version] %s'"

                    sh "git push --tags origin ${BRANCH_NAME}"

                    sh "echo //${env.NPM_REGISTRY}/:_authToken=${NPM_TOKEN} > ~/.npmrc"

                    sh "npm publish"
                    hubotSend(message: "${env.REPOSITORY} has been successfully deployed on ${env.NPM_REGISTRY}.", status: 'SUCCESS')
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
