module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{css,scss,less}': ['prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
