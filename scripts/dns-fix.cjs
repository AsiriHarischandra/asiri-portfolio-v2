// Preloaded via `node --require` before Next.js boots (see the "dev" script in
// package.json). Some machines have Node's DNS resolver pointed at a dead
// loopback address, which makes the SRV lookups that `mongodb+srv://` needs
// fail with ECONNREFUSED. Setting the servers here — in the raw process, before
// any bundling — reaches the same native `dns` singleton the MongoDB driver
// uses, which an in-app call does not reliably do under Next's webpack build.
try {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  /* ignore — if this fails, the app falls back to system DNS */
}
