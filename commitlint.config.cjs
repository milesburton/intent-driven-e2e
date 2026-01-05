module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Disable the commit header length limit
  rules: {
    'header-max-length': [0, 'always']
  }
};
