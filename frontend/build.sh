#/bin/bash
npm install -g @vue/cli
vue add cli-plugin-eslint
npm install -D --no-shrinkwrap # installs only dev dependencies
npm install            # installs prod dependencies
npm run build          # builds the Vue.js app
