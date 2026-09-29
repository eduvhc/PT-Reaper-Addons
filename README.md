# PT Reaper Addons

Country flag patches for REAPER_CORE. The addon extends Reaper's patch arsenal and uses its existing rectangular patch mesh, material details, and clothing slot. Eastern Europe, the Baltics, and the Balkans are listed first in the catalog. It also includes the EU-country patches not already supplied by Reaper. Austria, Czechia, Germany, and the Netherlands remain Reaper's own assets.

## Dependencies

- Arma Reforger (base game)
- REAPER_CORE

No Flag Patches, GRS, or other Workshop dependency is required. REAPER_CORE remains necessary because this addon extends its patch system and mesh. No files from those other Workshop mods are redistributed.

## Art and build

The 33 fallback flag SVGs in `Assets/Flags` come from [flag-icons](https://github.com/lipis/flag-icons), copyright 2013 Panayiotis Lipiridis and contributors, under the MIT license reproduced in `LICENSES/flag-icons-MIT.txt`. Portugal currently uses the user-provided `Assets/Flags/pt.png` instead of its fallback SVG. Reaper's mesh and shared normal/opacity maps are referenced as dependencies, not copied.

`Tools/build-country-patches.cjs` regenerates the prefabs, materials, and BC7 textures. It needs Node.js 20.9 or later, `sharp` (`npm ci`), and Microsoft's `texconv.exe`; none is a game/Workshop dependency. The generated `.edds` and source `.png` files are included so players do not need those tools. Build with `npm run build -- "C:\path\to\texconv.exe"`, then run `npm run verify`. The build preserves existing resource IDs; do not delete `.meta` files before rebuilding.

To use custom artwork, put a 4:3 PNG named with the two-letter country code (for example `Assets/Flags/pt.png`) beside its SVG and rebuild. The PNG takes precedence. Supply only the flat flag artwork; the generator adds the Reaper-style border, stitching, colour treatment, and UV placement. Do not replace the generated 1024×1024 texture directly with a 4:3 image.

## License and credits

Original addon code, generated textures, prefabs, and the supplied Portugal flag image are available under [MIT](LICENSE), copyright 2026 eduvhc. The remaining source flag SVGs are from flag-icons under its separate [MIT notice](LICENSES/flag-icons-MIT.txt). REAPER_CORE, its mesh, scripts, and shared maps are **not** included or relicensed; install it as a separate Workshop dependency. REAPER_CORE is by r34p3r. The author has confirmed permission for this extension and for redistribution of the Portugal image.

The first catalog group covers the UN Eastern Europe set plus the Baltics and Balkans. The additional non-EU patches are Albania, Belarus, Bosnia and Herzegovina, Kosovo, Moldova, Montenegro, North Macedonia, Russia, Serbia, and Ukraine. Kosovo is represented by the `XK` flag asset. The remaining EU flags stay available after this group rather than being removed.

## Verification

Run `npm run verify` for resource references, metadata, and catalog consistency. Then use the installed Workbench to compile the Game scripts and smoke-test changed `.et` resources. Before Workshop publication, inspect the patch arsenal and equip a patch on a remote client, including console clients if they are supported by the server. Static verification and Workbench resource-open tests do not prove in-game equipping.
