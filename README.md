# PTracker

## Organization
- Express server in the `backend` folder
  - Runs on port `9000`

- React app in the `frontend` folder
  - Runs on port `3000`

## Developing

- You need MySQL installed and running on your machine
  -  https://dev.mysql.com/downloads/installer/ (download the second option/the file thats bigger)
  -  create a .env file in the "prisma" folder and add your password after "root"
  -  ![Screenshot 2022-01-29 211150](https://user-images.githubusercontent.com/77702776/151687551-8560152e-aedc-4d8e-a3dc-5c9becf17037.png)
    -  By default it assumes that the user `root` has no password.
  - You should then seed the database with `npx primsa migrate reset` (from the `backend` folder)
  - If you get this error,
  - ![Screenshot 2022-01-29 205601](https://user-images.githubusercontent.com/77702776/151687597-c5bf1803-fbcc-4e61-805c-b656d8feb375.png)
    - Run the command "npm i -g nodemon"  

- Backend runs on port `9000`
  - Start with `npm run start` in a terminal window

- Frontend runs on port `3000`
  - Start with `npm run start` in a separate terminal window (they must be running at the same time)

- Navigate to `http://localhost:3000`
