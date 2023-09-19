const { bundle, loadConfig } = require("@redocly/openapi-core");
const { resolve } = require("path");
const fs = require('fs'); 


// TODO this is hardcoded way, should go from some parameter
const path = resolve(process.cwd(), "./openapi/openapi.yaml");

const createTestConfig = async () => {
  const config = await loadConfig();

  const result = await bundle({
    ref: path,
    dereference: true,
    removeUnusedComponents: true,
    config:config
  });
  const {
    bundle: {
      parsed: { paths },
    },
  } = result;

  return testConfigParse(paths);
};

const iterateResponseCode = (responses, code) => {
  for (const mimeType in responses[`${code}`]["content"]) {
    return {
      responseCode: code,
      responseMimeType: mimeType,
      responseSchema: responses[`${code}`]["content"][`${mimeType}`]["schema"],
    };
  }
};

const iteratePathParameters = (parameters, code) => {
  if (!parameters) return null;
  const queryParams = {};
  const pathParams = {};
  const headerParam = {};

  for (parameter of parameters) {
    if (parameter.in === "query" && (parameter.example || parameter.examples)) {
      queryParams[parameter.name] = parameter?.examples?.[code]?.value;
    } else if (parameter.in === "path" && (parameter.example || parameter.examples)) {
      pathParams[parameter.name] = parameter?.examples?.[code]?.value;
    } else if (parameter.in === "header" && (parameter.example || parameter.examples)) { 
     headerParam[parameter.name] = parameter?.examples?.[code]?.value;
    }
  }
  return {
    queryParams,
    pathParams,
    headerParam,
  };
};

const iterateRequestBody = (requestBody, code) => {
  if (!requestBody) {
    return null;
  } else {
    for (const mimeType in requestBody.content) {
      return {
        mimeType: mimeType,
        // TODO examples or example can be passed
        exampleBody:
          requestBody.content[`${mimeType}`]["examples"][code]?.value
      };
    }
  }
};


// TODO very ugly
const sortByMethods = (array) => {
  const filteredPost = array.filter(
    (item) => item.method.toLowerCase() === "post"
  );
  const filteredGet = array.filter(
    (item) => item.method.toLowerCase() === "get"
  );
  const filteredPath = array.filter(
    (item) => item.method.toLowerCase() === "patch"
  );
  const filteredDelete = array.filter(
    (item) => item.method.toLowerCase() === "delete"
  );

  return [
    ...filteredPost,
    ...filteredGet,
    ...filteredPath,
    ...filteredDelete,
  ].sort((a, b) => a.path.localeCompare(b.path))
}

// TODO if there no ANY examples provided filter this ARRAY and show as not covered test
const testConfigParse = (paths) => {
  const arrayToCheck = [];
  // TODO this is mess, need to revisit it
  for (const path in paths) {
    const pathKey = path;
    for (const method in paths[`${pathKey}`]) {
      for (const code in paths[`${pathKey}`][`${method}`].responses) {
        const objectToPush = {
          path: pathKey,
          method: method,
          responseCode: code,
          ...iteratePathParameters(
            paths[`${pathKey}`][`${method}`].parameters,
            code
          ),
          ...iterateRequestBody(
            paths[`${pathKey}`][`${method}`]["requestBody"],
            code
          ),
          ...iterateResponseCode(
            paths[`${pathKey}`][`${method}`].responses,
            code
          ),
        };
        arrayToCheck.push(objectToPush);
      }
    }
  }

  return sortByMethods(arrayToCheck).filter(({responseSchema}) => responseSchema );
};

const generateConfigFile = async () => {
  const data = await createTestConfig();
  fs.writeFileSync('test-config.json', JSON.stringify(data,null,2), 'utf-8');
};

generateConfigFile();
