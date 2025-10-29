export default {
  '**/*.{ts,tsx,js,jsx}': ['npm run lint'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
