FROM          node:8 as builder

ENV           NODE_ENV=testing
ENV           BUILD_FOLDER=/usr/src/app

WORKDIR       ${BUILD_FOLDER}

COPY          package*.json ${BUILD_FOLDER}/
COPY          lib ${BUILD_FOLDER}/lib
RUN           npm install

COPY          . ${BUILD_FOLDER}/
RUN           mkdir -p /tmp/storage && npm run test

RUN           npm prune --production && \
              rm -rf ${BUILD_FOLDER}/tests

#

FROM          node:8

ENV           NODE_ENV=production
ENV           APP_PATH=/usr/src/app

WORKDIR       ${APP_PATH}

COPY          --from=builder /usr/src/app/docker-entrypoint.sh /entrypoint.sh
COPY          --from=builder /usr/src/app ${APP_PATH}

EXPOSE        3000

ENTRYPOINT    ["/entrypoint.sh"]
CMD           ["start"]
