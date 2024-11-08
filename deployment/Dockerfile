FROM node:hydrogen-alpine as build

WORKDIR /app

COPY ./.npmrc .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci --legacy-peer-deps


COPY . .

RUN npm run build


FROM node:hydrogen-alpine as app

WORKDIR /app
ENV NODE_ENV=production

COPY ./.npmrc .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=build /app/build ./build

ENTRYPOINT ["npm", "start"]
