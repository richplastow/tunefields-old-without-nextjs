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
