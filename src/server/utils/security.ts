/**
 * Webhook signature verification and security utilities for payment providers.
 */

/**
 * Verifies an HMAC-SHA256 webhook signature using standard Web Crypto API
 * compatible with Cloudflare Workers edge runtime.
 */
export async function verifyWebhookSignature(
  rawPayload: string,
  signatureHeader: string,
  secretKey: string
): Promise<boolean> {
  if (!signatureHeader || !secretKey) return false;

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Extract signature components if header is formatted as 't=timestamp,v1=signature'
    let signatureHex = signatureHeader;
    if (signatureHeader.includes("v1=")) {
      const parts = signatureHeader.split(",");
      const v1Part = parts.find((p) => p.trim().startsWith("v1="));
      if (v1Part) {
        signatureHex = v1Part.split("=")[1];
      }
    }

    // Convert hex string to Uint8Array
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const verified = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBytes,
      encoder.encode(rawPayload)
    );

    return verified;
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}
