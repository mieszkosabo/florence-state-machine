module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-florence-state-machine`
  extends: ["florence-state-machine"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
