import type { UserSession } from "../types";

const PBKDF2_ITERATIONS = 100000;

function getJwtSecret() {
  const secret =
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "gcc-foundation-production-hmac-secret-key-2026-uganda-east-africa";
  return secret;
}

/**
 * Derives a secure password hash using Web Crypto PBKDF2 with SHA-256 and a random salt.
 * Edge-compatible (runs on Cloudflare Workers, Node, and Vercel).
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltHex}:${hashHex}`;
}

/**
 * Verifies a candidate password against a stored PBKDF2 salt:hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !storedHash.includes(":")) return false;

  const [saltHex, expectedHashHex] = storedHash.split(":");
  if (!saltHex || !expectedHashHex) return false;

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const derivedHashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison
  if (derivedHashHex.length !== expectedHashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < derivedHashHex.length; i++) {
    diff |= derivedHashHex.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Creates an edge-compatible HMAC-SHA256 signed stateless session token.
 */
export async function createSessionToken(user: UserSession): Promise<string> {
  const encoder = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days expiration

  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || null,
    exp,
  };

  const toBase64Url = (obj: object) => {
    const json = JSON.stringify(obj);
    const uint8 = encoder.encode(json);
    let binary = "";
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };

  const headerB64 = toBase64Url(header);
  const payloadB64 = toBase64Url(payload);
  const message = `${headerB64}.${payloadB64}`;

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getJwtSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  const signatureUint8 = new Uint8Array(signature);
  let sigBinary = "";
  for (let i = 0; i < signatureUint8.length; i++) {
    sigBinary += String.fromCharCode(signatureUint8[i]);
  }
  const signatureB64 = btoa(sigBinary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${message}.${signatureB64}`;
}

/**
 * Validates and decodes an edge-compatible HMAC-SHA256 session token.
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const message = `${headerB64}.${payloadB64}`;
  const encoder = new TextEncoder();

  try {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(getJwtSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Reconstruct signature Uint8Array from base64url
    const base64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const binary = atob(padded);
    const signatureBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      signatureBytes[i] = binary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBytes,
      encoder.encode(message)
    );

    if (!isValid) return null;

    // Decode payload
    const payloadBase64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const payloadPad = payloadBase64.length % 4;
    const paddedPayload = payloadPad ? payloadBase64 + "=".repeat(4 - payloadPad) : payloadBase64;
    const payloadJson = atob(paddedPayload);
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      avatarUrl: payload.avatarUrl,
    };
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}
