export const CONFIG = {
  noAuthInterceptorEndpoints: [
    {
      url: 'auth',
      method: 'POST'
    },
    {
      url: 'auth',
      method: 'GET'
    },
  ],
  httpRequestRetries: 5,
  httpRequestRetryWaitMs: 3000,
  httpRequestRetryOnCodes: [
    0,  // When network offline, Angular's HttpClient uses 0 as the status code
    401  // If auth token is invalid, backend should return 401 Unauthorized error
  ],
  gridBreakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
};
