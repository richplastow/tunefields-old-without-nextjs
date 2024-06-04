# Tunefields (OLD version, before using NextJS)

__DEPRECATED: Tunefields development continues at <https://github.com/richplastow/tunefields>__

> A 3D creative music game

- Created 20240520
- Rich Plastow
- <https://github.com/richplastow/tunefields-old-without-nextjs>
- <https://richplastow.com/tunefields-old-without-nextjs/>

## Tunefields architecture

__Tunefields consists of three React front-end apps:__

__'admin'__ lets system administrators monitor the server and app usage, and
manage user accounts.

__'maker'__ takes the user on a creative journey, where they gather 'Prunables'
from a 3D world, assemble Prunables into 'Loops', and combine Loops into 'Tunes'.

__'viewer'__ is small app, essentially a cut-down version of 'maker', which lets
anonymous users play and discover published Tunes.

All three Tunefields apps make use of a [generic-user-server](
https://github.com/richplastow/generic-user-server) instance running on AWS to
handle auth, store user accounts, send emails for sign-up or password reset,
store created Tunes, and store app usage statistics.

## Handy dev commands

Serve the 'admin', 'maker' or 'viewer' apps locally, during development:

```bash
npx nx serve admin # TODO
npx nx serve maker # http://localhost:4200/make/
npx nx serve viewer # http://localhost:4200/
```

Run linting, unit tests, and end-to-end tests:

```bash
npx nx run-many -t lint
npx nx run-many -t test
npx nx e2e admin-e2e # TODO
npx nx e2e maker-e2e
npx nx e2e viewer-e2e
```

Build the apps, and serve them using [`static-server`](
https://www.npmjs.com/package/static-server). This provides a more accurate
simulation of how GitHub Pages will serve the apps, than using Nx's standard
(and [currently broken](
./notes/03-not-found-and-deep-links.md#fix-the-nx-commands-we-just-broke))
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
