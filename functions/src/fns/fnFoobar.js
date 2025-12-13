const { onRequest } = require("firebase-functions/v2/https");
exports.foobar = onRequest((request, response) => {
  // json
  response.status(200).json({
    status: `ok:c0d22b54-e82e-5893-8524-756c9e766148`,
    "@": Date.now(),
  });
});
