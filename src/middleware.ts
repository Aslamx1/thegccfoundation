import { NextRequest, NextResponse } from "next/server";

function createNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function middleware(request: NextRequest) {
  const nonce = createNonce();
  const csp = [
    "default-src 'self' https://donorbox.org https://*.donorbox.org",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://donorbox.org https://*.donorbox.org https://js.stripe.com https://*.js.stripe.com https://www.paypal.com https://*.paypal.com https://www.google.com https://www.gstatic.com https://pay.google.com https://cdn.jsdelivr.net https://jspm.dev https://doublethedonation.com https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://donorbox.org https://*.donorbox.org https://rsms.me https://fonts.googleapis.com",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data: https://donorbox.org https://*.donorbox.org https://rsms.me https://fonts.gstatic.com",
    "connect-src 'self' https://donorbox.org https://*.donorbox.org https://api.stripe.com https://*.stripe.com https://www.paypal.com https://*.paypal.com https://www.google.com https://pay.google.com https://appsignal-endpoint.net https://doublethedonation.com https://open.er-api.com https://challenges.cloudflare.com https://media.thegccfoundation.org",
    "frame-src 'self' https://donorbox.org https://*.donorbox.org https://js.stripe.com https://hooks.stripe.com https://www.paypal.com https://*.paypal.com https://www.google.com https://pay.google.com https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://donorbox.org https://*.donorbox.org https://www.paypal.com https://*.paypal.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
