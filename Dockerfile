FROM node:8
WORKDIR /code
RUN npm install
CMD ["npm", "run", "develop"]
