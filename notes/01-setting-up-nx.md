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

...see below for how the app looked after this step.

Based on the [nx.dev 'Building React Apps in an Nx Monorepo' tutorial:](
https://nx.dev/getting-started/tutorials/react-monorepo-tutorial)

## Create a new React monorepo

```bash
npx create-nx-workspace@latest tunefields --preset=react-monorepo
# Need to install the following packages:
# create-nx-workspace@19.0.4
# Ok to proceed? (y)
y
#  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]
# ? Application name ›
TuneFields
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
tailwind
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
to my Mac, 257,218,683 bytes (343 MB on disk) for 29,799 items.

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
npx nx serve TuneFields
# > nx run TuneFields:serve
# > vite serve
#   VITE v5.0.13  ready in 564 ms
#     ➜  Local:   http://localhost:4200/
#   ➜  press h + enter to show help
```

Visit <http://localhost:4200/> which should show 'Welcome TuneFields 👋'.

`[ctrl-c]` to stop the server.

## List Nx's 'inferred tasks'

```bash
npx nx show project TuneFields --web
#  NX   Project graph started at http://127.0.0.1:4211/project-details/TuneFields
```

A page should open showing:

```
TuneFields
Root: apps/TuneFields
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
> as {workspaceRoot}/dist/apps/TuneFields. This value is being read from the
> build.outDir defined in your vite.config.ts file. Let's change that value in
> your vite.config.ts file:
> 
> ```ts
> // apps/TuneFields/vite.config.ts
> export default defineConfig({
>   // ...
>   build: {
>     outDir: '../../docs/play',
>     // ...
>   },
> });
> ```
> 
> Now if you look at the project details view, the outputs for the build target
> will say {workspaceRoot}/docs. This feature ensures that Nx will always cache
> the correct files.
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

## Add the 'Viewer' application

This will be a small standalone tune viewer, which can be easily shared by users.

```bash
npx nx g @nx/react:app viewer --directory=apps/viewer # can also add --dry-run
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
#     Name: viewer
#     Root: apps/viewer
#   Derived:
#     Name: viewer-viewer
#     Root: apps/viewer/viewer
As provided
# CREATE apps/viewer/index.html
# CREATE apps/viewer/public/favicon.ico
# CREATE apps/viewer/src/app/app.spec.tsx
# CREATE apps/viewer/src/assets/.gitkeep
# CREATE apps/viewer/src/main.tsx
# CREATE apps/viewer/tsconfig.app.json
# CREATE apps/viewer/src/app/nx-welcome.tsx
# CREATE apps/viewer/src/app/app.tsx
# CREATE apps/viewer/src/styles.css
# CREATE apps/viewer/tsconfig.json
# CREATE apps/viewer/project.json
# CREATE apps/viewer/postcss.config.js
# CREATE apps/viewer/tailwind.config.js
# CREATE apps/viewer/tsconfig.spec.json
# CREATE apps/viewer/vite.config.ts
# CREATE apps/viewer/.eslintrc.json
# CREATE apps/viewer-e2e/project.json
# CREATE apps/viewer-e2e/src/e2e/app.cy.ts
# CREATE apps/viewer-e2e/src/support/app.po.ts
# CREATE apps/viewer-e2e/src/support/e2e.ts
# CREATE apps/viewer-e2e/src/fixtures/example.json
# CREATE apps/viewer-e2e/src/support/commands.ts
# CREATE apps/viewer-e2e/cypress.config.ts
# CREATE apps/viewer-e2e/tsconfig.json
# CREATE apps/viewer-e2e/.eslintrc.json
# UPDATE package.json
# added 3 packages, and audited 998 packages in 4s
# 232 packages are looking for funding
#   run `npm fund` for details
# 1 moderate severity vulnerability
# To address all issues, run:
#   npm audit fix --force
# Run `npm audit` for details.
#  NX   👀 View Details of viewer
# Run "nx show project viewer --web" to view details about this project.
```

You should see that apps/viewer/ and apps/viewer-e2e/ have been created.

As before, change the output directory for the production build:

```ts
// apps/Viewer/vite.config.ts
export default defineConfig({
  // ...
  build: {
    outDir: '../../docs/view',
    // ...
  },
});
```

And take a look at the Viewer app:

```bash
npx nx serve viewer
# > nx run viewer:serve
# > vite serve
#   VITE v5.0.13  ready in 501 ms
#     ➜  Local:   http://localhost:4200/
#   ➜  press h + enter to show help
```

Visit <http://localhost:4200/> which should show 'Welcome viewer 👋'.

`[ctrl-c]` to stop the server.

## Create a local library

A library contains a collection of React components.

The viewer app will be a cut-down version of the full TuneFields app, so many
components will be shared between them. These should live in a new libs/ folder.

```bash
npx nx g @nx/react:library shared-ui --directory=libs/shared/ui --unitTestRunner=vitest --bundler=none
npx nx g @nx/react:library footer --directory=libs/footer --unitTestRunner=vitest --bundler=none
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
# CREATE libs/shared/ui/vite.config.ts
# CREATE libs/shared/ui/tsconfig.spec.json
# CREATE libs/shared/ui/src/lib/shared-ui.spec.tsx
# CREATE libs/shared/ui/src/lib/shared-ui.tsx
# UPDATE package.json
# UPDATE tsconfig.base.json
# up to date, audited 998 packages in 4s
# 232 packages are looking for funding
#   run `npm fund` for details
# 1 moderate severity vulnerability
# To address all issues, run:
#   npm audit fix --force
# Run `npm audit` for details.
#  NX   👀 View Details of shared-ui
# Run "nx show project shared-ui --web" to view details about this project.
```

You should see that libs/shared/ui/ (but no no libs/shared/ui-e2e/) has been
created.

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
import styled from 'tailwind';

/* eslint-disable-next-line */
export interface UiFooterProps {}

const StyledUiFooter = styled.div`
  color: pink;
`;

export function UiFooter(props: UiFooterProps) {
  return (
    <StyledUiFooter>
      <h1>Welcome to UiFooter!</h1>
    </StyledUiFooter>
  );
}

export default UiFooter;
```

## Import the 'FooterUi' library into both apps

In apps/TuneFields/src/app/app.tsx and apps/viewer/src/app/app.tsx:

```tsx
import { UiFooter } from '@tunefields/shared-ui';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <NxWelcome title="TuneFields" />
      <UiFooter />
    </div>
  );
}

export default App;
```

`npx nx serve TuneFields` and `npx nx serve viewer` should both show the new
UiFooter component at the bottom of the page.