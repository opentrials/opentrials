FROM node:6
MAINTAINER Open Knowledge International

WORKDIR /app

# FIXME: Copying the package.json before is a workaround for
# https://github.com/npm/npm/issues/9863
COPY package.json ./
RUN npm install --production
COPY . ./

ENV HOST 0.0.0.0
ENV PORT 80

EXPOSE $PORT
CMD ["npm", "start"]
