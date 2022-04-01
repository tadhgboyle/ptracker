FROM node:latest

RUN useradd -m -d /app ptracker
COPY --chown=ptracker . /app

WORKDIR /app
USER ptracker

RUN npm install
RUN npm i nodemon

EXPOSE 3000
CMD ["/bin/bash", "start.sh"]
