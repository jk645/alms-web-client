// Goal with QA environment is to be as close to production configuration as possible,
// but using different data.  Only differnce from production configuration should be
// to use a different API instance so it can use a different database.
export const environment = {
  production: true,
  apiUrl: 'https://api.stuffsort.com/api',
};
