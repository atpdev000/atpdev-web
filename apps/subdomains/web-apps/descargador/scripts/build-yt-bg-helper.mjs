import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const esbuild = require('esbuild');

const entry = `
import { getChallenge, BotGuardClient } from 'bgutils-js/botguard';
import { WebPoMinter } from 'bgutils-js/webpo';

const REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo';
let cachedMinter = null;
let cachedExpiryMs = 0;

async function ensureMinter() {
  if (cachedMinter && Date.now() < cachedExpiryMs) {
    return cachedMinter;
  }
  const challenge = await getChallenge({
    requestKey: REQUEST_KEY,
    useYouTubeAPI: true,
    fetchFunction: window.fetch.bind(window)
  });
  const vmCode = challenge?.interpreterJavascript?.privateDoNotAccessOrElseSafeScriptWrappedValue;
  if (!vmCode) {
    throw new Error('No interpreterJavascript from getChallenge');
  }
  new Function(vmCode)();
  const bgClient = await BotGuardClient.create({
    globalName: challenge.globalName,
    program: challenge.program,
    globalObject: window
  });
  const webPoSignalOutput = [];
  const bgResponse = await bgClient.snapshot({ webPoSignalOutput });
  const itRes = await fetch('https://www.youtube.com/api/jnn/v1/GenerateIT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json+protobuf',
      'x-goog-api-key': 'AIzaSyDyT5W0Jh49F30Pqqtyfdf7pDLFKLJoAnw',
      'x-user-agent': 'grpc-web-javascript/0.1'
    },
    body: JSON.stringify([REQUEST_KEY, bgResponse])
  });
  if (!itRes.ok) {
    throw new Error('GenerateIT HTTP ' + itRes.status);
  }
  const itJson = await itRes.json();
  if (!itJson?.[0]) {
    throw new Error('GenerateIT returned empty integrityToken');
  }
  const minter = await WebPoMinter.create(
    {
      integrityToken: itJson[0],
      estimatedTtlSecs: itJson[1] || 43200,
      mintRefreshThreshold: itJson[2] || 300
    },
    webPoSignalOutput
  );
  const ttlMs = Math.max(60000, ((itJson[1] || 43200) - (itJson[2] || 300) - 60) * 1000);
  cachedMinter = minter;
  cachedExpiryMs = Date.now() + ttlMs;
  return minter;
}

window.__FTY_mintPoToken = async function (visitorData, videoId) {
  const minter = await ensureMinter();
  const poSession = visitorData ? await minter.mintAsWebsafeString(visitorData) : '';
  const poVid = videoId ? await minter.mintAsWebsafeString(videoId) : '';
  return {
    poSession,
    poVid,
    userAgent: navigator.userAgent,
    ttlRemainingSec: Math.max(0, Math.round((cachedExpiryMs - Date.now()) / 1000))
  };
};
`;

const outDir = path.resolve(__dirname, '../public/vendor');
fs.mkdirSync(outDir, { recursive: true });
esbuild.buildSync({
  stdin: {
    contents: entry,
    resolveDir: path.resolve(__dirname, '../../..'),
    loader: 'js'
  },
  bundle: true,
  minify: true,
  platform: 'browser',
  format: 'iife',
  outfile: path.join(outDir, 'yt-bg-helper.js')
});

console.log('Built yt-bg-helper.js bytes:', fs.statSync(path.join(outDir, 'yt-bg-helper.js')).size);
