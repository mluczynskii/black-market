FROM node:20.10.0
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
RUN ./node_modules/.bin/sass ./static/style.scss ./static/style.css
EXPOSE 3000
CMD [ "node", "main.js" ]