# PT Reaper Addons

33 country flag patches for [REAPER_CORE](https://reforger.armaplatform.com/workshop/5EB139459EBF5C16) in Arma Reforger. The patches use its rectangular patch system and appear in its arsenal. Eastern European, Baltic, and Balkan flags are listed first, followed by additional EU flags.

## Build

Install Node.js 20.9+ and Microsoft's `texconv.exe`, then run:

```sh
npm ci
npm run build -- "C:\path\to\texconv.exe"
npm run verify
```

The built resources and their `.meta` files are included in this repository. Keep the `.meta` files when rebuilding so resource IDs remain stable.

## Credits and license

Created by eduvhc under the [MIT license](LICENSE). Flag source artwork is from [flag-icons](https://github.com/lipis/flag-icons) under its [MIT notice](LICENSES/flag-icons-MIT.txt). REAPER_CORE is by r34p3r and must be installed separately; its assets are not included or relicensed here.
