import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync, readFileSync, createWriteStream  } from 'fs';
import { resolve } from 'path';
import pkg from 'json5';
import archiver from 'archiver';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  process.env = { ...process.env, ...env };
  
  const outDir = mode === 'prod' ? 'build/prod' : 'build/dev';

  return defineConfig({
    server: {
      port: 4200,
      host: 'localhost',
    },
    build: {
      outDir: outDir,
      assetsDir: 'content',
    },
    plugins: [
      react(),
      {
        name: 'manifest-cleanup',
        writeBundle: async () => {
          const manifest = await postBuildCleanup(outDir, env.VITE_CLIENT_ID, mode);
          if (mode === 'prod') {
            createZipArchive(outDir, manifest.version);
          }
        },
      },
    ],
  });
};

const { parse } = pkg;

const stringifyManifest = (manifest) => {
  let json = JSON.stringify(manifest, null, 2);
  json = json.replace(/,\s*}/g, " }");
  return json;
}

const postBuildCleanup = (outDir, clientId, mode) => {
  const manifestPath = resolve(__dirname, outDir, 'manifest.json');
  const manifest = parse(readFileSync(manifestPath, 'utf-8'));
  manifest.oauth2.client_id = clientId;
  if (mode === 'prod') {
    delete manifest.key;
  }
  writeFileSync(manifestPath, stringifyManifest(manifest));
  return manifest; 
}

const createZipArchive = (outDir, version) => {
  const output = createWriteStream(`${__dirname}/${outDir}-${version}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  output.on('close', () => {
    console.log(`Archived ${archive.pointer()} total bytes, Archiver has been finalized and the output file descriptor has closed.`);
    console.log('\x1b[92m%s\x1b[0m', '-----------------------------------------------') 
    console.log('\x1b[92m%s\x1b[0m%s', '✅ Zip file created: ', `${outDir}-${version}.zip`);
    console.log('\x1b[92m%s\x1b[0m', '-----------------------------------------------')
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(outDir, false);
  archive.finalize();
};