module.exports = {
  '*.{ts,tsx,js,cjs,css,html,md,json,yml,yaml}': ['prettier -w'],
  '*.{ts,tsx,js}': ['eslint --fix']
};
