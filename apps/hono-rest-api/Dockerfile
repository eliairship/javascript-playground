# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY . /app
# WORKDIR /app

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run build

# FROM base
# COPY --from=prod-deps /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 8000
# CMD [ "pnpm", "start" ]

FROM node:18

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY . .

# RUN npm install -g nodemon

ENV NODE_ENV production

ENTRYPOINT ["sh", "-c"]

RUN npm install
# RUN npm ci

RUN npm run build

EXPOSE 4000 

CMD ["npm run start"]