export default {
  '*.{ts,js}': ['prettier --write', 'eslint --fix'],
  '*.{html,css,scss}': ['prettier --write'],
};
