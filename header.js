const dotenv = require('dotenv');
dotenv.config()
const crypto = require('crypto');
function generateSignature(method, urlPath, timestamp, secretKey) {
    secretKey = secretKey.trim();
    const signatureString = `(request-target): ${method?.toLowerCase()} ${urlPath?.toLowerCase().trim()}\ndata: ${timestamp}`;

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(signatureString);
    const signature = hmac.digest('base64');

    const encodedSignature = encodeURIComponent(signature);
    const authHeader = `Signature keyId="${process.env.key_id}", algorithm="hmac-sha256", headers="(request-target) x-aux-date", signature="${encodedSignature}"`;
    return authHeader;
}

const generateHeadersMiddleware = async (req, res, next) => {
  // Generate timestamp in UTC format
  const timestamp = new Date().toUTCString();
  // Extract URL path without query string
  const urlPath = req.url?.split("?")[0];

  // Check for missing method or URL path
  if (!req.method || !urlPath) {
    console.error("Method or URL path is missing in the request.");
    return res
      .status(400)
      .json({ message: "Missing required fields in request" }); // Handle error with proper response
  }

  try {
    // Generate signature using provided function
    const signature = await generateSignature(
      req.method.toLowerCase(),
      urlPath,
      timestamp,
      process.env.secret_key
    );
    req.headers = {
      host: "sandbox.areeba.com",
      Signature: signature,
      "X-Aux-Date": timestamp,
    };
    next();
  } catch (error) {
    console.error("Error generating signature:", error);
    return res.status(500).json({ message: "Internal server error" }); // Handle signature generation error
  }
};

module.exports = generateHeadersMiddleware;
