# Step 1: Setting up Nx

[^ Notes](./00-notes.md)

Nx is a JavaScript-friendly monorepo system, with generators for React.

Prior to this step, the app looked like this:

```
docs/index.html
notes/00-notes.md
notes/01-setting-up-nx.md
.gitignore
LICENSE
README.md
```

Based on the [nx.dev 'Building React Apps in an Nx Monorepo' tutorial:](
https://nx.dev/getting-started/tutorials/react-monorepo-tutorial)

## Create a new React monorepo

The 'Application name' will be 'viewer', because `create-nx-workspace` generates
a simple no-router app. Later, we will use `npx nx g @nx/react:app maker` to
create the more complex main app, which that generator will add routing to.

'viewer' will be a small standalone tune-playback app, which can be easily
shared by users.

Also note that I had issues with Tailwind CSS, so used `styled-jsx` instead.

```bash
npx create-nx-workspace@latest tunefields --preset=react-monorepo
# Need to install the following packages:
# create-nx-workspace@19.0.4
# Ok to proceed? (y)
y
#  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]
# ? Application name ›
viewer
# ? Which bundler would you like to use? …
# Vite    [ https://vitejs.dev/     ]
# Webpack [ https://webpack.js.org/ ]
# Rspack  [ https://www.rspack.dev/ ]
Vite
# ? Test runner to use for end to end (E2E) tests …
# Playwright [ https://playwright.dev/ ]
# Cypress [ https://www.cypress.io/ ]
# None
Cypress
# ? Default stylesheet format …
# CSS
# SASS(.scss)       [ https://sass-lang.com   ]
# LESS              [ https://lesscss.org     ]
# tailwind          [ https://tailwindcss.com     ]
# styled-components [ https://styled-components.com            ]
# emotion           [ https://emotion.sh                       ]
# styled-jsx        [ https://www.npmjs.com/package/styled-jsx ]
styled-jsx
# ? Set up CI with caching, distribution and test deflaking …
# (it's free and can be disabled any time)
# Yes, for GitHub Actions with Nx Cloud
# Yes, for CircleCI with Nx Cloud
# Skip for now
Skip for now
# ? Would you like remote caching to make your build faster? …
# (it's free and can be disabled any time)
# Yes
# Skip for now
Skip for now
#  NX   Creating your v19.0.4 workspace.
# ✔ Installing dependencies with npm
# ✔ Successfully created the workspace: tunefields.
#  NX   Directory is already under version control. Skipping initialization of git.
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Nx CLI is not installed globally.
# This means that you will have to use "npx nx" to execute commands in the workspace.
# Run "npm i -g nx" to be able to execute command directly.
# ——————————————————————————————————————————————————————————————————————————————
#  NX   First time using Nx? Check out this interactive Nx tutorial.
# https://nx.dev/react-tutorial/1-code-generation
```

You should see a new 'tunefields' subdirectory, with a bunch of files. According
to my Mac, 250,955,744 bytes (333.5 MB on disk) for 28,995 items.

## Move the generated files to the top level

```bash
mv tunefields/README.md notes/02-nx-default-readme.md
mv tunefields/* . # move visible...
mv tunefields/.[!.]* . # ...and invisible items
rmdir tunefields
```

Note that the top-level .gitignore has now been modified, but LICENSE, README.md
and the docs/ and notes/ folders remain unchanged.

## Serve a development build of the app

```bash
npx nx serve viewer
# > nx run viewer:serve
# > vite serve
#   VITE v5.0.13  ready in 564 ms
#     ➜  Local:   http://localhost:4200/
#   ➜  press h + enter to show help
```

Visit <http://localhost:4200/> which should show 'Welcome viewer 👋'.

In your browser's 'Network' developer tab, you should see about a dozen requests,
all successful. Later, the build will show just 3 requests.

`[ctrl-c]` to stop the server.

## List Nx's 'inferred tasks'

```bash
npx nx show project viewer --web
#  NX   Project graph started at http://127.0.0.1:4211/project-details/viewer
```

A page should open showing:

```
viewer
Root: apps/viewer
Type: Application

Targets

build         vite build           Cacheable
lint          eslint .             Cacheable
preview       vite preview
serve         vite serve
serve-static  @nx/web:file-server
test          vitest               Cacheable
```

The six inferred tasks are expandable - click the down-arrows to view details
about each one.

As suggested by the Nx docs:

> If you expand the build task, you can see that it was created by the @nx/vite
> plugin by analyzing your vite.config.ts file. Notice the outputs are defined
> as {workspaceRoot}/dist/apps/viewer. This value is being read from the
> build.outDir defined in your vite.config.ts file. Let's change that value in
> your vite.config.ts file:
> 
> ```ts
> // apps/viewer/vite.config.ts
> export default defineConfig({
>   // ...
>   build: {
>     outDir: '../../docs/view',
>     // ...
>   },
> });
> ```
> 
> Now if you look at the project details view, the outputs for the build target
> will say {workspaceRoot}/docs/view. This feature ensures that Nx will always
> cache the correct files.
> 
> You can also override the settings for inferred tasks by modifying the
> targetDefaults in nx.json or setting a value in your project.json file. Nx
> will merge the values from the inferred tasks with the values you define in
> targetDefaults and in your specific project's configuration.

`[ctrl-c]` to stop `npx nx show project`.

## See what capabilities the @nx/react plugin provides

```bash
npx nx list @nx/react
#  NX   Capabilities in @nx/react:
# 
# GENERATORS
# 
# init : Initialize the `@nrwl/react` plugin.
# application : Create a React application.
# library : Create a React library.
# component : Create a React component.
# redux : Create a Redux slice for a project.
# storybook-configuration : Set up storybook for a React app or library.
# component-story : Generate storybook story for a React component
# stories : Create stories/specs for all components declared in an app or library.
# component-cypress-spec : Create a Cypress spec for a UI component that has a story.
# hook : Create a hook.
# host : Generate a host react application
# remote : Generate a remote react application
# cypress-component-configuration : Setup Cypress component testing for a React project
# component-test : Generate a Cypress component test for a React component
# setup-tailwind : Set up Tailwind configuration for a project.
# setup-ssr : Set up SSR configuration for a project.
# federate-module : Federate a module.
# 
# EXECUTORS/BUILDERS
# 
# module-federation-dev-server : Serve a host or remote application.
# module-federation-ssr-dev-server : Serve a host application along with it's known remotes.
```

## Add the 'maker' application

This will be the main creative app.

```bash
npx nx g @nx/react:app maker --directory=apps/maker # can also add --dry-run
#  NX  Generating @nx/react:application
# ? Would you like to add React Router to this application? (y/N) › true
y
# ? Which E2E test runner would you like to use? …
# playwright
# cypress
# none
cypress
# ? What should be the project name and where should it be generated? …
# ❯ As provided:
#     Name: maker
#     Root: apps/maker
#   Derived:
#     Name: maker-maker
#     Root: apps/maker/maker
As provided
# CREATE apps/maker/index.html
# CREATE apps/maker/public/favicon.ico
# CREATE apps/maker/src/app/app.spec.tsx
# CREATE apps/maker/src/assets/.gitkeep
# CREATE apps/maker/src/main.tsx
# CREATE apps/maker/tsconfig.app.json
# CREATE apps/maker/src/app/nx-welcome.tsx
# CREATE apps/maker/src/app/app.tsx
# CREATE apps/maker/tsconfig.json
# CREATE apps/maker/project.json
# CREATE apps/maker/tsconfig.spec.json
# CREATE apps/maker/vite.config.ts
# CREATE apps/maker/.eslintrc.json
# CREATE apps/maker-e2e/project.json
# CREATE apps/maker-e2e/src/e2e/app.cy.ts
# CREATE apps/maker-e2e/src/support/app.po.ts
# CREATE apps/maker-e2e/src/support/e2e.ts
# CREATE apps/maker-e2e/src/fixtures/example.json
# CREATE apps/maker-e2e/src/support/commands.ts
# CREATE apps/maker-e2e/cypress.config.ts
# CREATE apps/maker-e2e/tsconfig.json
# CREATE apps/maker-e2e/.eslintrc.json
# UPDATE package.json
# added 3 packages, and audited 966 packages in 4s
# 223 packages are looking for funding
#   run `npm fund` for details
# found 0 vulnerabilities
#  NX   👀 View Details of maker
# Run "nx show project maker --web" to view details about this project.
```

You should see that apps/maker/ and apps/maker-e2e/ have been created.

> When using Tailwind instead of styled-jsx, the above NPM report includes:
>
> `1 moderate severity vulnerability`

As before, change the output directory for the production build:

```ts
// apps/maker/vite.config.ts
export default defineConfig({
  // ...
  build: {
    outDir: '../../docs/make',
    // ...
  },
});
```

And take a look at the maker app:

```bash
npx nx serve maker
# > nx run maker:serve
# > vite serve
#   VITE v5.0.13  ready in 501 ms
#     ➜  Local:   http://localhost:4200/
#   ➜  press h + enter to show help
```

Visit <http://localhost:4200/> which should show 'Welcome maker 👋'.

`[ctrl-c]` to stop the server.

## Create a local library

A library contains a collection of React components.

The viewer app will be a cut-down version of the full Tunefields app, so many
components will be shared between them. These should live in a new libs/ folder.

```bash
npx nx g @nx/react:library shared-ui --directory=libs/shared/ui --unitTestRunner=vitest --bundler=none
#  NX  Generating @nx/react:library
# ? What should be the project name and where should it be generated? …
# ❯ As provided:
#     Name: shared-ui
#     Root: libs/shared/ui
#   Derived:
#     Name: shared-ui-shared-ui
#     Root: libs/shared/ui/shared-ui
As provided
# CREATE libs/shared/ui/project.json
# CREATE libs/shared/ui/.eslintrc.json
# CREATE libs/shared/ui/README.md
# CREATE libs/shared/ui/src/index.ts
# CREATE libs/shared/ui/tsconfig.lib.json
# CREATE libs/shared/ui/.babelrc
# CREATE libs/shared/ui/tsconfig.json
# UPDATE nx.json
# CREATE libs/shared/ui/vite.config.ts
# CREATE libs/shared/ui/tsconfig.spec.json
# CREATE libs/shared/ui/src/lib/shared-ui.spec.tsx
# CREATE libs/shared/ui/src/lib/shared-ui.tsx
# UPDATE package.json
# UPDATE tsconfig.base.json
# up to date, audited 966 packages in 4s
# 223 packages are looking for funding
#   run `npm fund` for details
# found 0 vulnerabilities
#  NX   👀 View Details of shared-ui
# Run "nx show project shared-ui --web" to view details about this project.
```

You should see libs/shared/ui/ (but no libs/shared/ui-e2e/) has been created.

You should also see in tsconfig.base.json that the footer has been added:

```json
{
  "compilerOptions": {
    ...
    "paths": {
      "@tunefields/shared-ui": ["libs/shared/ui/src/index.ts"]
    },
    ...
  },
}
```

## Add a 'UiFooter' component to the shared-ui library

```bash
npx nx g @nx/react:component ui-footer --project=shared-ui --directory="libs/shared/ui/src/lib/ui-footer"
#  NX  Generating @nx/react:component
# Option "project" is deprecated: Provide the `directory` option instead and use the `as-provided` format. The project will be determined from the directory provided. It will be removed in Nx v20.
# ? Should this component be exported in the project? (y/N) › true
y
? Where should the component be generated? …
# ❯ As provided: libs/shared/ui/src/lib/ui-footer/ui-footer.tsx
#   Derived:     libs/shared/ui/src/libs/shared/ui/src/lib/ui-footer/ui-footer/ui-footer.tsx
As provided
# CREATE libs/shared/ui/src/lib/ui-footer/ui-footer.spec.tsx
# CREATE libs/shared/ui/src/lib/ui-footer/ui-footer.tsx
# UPDATE libs/shared/ui/src/index.ts
```

So now libs/shared/ui/src/index.ts contains:

`export * from './lib/ui-footer/ui-footer';`

And libs/shared/ui/src/lib/ui-footer/ui-footer.tsx contains:

```ts
/* eslint-disable-next-line */
export interface UiFooterProps {}

export function UiFooter(props: UiFooterProps) {
  return (
    <div>
      <style jsx>{`
        div {
          color: pink;
        }
      `}</style>
      <h1>Welcome to UiFooter!</h1>
    </div>
  );
}

export default UiFooter;
```

## Import the 'FooterUi' library into both apps

Add it to apps/viewer/src/app/app.tsx:

```tsx
import { UiFooter } from '@tunefields/shared-ui';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <style jsx>{`
        /** your style here **/
      `}</style>

      <NxWelcome title="viewer" />
      <UiFooter />
    </div>
  );
}

export default App;
```

And add it to apps/maker/src/app/app.tsx:

```tsx
import { UiFooter } from '@tunefields/shared-ui';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      <style jsx>{`
        /** your style here **/
      `}</style>

      <NxWelcome title="maker" />

      {/* START: routes */}
      ...
      {/* END: routes */}
      <UiFooter />
    </div>
  );
}

export default App;
```

`npx nx serve maker` and `npx nx serve viewer` should both show the new
UiFooter component "Welcome to UiFooter!" at the bottom of the page.

You should see that changing the text of `<h1>Welcome to UiFooter!</h1>` in
libs/shared/ui/src/lib/ui-footer/ui-footer.tsx immediately changes the app.

You'll also see that the `div { color: pink; }` is leaking into the whole page!
Here's a quick fix:

```jsx
    <div className="ui-footer">
      <style jsx>{`
        .ui-footer {
          color: green;
        }
      `}</style>
      <h1>UiFooter Here</h1>
    </div>
```

## Modify the apps for GitHub pages

Remove `<base href="/" />` from the index.html of both apps. For example,
apps/maker/index.html should become:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>maker</title>

    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Add `base: './',` to the vite.config.ts of both apps. For example,
apps/maker/vite.config.ts should become:

```ts
/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  base: './',
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/viewer',
  // ...
});
```

## View the project graph

```bash
npx nx graph
#  NX   Project graph started at http://127.0.0.1:4211/projects
```

A page should open. Click 'Show all projects' to see the relationship between
apps and libraries.

`[ctrl-c]` to stop `npx nx graph`.

## Lint, and run unit tests

Lint the apps and library in parallel.

```bash
npx nx run-many -t lint
#    ✔  nx run shared-ui:lint (7s)
#    ✔  nx run viewer:lint (7s)
#    ✔  nx run maker:lint (7s)
#    ✔  nx run maker-e2e:lint (3s)
#    ✔  nx run viewer-e2e:lint (3s)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target test for 5 projects (9s)
```

Run unit tests on the apps and library in parallel.

> Note that running the unit tests again immediately afterwards will be faster,
> because Nx uses its cache.

```bash
npx nx run-many -t test
#    ✔  nx run shared-ui:test (7s)
#    ✔  nx run viewer:test (7s)
#    ✔  nx run maker:test (7s)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target test for 3 projects (7s)
```

Run end-to-end tests on both apps. These need to be done one at a time.

```bash
npx nx e2e maker-e2e
# > nx run maker-e2e:e2e
# > cypress run
# It looks like this is your first time using Cypress: 13.9.0
✔  Verified Cypress! /Users/<USERNAME>/Library/Caches/Cypress/13.9.0/Cypress.app
Opening Cypress...
DevTools listening on ws://127.0.0.1:53647/devtools/browser/62ce1cd2-3882-4a8a-933a-e06d5f0bc358
> nx run maker:serve
> vite serve
The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
  VITE v5.0.13  ready in 844 ms
  ➜  Local:   http://localhost:4200/
====================================================================================================
  (Run Starting)
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        13.9.0                                                                         │
  │ Browser:        Electron 118 (headless)                                                        │
  │ Node Version:   v20.9.0 (/Users/<USERNAME>/.nvm/versions/node/v20.9.0/bin/node)                │
  │ Specs:          1 found (app.cy.ts)                                                            │
  │ Searched:       src/**/*.cy.{js,jsx,ts,tsx}                                                    │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
────────────────────────────────────────────────────────────────────────────────────────────────────
  Running:  app.cy.ts                                                                       (1 of 1)
  maker-e2e
    ✓ should display welcome message (1375ms)
  1 passing (2s)
  (Results)
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        1                                                                                │
  │ Passing:      1                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     1 second                                                                         │
  │ Spec Ran:     app.cy.ts                                                                        │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
====================================================================================================
  (Run Finished)
       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  app.cy.ts                                00:01        1        1        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:01        1        1        -        -        -  
————————————————————————————————————————————————————————————————————————————————————————————————————
 NX   Successfully ran target e2e for project maker-e2e (45s)
```

```bash
npx nx e2e viewer-e2e
> nx run viewer-e2e:e2e
> cypress run
DevTools listening on ws://127.0.0.1:54181/devtools/browser/4d1e8656-db64-468e-81e2-ec7f56263e2d
> nx run viewer:serve
> vite serve
The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
  VITE v5.0.13  ready in 460 ms
  ➜  Local:   http://localhost:4200/
====================================================================================================
  (Run Starting)
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        13.9.0                                                                         │
  │ Browser:        Electron 118 (headless)                                                        │
  │ Node Version:   v20.9.0 (/Users/<USERNAME>/.nvm/versions/node/v20.9.0/bin/node)                │
  │ Specs:          1 found (app.cy.ts)                                                            │
  │ Searched:       src/**/*.cy.{js,jsx,ts,tsx}                                                    │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  app.cy.ts                                                                       (1 of 1)
  viewer-e2e
    ✓ should display welcome message (1031ms)
  1 passing (1s)
  (Results)
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        1                                                                                │
  │ Passing:      1                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        false                                                                            │
  │ Duration:     1 second                                                                         │
  │ Spec Ran:     app.cy.ts                                                                        │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
====================================================================================================
  (Run Finished)
       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  app.cy.ts                                00:01        1        1        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:01        1        1        -        -        -  
————————————————————————————————————————————————————————————————————————————————————————————————————
 NX   Successfully ran target e2e for project viewer-e2e (11s)
```

## Build the apps for deployment

This will build both apps in parallel.

```bash
npx nx run-many -t build
#    ✔  nx run viewer:build (5s)
#    ✔  nx run maker:build (5s)
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target build for 2 projects
```

You should see the new docs/make/ and docs/view/ folders. And docs/index.html
has not been deleted or changed (it can become a menu or auto-redirect page).

You can check one of the builds using `npx nx serve-static`, although this is
not an accurate simulation of how GitHub Pages will serve the apps. Also, in the
[next step](./03-not-found-and-deep-links.md), the 'maker' app will need to be
served at '/make/', which will break `npx nx serve-static maker`.

```bash
npx nx serve-static maker
# > nx run maker:serve-static
# > nx run maker:build  [existing outputs match the cache, left as is]
# > vite build
# The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
# vite v5.0.13 building for production...
# transforming...
# ✓ 37 modules transformed.
# rendering chunks...
# computing gzip size...
# ../../docs/make/index.html                  0.40 kB │ gzip:  0.27 kB
# ../../docs/make/assets/index-DbSB_BSY.js  187.60 kB │ gzip: 58.88 kB
# ✓ built in 3.07s
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target build for project maker (172ms)
# Nx read the output from the cache instead of running the command for 1 out of 1 tasks.
# Starting up http-server, serving docs/make
# http-server version: 14.1.1
# http-server settings: 
# CORS: true
# Cache: -1 seconds
# Connection Timeout: 120 seconds
# Directory Listings: visible
# AutoIndex: visible
# Serve GZIP Files: false
# Serve Brotli Files: false
# Default File Extension: none
# Available on:
#   http://localhost:4200
# Unhandled requests will be served from: http://localhost:4200?. Options: {"secure":false,"prependPath":true}
# Hit CTRL-C to stop the server
# > nx run maker:build  [local cache]
# > vite build
# The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
# vite v5.0.13 building for production...
# transforming...
# ✓ 37 modules transformed.
# rendering chunks...
# computing gzip size...
# ../../docs/make/index.html                  0.40 kB │ gzip:  0.27 kB
# ../../docs/make/assets/index-DbSB_BSY.js  187.60 kB │ gzip: 58.88 kB
# ✓ built in 3.07s
# ——————————————————————————————————————————————————————————————————————————————
# ...
# ——————————————————————————————————————————————————————————————————————————————
#  NX   Successfully ran target build for project maker (139ms)
# Nx read the output from the cache instead of running the command for 1 out of 1 tasks.
```

Visit <http://localhost:4200/> which should show 'Welcome maker 👋'.

You can change "👋" to "!" in docs/make/assets/index-SOME_ID.js and refresh, to
reassure yourself that the browser is reading files from the docs/ folder.

Assuming you have the NPM package `static-server` installed globally:

```bash
static-server docs/
# * Static server successfully started.
# * Serving files at: http://localhost:9080
# * Press Ctrl+C to shutdown.
```

Visiting <http://localhost:9080/view/> should work as long as the
[Modify the apps for GitHub pages](#modify-the-apps-for-github-pages) change has
been done. Note that <http://localhost:9080/view> (without a trailing slash)
will not work.

Next, we will add support for ['Not Found' and deep links.](
./03-not-found-and-deep-links.md)