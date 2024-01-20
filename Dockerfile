# ------------------------------------------------------------------------------
# Multi-Stage Node Build.
# This Dockerfile is meant for production builds, but can also be used for dev
# ------------------------------------------------------------------------------

# Final Directory Structure:
# /
#   |_app/
#     |_node_modules/        <-- All node_modules
#     |_src/                 <-- Empty folder to bind the source files into
#     |_package.json
#     |_package-lock.json
#   |_prodapp
#     |_node_modules/        <-- Only the production node_modules
#     |_src/                 <-- Production ready application.
#       |_resources/
#       |_/views
#       |_server.js

# ------------------------------------------------------------------------------
# pin images for reproducability
# ------------------------------------------------------------------------------

FROM node@sha256:0ae1a6a3a8a61e2bcf7f826b2562eb865f9a3095acf41bc6f184773ab66f3007 AS base
WORKDIR /app

# ------------------------------------------------------------------------------
# Setup prod dependencies first.
# ------------------------------------------------------------------------------

FROM base AS prod_dependencies
COPY package*.json ./
RUN npm install --production --silent

# ------------------------------------------------------------------------------
# Install remaining dev dependencies.
# ------------------------------------------------------------------------------

FROM prod_dependencies AS dev_dependencies
RUN npm install

# ------------------------------------------------------------------------------
# Setup dev target.
# ------------------------------------------------------------------------------

FROM dev_dependencies AS devapp
RUN mkdir /app/src
USER node
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ------------------------------------------------------------------------------
# Setup production target (/prodapp)
# ------------------------------------------------------------------------------

FROM node:14-alpine AS prodapp

# Create prodapp directory
WORKDIR /prodapp
COPY --from=prod_dependencies /app ./
COPY src /prodapp/src

# ------------------------------------------------------------------------------
# Run node as non-root user for production.
# run as non-root user
# ------------------------------------------------------------------------------

USER node
WORKDIR /prodapp
EXPOSE 3000
ENV \
  NODE_ENV='production'

CMD ["npm", "start"]
