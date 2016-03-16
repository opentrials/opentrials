FROM node:5.8
MAINTAINER Open Knowledge International

ENV HOME /app
WORKDIR $HOME

# FIXME: Copying the package.json before is a workaround for
# https://github.com/npm/npm/issues/9863
ADD package.json $HOME
RUN npm install --production
COPY . $HOME

ENV HOST 0.0.0.0
ENV PORT 80

EXPOSE $PORT
CMD ["npm", "start"]
