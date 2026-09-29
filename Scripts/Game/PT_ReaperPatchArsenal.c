modded class SCR_ArsenalComponent
{
	// Extend only Reaper's patch catalog; leave every other arsenal unchanged.
	override protected void REAPER_GetResourceNamesFromConfig(out notnull array<ResourceName> availablePrefabs)
	{
		super.REAPER_GetResourceNamesFromConfig(availablePrefabs);
		if (m_reaperConfigFile != "{4340D48C5C75EE40}Configs/REAPER_PatchesConfig.conf")
			return;

		availablePrefabs.Insert("{7277185F0B5478A7}Prefabs/Patches/PT_rectangle_patch_AL.et");
		availablePrefabs.Insert("{DB20D900EB9A12A6}Prefabs/Patches/PT_rectangle_patch_BY.et");
		availablePrefabs.Insert("{72C99B7F7A96E448}Prefabs/Patches/PT_rectangle_patch_BA.et");
		availablePrefabs.Insert("{8C01C4E3AA7B0197}Prefabs/Patches/PT_rectangle_patch_BG.et");
		availablePrefabs.Insert("{98E16BEE6DB3DB78}Prefabs/Patches/PT_rectangle_patch_HR.et");
		availablePrefabs.Insert("{51E87D5F4E3C8067}Prefabs/Patches/PT_rectangle_patch_EE.et");
		availablePrefabs.Insert("{844227272B51DFE0}Prefabs/Patches/PT_rectangle_patch_GR.et");
		availablePrefabs.Insert("{AF56961CBE756351}Prefabs/Patches/PT_rectangle_patch_HU.et");
		availablePrefabs.Insert("{39BA71C31D739D03}Prefabs/Patches/PT_rectangle_patch_XK.et");
		availablePrefabs.Insert("{FF30BEB63883FC49}Prefabs/Patches/PT_rectangle_patch_LV.et");
		availablePrefabs.Insert("{3300473C654E2B61}Prefabs/Patches/PT_rectangle_patch_LT.et");
		availablePrefabs.Insert("{423A439F8BCF0438}Prefabs/Patches/PT_rectangle_patch_MD.et");
		availablePrefabs.Insert("{5BC0A10D517DC912}Prefabs/Patches/PT_rectangle_patch_ME.et");
		availablePrefabs.Insert("{D743DD0A8F802170}Prefabs/Patches/PT_rectangle_patch_MK.et");
		availablePrefabs.Insert("{42F659A95AA0DD2F}Prefabs/Patches/PT_rectangle_patch_PL.et");
		availablePrefabs.Insert("{7125120D5BC66B01}Prefabs/Patches/PT_rectangle_patch_RO.et");
		availablePrefabs.Insert("{3EDFDCA7A82D7152}Prefabs/Patches/PT_rectangle_patch_RU.et");
		availablePrefabs.Insert("{AC529623740A3A35}Prefabs/Patches/PT_rectangle_patch_RS.et");
		availablePrefabs.Insert("{A0585B2C2F404018}Prefabs/Patches/PT_rectangle_patch_SK.et");
		availablePrefabs.Insert("{462032AF05152A95}Prefabs/Patches/PT_rectangle_patch_SI.et");
		availablePrefabs.Insert("{FF46405BC67869F2}Prefabs/Patches/PT_rectangle_patch_UA.et");
		availablePrefabs.Insert("{EFF8D7A9C8B72EE0}Prefabs/Patches/PT_rectangle_patch_BE.et");
		availablePrefabs.Insert("{55387AED9DADBF15}Prefabs/Patches/PT_rectangle_patch_CY.et");
		availablePrefabs.Insert("{3489963998618DB9}Prefabs/Patches/PT_rectangle_patch_DK.et");
		availablePrefabs.Insert("{73E84E9489A71583}Prefabs/Patches/PT_rectangle_patch_FI.et");
		availablePrefabs.Insert("{4F7357BCC23DE9BD}Prefabs/Patches/PT_rectangle_patch_FR.et");
		availablePrefabs.Insert("{DBA0C78BB751C6FA}Prefabs/Patches/PT_rectangle_patch_IE.et");
		availablePrefabs.Insert("{15A7C34D4C2A90E0}Prefabs/Patches/PT_rectangle_patch_IT.et");
		availablePrefabs.Insert("{84AC21456E3FBA80}Prefabs/Patches/PT_rectangle_patch_LU.et");
		availablePrefabs.Insert("{A364CB674B5BAF95}Prefabs/Patches/PT_rectangle_patch_MT.et");
		availablePrefabs.Insert("{E6267061C2E07060}Prefabs/Patches/PT_rectangle_patch_PT.et");
		availablePrefabs.Insert("{443A8CB8A0F5A38A}Prefabs/Patches/PT_rectangle_patch_ES.et");
		availablePrefabs.Insert("{6E13CE8767DC57EA}Prefabs/Patches/PT_rectangle_patch_SE.et");
	}
}
