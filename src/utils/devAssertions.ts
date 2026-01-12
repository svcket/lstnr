import { getAllArtists, getAllLabels } from '../data/catalog';

export const runDataIntegrityChecks = () => {
  if (!__DEV__) return;

  console.log('Running Data Integrity Checks...');

  const artists = getAllArtists();
  const labels = getAllLabels();

  // 1. Check for Unique IDs
  const artistIds = new Set();
  artists.forEach(a => {
    if (artistIds.has(a.id)) console.error(`Duplicate Artist ID: ${a.id}`);
    artistIds.add(a.id);
  });

  const labelIds = new Set();
  labels.forEach(l => {
    if (labelIds.has(l.id)) console.error(`Duplicate Label ID: ${l.id}`);
    labelIds.add(l.id);
  });

  // 2. Check for Unique Bios
  const bios = new Set();
  let duplicateBioCount = 0;
  artists.forEach(a => {
    if (bios.has(a.bio)) {
        console.warn(`Duplicate Bio found for artist: ${a.name}`);
        duplicateBioCount++;
    }
    bios.add(a.bio);
  });
  
  // 3. Check for Unique Links
  // Simplified check: ensuring no two entities have exact same website URL
  const websites = new Set();
  artists.forEach(a => {
      if (a.links?.website) {
          if (websites.has(a.links.website)) console.warn(`Duplicate website: ${a.links.website}`);
          websites.add(a.links.website);
      }
  });

  console.log(`Integrity Check Complete. ${artists.length} artists, ${labels.length} labels.`);
  if (duplicateBioCount === 0) console.log('✅ All bios are unique.');
};
