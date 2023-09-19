export const basicResponse = (statusCode, data, headers = {}) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    ...headers,
  },
  ...(data
    ? {
        body: JSON.stringify(data),
      }
    : undefined),
});

export const successfullResponse = (data: any, headers?) => {
  return basicResponse(200, { ...data }, headers);
};
