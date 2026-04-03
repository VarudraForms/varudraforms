# Firebase CLI Login Troubleshooting (TLS / CA / Proxy)

## Symptoms
When running:

```bash
firebase login --reauth
```

You may see errors similar to:

- `Waiting for authentication...`
- `unable to get local issuer certificate`
- `Token Fetch Error: FirebaseError: Failed to make request to https://accounts.google.com/o/oauth2/token`
- `Error: Failed to make request to https://auth.firebase.tools/attest`

## What fixed it (root cause)
In your environment, `firebase-tools` (Node.js) was not trusting the correct certificate authority chain, often due to `NODE_EXTRA_CA_CERTS` pointing to a non-existent path and/or missing CA configuration for Node.

`curl` succeeded in validating certificates, which indicated the issue was specifically with Node’s TLS/CA setup used by `firebase-tools`.

## Runbook: Re-login steps

### Step 1: Clear problematic CA env vars
Run these first (replace nothing):

```bash
unset NODE_EXTRA_CA_CERTS
unset SSL_CERT_FILE
```

### Step 2: Force Node to use the system CA bundle
On macOS, use the built-in CA bundle:

```bash
export SSL_CERT_FILE=/etc/ssl/cert.pem
```

### Step 3: If you have proxy env vars, remove them for the login
Your environment had proxy variables set to a local MITM-style proxy (`127.0.0.1:<port>`). To avoid TLS interception issues while testing:

```bash
env -u HTTPS_PROXY -u HTTP_PROXY -u ALL_PROXY -u all_proxy -u SOCKS_PROXY -u SOCKS5_PROXY -u socks_proxy -u socks5_proxy \
firebase login --reauth --debug
```

After this, you should see a “Visit this URL on this device to log in:” message, then:

```text
Success! Logged in as <your-email>
```

## Alternate fallback (if CA still fails)
If Step 1–3 still fails with CA/TLS errors, try switching Node to OpenSSL CA handling:

```bash
unset NODE_EXTRA_CA_CERTS
export SSL_CERT_FILE=/etc/ssl/cert.pem
export NODE_OPTIONS="--use-openssl-ca"

env -u HTTPS_PROXY -u HTTP_PROXY -u ALL_PROXY -u all_proxy -u SOCKS_PROXY -u SOCKS5_PROXY -u socks_proxy -u socks5_proxy \
firebase login --reauth --debug
```

## CI / Headless note
After successful interactive login, generate a CI token:

```bash
firebase login:ci
```

Store the returned token in your CI secret(s) (commonly `FIREBASE_TOKEN`).

## Quick verification (optional)
If you need to quickly confirm TLS works independently of Node:

```bash
env -u HTTPS_PROXY -u HTTP_PROXY -u ALL_PROXY -u all_proxy -u SOCKS_PROXY -u SOCKS5_PROXY -u socks_proxy -u socks5_proxy \
curl -Iv https://auth.firebase.tools/attest --max-time 20
```

## Notes for future debugging
- If you see `Warning: Ignoring extra certs ... No such file or directory`, fix the `NODE_EXTRA_CA_CERTS` path or unset it.
- If you must keep the proxy, you may need to export and trust the proxy’s root CA for Node using `NODE_EXTRA_CA_CERTS=/path/to/proxy-root-ca.pem`.
