const { spec, request, handler } = require("pactum");
const {resolve} = require('path')

const fs = require('fs')

const getTestConfig = () => {
  const path = resolve(process.cwd(), 'test-config.json');
  if(fs.existsSync(path)) {
    const data = fs.readFileSync(path,'utf-8');
    return JSON.parse(data);

  } else {
    process.stderr.write('Test config not exist');
    process.exit(1);
  }
};


request.setBaseUrl("http://localhost:3003");

describe("validate all apis", () => {
  const data = getTestConfig();

  it("should load config ", async () => {
    expect(data).toBeTruthy();
  });

  for (const testItem of data) {
    const {
      path,
      method,
      responseCode,
      queryParams,
      pathParams,
      headerParam,
      responseSchema,
      mimeType,
      exampleBody,
    } = testItem;

     // THis should be uniq, better maybe use operationId in prospective.
    const testId = `${path}/${method}/${responseCode}`

    handler.addSpecHandler(testId, (ctx) => {
      const { spec } = ctx;
      spec.withPath(path);
      spec.withMethod(method);
      spec.withPathParams(pathParams);
      queryParams &&
        Object.keys(queryParams).length > 0 &&
        spec.withQueryParams(queryParams);
      spec.withHeaders({
        ...headerParam,
        ...(mimeType && { "content-type": mimeType }),
      });
      spec.withBody(exampleBody);
    });

    // BE very careful with this JSON schema - this is not something obvious

    test(`apiPath: ${path}, method: ${method}, code: ${responseCode}`, async () => {
      await spec(testId)
        .expectStatus(parseInt(responseCode))
        .expectJsonSchema(responseSchema)
    });
  }
});
