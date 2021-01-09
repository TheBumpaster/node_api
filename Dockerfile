FROM node:12-alpine

# Setup directories
USER node

RUN mkdir /home/node/.npm-global ; \
    mkdir -p /home/node/app ; \
    chown -R node:node /home/node/app ; \
    chown -R node:node /home/node/.npm-global

ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

WORKDIR /home/node/app

# Bundle APP files

COPY . /home/node/app

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL error
RUN npm install --quiet

ENV DOCKER=TRUE

USER $USER
# Build our source files
RUN npm run build

ARG NODE=production
ENV NODE_ENV ${NODE}
ARG PORT

# Make port from arguments available to the world outside this container
EXPOSE $PORT

CMD [ "npm", "run", "start" ]