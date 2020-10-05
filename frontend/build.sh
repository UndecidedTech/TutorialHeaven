#/bin/bash
npm install -g @vue/cli
npm install -g @vue/cli-plugin-eslint
npm install -D --no-shrinkwrap # installs only dev dependencies
npm install            # installs prod dependencies
npm run build          # builds the Vue.js app
