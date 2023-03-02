FROM node:16-alpine
RUN npm install -g eslint
WORK /battery-ui/src
COPY battery-ui/src /app
CMD ["npm", "start", "lint"]