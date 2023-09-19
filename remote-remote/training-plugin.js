const id = "training";

const rules = {
  oas3: {
    "consistent-examples-for-responses": () => {
      let responses;
      return {
        Operation: {
          enter(operation) {
            responses = operation.responses;
          },

          RequestBody: {
            MediaType: {
              leave: (mediaType, { report, location }) => {
                if (!mediaType.examples) {
                  report({
                    message: `Request body must have examples`,
                    location: location.key(),
                  });
                  return;
                }
                for (const code in responses) {
                  if (!mediaType.examples[code]) {
                    report({
                      message: `Request examples do not contain the ${code} response example.`,
                      location: location.child('examples'),
                    });
                  }
                }
              },
            },
          },

          Parameter: {
            leave(parameter, { report, location }) {
              if (!parameter.examples) {
                report({
                  message: `Parameter must have examples`,
                  location: location.key(),
                });
                return;
              }
              for (const code in responses) {
                if (!parameter.examples[code]) {
                  report({
                    message: `Parameter examples do not contain the ${code} response example.`,
                    location: location.child('examples'),
                  });
                }
              }
            },
          },
        },
      };
    },
  },
};

const configs = {
  custom: {
    rules: {
      "training/consistent-examples-for-responses": "error",
    },
  },
};

module.exports = {
  configs,
  id,
  rules,
};
