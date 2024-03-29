FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm deploy --filter=hono-rest-api --prod /prod/hono-rest-api


FROM base AS hono-rest-api
COPY --from=build /prod/hono-rest-api /prod/hono-rest-api
WORKDIR /prod/hono-rest-api
EXPOSE 4000
CMD [ "pnpm", "start" ]

