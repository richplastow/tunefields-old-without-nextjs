# Tunefields

> A 3D creative music game

- 20240520
- Rich Plastow
- <https://github.com/richplastow/tunefields>
- <https://richplastow.com/tunefields/>

## Tunefields architecture

__Tunefields consists of an Express back-end app, and three React front-end apps:__

__'server'__ is the Express back-end app. It's used for storing user accounts,
sending emails for sign-up or password reset, storing created Tunes, and
logging app usage.

__'admin'__ lets system administrators monitor the server and app usage, and
manage user accounts.

__'maker'__ takes the user on a creative journey, where they gather 'Prunables'
from a 3D world, assemble Prunables into 'Loops', and combine Loops into 'Tunes'.

__'viewer'__ is small app, essentially a cut-down version of 'maker', which lets
anonymous users play and discover published Tunes.

## Handy dev commands

Serve the 'admin', 'maker' or 'viewer' apps locally, during development:

```bash
npx nx serve admin
npx nx serve maker
npx nx serve viewer
```

Run linting, unit tests, and end-to-end tests:

```bash
npx nx run-many -t lint
npx nx run-many -t test
npx nx e2e admin-e2e
npx nx e2e maker-e2e
npx nx e2e viewer-e2e
```

Build the apps, and serve them using [`static-server`](
https://www.npmjs.com/package/static-server). This provides a more accurate
simulation of how GitHub Pages will serve the apps, than using Nx's standard
`npx nx serve-static maker` command.

```bash
npx nx run-many -t build
static-server -n docs/404.html docs/
```

Deploy __*(you MUST build the app locally before deployment)*__:

```bash
git add .
git status
git commit -am 'Adds some cool feature'
git push
```
