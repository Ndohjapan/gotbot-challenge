FROM node:lts-alpine as build
WORKDIR /app 
COPY package.json yarn.lock ./
RUN yarn install
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]