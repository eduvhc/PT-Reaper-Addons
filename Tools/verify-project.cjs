const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const prefabDirectory = path.join(root, 'Prefabs', 'Patches');
const materialDirectory = path.join(root, 'Assets', 'Patches', 'Data');
const arsenal = fs.readFileSync(path.join(root, 'Scripts', 'Game', 'PT_ReaperPatchArsenal.c'), 'utf8');
const prefabs = fs.readdirSync(prefabDirectory).filter((file) => /^PT_rectangle_patch_[A-Z]{2}\.et$/.test(file));
const resourceIds = new Set();

assert.equal(prefabs.length, 33, 'Expected 33 country patches');
assert.match(arsenal, /super\.REAPER_GetResourceNamesFromConfig\(availablePrefabs\)/);

for (const prefab of prefabs) {
  const code = prefab.match(/_([A-Z]{2})\.et$/)[1];
  const stem = `PT_rectangle_patch_${code}`;
  const prefabResource = `Prefabs/Patches/${prefab}`;
  const materialResource = `Assets/Patches/Data/${stem}.emat`;
  const textureResource = `Assets/Patches/Data/${stem}_BCR.edds`;
  const contents = fs.readFileSync(path.join(prefabDirectory, prefab), 'utf8');

  assert.match(contents, /Name "Patch [^"]+"/);
  assert.match(contents, /Description "eduvhc rectangle Patch"/);
  assert.match(contents, /REAPER_rectangle_patch_DE\.et/);
  assert.ok(fs.existsSync(path.join(materialDirectory, `${stem}.emat`)));
  assert.ok(fs.existsSync(path.join(materialDirectory, `${stem}_BCR.edds`)));
  assert.ok(fs.existsSync(path.join(root, 'Assets', 'Flags', `${code.toLowerCase()}.svg`)));

  for (const resource of [prefabResource, materialResource, textureResource]) {
    const relative = resource.replaceAll('/', path.sep);
    const metadata = fs.readFileSync(path.join(root, `${relative}.meta`), 'utf8');
    const match = metadata.match(/Name "\{([0-9A-F]{16})\}([^"]+)"/);
    assert.ok(match, `Missing resource ID in ${resource}.meta`);
    assert.equal(match[2], resource);
    assert.ok(!resourceIds.has(match[1]), `Duplicate resource ID ${match[1]}`);
    resourceIds.add(match[1]);

    if (resource === prefabResource) {
      assert.ok(arsenal.includes(`{${match[1]}}${resource}`), `Missing arsenal entry: ${resource}`);
    }
  }
}

const registrations = arsenal.match(/availablePrefabs\.Insert\(/g) || [];
assert.equal(registrations.length, prefabs.length, 'Arsenal and prefab counts differ');
console.log(`Verified ${prefabs.length} prefabs, ${registrations.length} registrations, and ${resourceIds.size} unique resource IDs.`);
