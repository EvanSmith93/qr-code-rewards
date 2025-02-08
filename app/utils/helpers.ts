export const validateUrl = (_: any, value: string) => {
  const urlRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/.*)?$/;

  if (!urlRegex.test(value)) {
    return Promise.reject("Enter a valid URL");
  }

  return Promise.resolve();
};
