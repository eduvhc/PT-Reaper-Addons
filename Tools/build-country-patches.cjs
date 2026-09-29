// Build-time only. Input SVGs are vendored from flag-icons under MIT (see LICENSES).
// Set NODE_PATH to a Node installation containing sharp; pass texconv.exe as argv[2].
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const texconv = process.argv[2];
if (!texconv || !fs.existsSync(texconv)) throw new Error('Usage: node build-country-patches.cjs <texconv.exe>');
const PATCH_TEXTURE = Object.freeze({
  size: 1024,
  frontWidth: 576,
  innerInsetX: 24,
  innerInsetY: 30,
  borderColor: '#171817',
  stitchColor: '#a7a6a0',
  stitchWidth: 6,
  stitchDash: '8 8',
  flagBrightness: 0.88,
  flagSaturation: 0.88,
});
// Eastern Europe (UN M49), Baltics, and Balkans first. Czechia is already
// supplied by REAPER_CORE. Keep the other EU patches after this first group.
const easternCountries = {
  AL: 'Albania', BY: 'Belarus', BA: 'Bosnia and Herzegovina', BG: 'Bulgaria',
  HR: 'Croatia', EE: 'Estonia', GR: 'Greece', HU: 'Hungary', XK: 'Kosovo',
  LV: 'Latvia', LT: 'Lithuania', MD: 'Moldova', ME: 'Montenegro',
  MK: 'North Macedonia', PL: 'Poland', RO: 'Romania', RU: 'Russia',
  RS: 'Serbia', SK: 'Slovakia', SI: 'Slovenia', UA: 'Ukraine',
};
const otherEuCountries = {
  BE: 'Belgium', CY: 'Cyprus', DK: 'Denmark', FI: 'Finland', FR: 'France',
  IE: 'Ireland', IT: 'Italy', LU: 'Luxembourg', MT: 'Malta', PT: 'Portugal',
  ES: 'Spain', SE: 'Sweden',
};
const countries = { ...easternCountries, ...otherEuCountries };
const prefabDir = path.join(root, 'Prefabs', 'Patches');
const dataDir = path.join(root, 'Assets', 'Patches', 'Data');
fs.mkdirSync(prefabDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });
const id = () => crypto.randomBytes(8).toString('hex').toUpperCase();
const guid = (metaPath) => {
  if (fs.existsSync(metaPath)) {
    const current = fs.readFileSync(metaPath, 'utf8').match(/Name "\{([0-9A-F]{16})\}/);
    if (!current) throw new Error(`Missing GUID: ${metaPath}`);
    return current[1];
  }
  return id();
};
const meta = (resource, resourceId, type, options = '') => `MetaFileClass {\n Name "{${resourceId}}${resource}"\n Configurations {\n  ${type} PC {${options}\n  }\n  ${type} XBOX_SERIES : PC {\n  }\n  ${type} PS4 : PC {\n  }\n  ${type} PS5 : PC {\n  }\n  ${type} HEADLESS : PC {\n  }\n }\n}\n`;
const write = (file, body) => fs.writeFileSync(file, body);

async function build() {
  const arsenal = [];
  for (const [code, name] of Object.entries(countries)) {
    const stem = `PT_rectangle_patch_${code}`;
    const customPng = path.join(root, 'Assets', 'Flags', `${code.toLowerCase()}.png`);
    const sourceSvg = path.join(root, 'Assets', 'Flags', `${code.toLowerCase()}.svg`);
    const src = fs.existsSync(customPng) ? customPng : sourceSvg;
    if (!fs.existsSync(src)) throw new Error(`Missing flag artwork: ${src}`);
    const textureResource = `Assets/Patches/Data/${stem}_BCR.edds`;
    const materialResource = `Assets/Patches/Data/${stem}.emat`;
    const prefabResource = `Prefabs/Patches/${stem}.et`;
    const texturePath = path.join(dataDir, `${stem}_BCR.edds`);
    const materialPath = path.join(dataDir, `${stem}.emat`);
    const prefabPath = path.join(prefabDir, `${stem}.et`);
    const textureId = guid(`${texturePath}.meta`);
    const materialId = guid(`${materialPath}.meta`);
    const prefabId = guid(`${prefabPath}.meta`);
    const existingEntityId = fs.existsSync(prefabPath)
      ? fs.readFileSync(prefabPath, 'utf8').match(/\bID "([0-9A-F]{16})"/)?.[1]
      : undefined;

    // REAPER_CORE's visible face uses roughly the first 56% of the texture,
    // rotated. The remaining UV islands form the dark reverse/edge fabric.
    const pngPath = path.join(dataDir, `${stem}_BCR.png`);
    const makeFace = async (width) => {
      const flag = await sharp(src).resize(PATCH_TEXTURE.size, PATCH_TEXTURE.size, { fit: 'fill' }).rotate(90)
        .resize(width - PATCH_TEXTURE.innerInsetX * 2, PATCH_TEXTURE.size - PATCH_TEXTURE.innerInsetY * 2, { fit: 'fill' })
        .modulate({ brightness: PATCH_TEXTURE.flagBrightness, saturation: PATCH_TEXTURE.flagSaturation })
        .ensureAlpha().png().toBuffer();
      const stitch = Buffer.from(`<svg width="${width}" height="${PATCH_TEXTURE.size}" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="${width - 24}" height="${PATCH_TEXTURE.size - 24}" rx="6" fill="none" stroke="${PATCH_TEXTURE.stitchColor}" stroke-width="${PATCH_TEXTURE.stitchWidth}" stroke-dasharray="${PATCH_TEXTURE.stitchDash}"/></svg>`);
      return sharp({ create: { width, height: PATCH_TEXTURE.size, channels: 4, background: PATCH_TEXTURE.borderColor } })
        .composite([{ input: flag, left: PATCH_TEXTURE.innerInsetX, top: PATCH_TEXTURE.innerInsetY }, { input: stitch, left: 0, top: 0 }])
        .png().toBuffer();
    };
    const front = await makeFace(PATCH_TEXTURE.frontWidth);
    await sharp({ create: { width: PATCH_TEXTURE.size, height: PATCH_TEXTURE.size, channels: 4, background: PATCH_TEXTURE.borderColor } })
      .composite([{ input: front, left: 0, top: 0 }])
      .png().toFile(pngPath);
    execFileSync(texconv, ['-f', 'BC7_UNORM_SRGB', '-m', '0', '-y', '-o', dataDir, pngPath], { stdio: 'pipe' });
    const ddsPath = path.join(dataDir, `${stem}_BCR.dds`);
    fs.renameSync(ddsPath, texturePath);
    write(`${texturePath}.meta`, meta(textureResource, textureId, 'PNGResourceClass', '\n   ColorSpace ToSRGB'));
    write(materialPath, `MatPBRBasic {\n AllowUserAlphaBias 1\n DisableUserAphaInShadow 1\n BCRMap "{${textureId}}${textureResource}"\n OpacityMap "{70A53F4EA373F142}Assets/Characters/Basebody/Data/HeadClipping_A.edds"\n NMOMap "{55EBE9BC4A721891}Assets/Patches/Data/reaper_patch_rectangle_base_NMO.edds"\n}\n`);
    write(`${materialPath}.meta`, meta(materialResource, materialId, 'MaterialResourceClass'));
    write(prefabPath, `GameEntity : "{8FDAA4F88FBD3F2E}Prefabs/Patches/REAPER_rectangle_patch_DE.et" {\n ID "${existingEntityId || id()}"\n components {\n  InventoryItemComponent "{68F0F84A79762D37}" {\n   Attributes SCR_ItemAttributeCollection "{68F0F84A46BFD980}" {\n    ItemDisplayName UIInfo "{68F0F84A43DB9D79}" {\n     Name "Patch ${name}"\n     Description "eduvhc rectangle Patch"\n    }\n   }\n  }\n  MeshObject "{5104869D194C6262}" {\n   Materials {\n    MaterialAssignClass "{69F283A4BCA0A987}" {\n     AssignedMaterial "{${materialId}}${materialResource}"\n    }\n   }\n  }\n  BaseLoadoutClothComponent "{5104869D194C627A}" {\n   WornMaterialsOverride {\n    "{${materialId}}${materialResource}"\n   }\n   ItemMaterialsOverride {\n    "{${materialId}}${materialResource}"\n   }\n  }\n }\n}\n`);
    write(`${prefabPath}.meta`, meta(prefabResource, prefabId, 'EntityTemplateResourceClass'));
    arsenal.push(`\t\tavailablePrefabs.Insert("{${prefabId}}${prefabResource}");`);
  }
  write(path.join(root, 'Scripts', 'Game', 'PT_ReaperPatchArsenal.c'), `modded class SCR_ArsenalComponent\n{\n\t// Extend only Reaper's patch catalog; leave every other arsenal unchanged.\n\toverride protected void REAPER_GetResourceNamesFromConfig(out notnull array<ResourceName> availablePrefabs)\n\t{\n\t\tsuper.REAPER_GetResourceNamesFromConfig(availablePrefabs);\n\t\tif (m_reaperConfigFile != "{4340D48C5C75EE40}Configs/REAPER_PatchesConfig.conf")\n\t\t\treturn;\n\n${arsenal.join('\n')}\n\t}\n}\n`);
  process.stdout.write(`Built ${arsenal.length} REAPER_CORE rectangle patches.\n`);
}
build().catch((error) => { console.error(error); process.exitCode = 1; });
