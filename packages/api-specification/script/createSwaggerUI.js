const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsPath = path.join(__dirname, '../docs');
if (!fs.existsSync(docsPath)) {
  fs.mkdirSync(docsPath, { recursive: true });
}

// Bundle the specification
const specPath = path.join(docsPath, 'openapi.yml');
execSync(`swagger-cli bundle src/butleren-api-specification.yml -o ${specPath}`, { stdio: 'inherit' });

// Copy Swagger UI files
const swaggerUIDist = path.dirname(require.resolve('swagger-ui-dist/package.json'));
const targetDir = path.join(docsPath, '/swagger-ui');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdirSync(swaggerUIDist).forEach(file => {
  if (file !== 'package.json' && file !== 'README.md') {
    fs.copyFileSync(path.join(swaggerUIDist, file), path.join(targetDir, file));
  }
});

// Generate index.html
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="./swagger-ui/swagger-ui.css" />
  <link rel="icon" type="image/png" href="./swagger-ui/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="./swagger-ui/favicon-16x16.png" sizes="16x16" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="./swagger-ui/swagger-ui-bundle.js"></script>
  <script src="./swagger-ui/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "./openapi.yml",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(docsPath, '/index.html'), template);
console.log('index.html generated successfully.');