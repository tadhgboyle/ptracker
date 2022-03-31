FROM node:latest

RUN mkdir home/ptracker
COPY . home/ptracker

WORKDIR /home/ptracker

RUN npm install
RUN npm i -g nodemon

EXPOSE 3000
CMD [ "./wait-for-it.sh", "mysqldb:3306", "--", "npx","prisma","migrate","reset", "--force", "--", "npm", "run","dev"]
CMD [ "npm", "run","dev"]
