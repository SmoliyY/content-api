const { execSync } = require('child_process');

const root = 'openapi/openapi.yaml';
const bundle = 'feedback-api';
const bundleExt = 'json';

try {
  execSync(`npx @redocly/cli bundle ${root}  -o ${bundle} --ext ${bundleExt}`);
  execSync(`aws s3 cp ${bundle}.${bundleExt} s3://${process.env.AWS_S3_PATH}`);
  console.log(`Successfully uploaded ${bundle}.${bundleExt} to s3://${process.env.AWS_S3_PATH}`);
} catch (e) {
  process.stderr.write(e.output);
}
