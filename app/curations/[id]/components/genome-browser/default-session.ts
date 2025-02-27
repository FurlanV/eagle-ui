const getSession = (geneInfo: any) => {
    const session = {
        name: 'this session',
        margin: 0,
        view: {
            id: 'linearGenomeView',
            minimized: false,
            type: 'LinearGenomeView',
            offsetPx: 1500,
            bpPerPx: 0.1554251851851852,
            displayedRegions: [
                {
                    refName: geneInfo.seq_region_name, //?? '10',
                    end: geneInfo.end,//133797422,
                    start: geneInfo.start,//0,
                    reversed: false,
                    assemblyName: 'GRCh38',
                },
            ],
            tracks: [
                {
                    id: '4aZAiE-A3',
                    type: 'ReferenceSequenceTrack',
                    configuration: 'GRCh38-ReferenceSequenceTrack',
                    minimized: false,
                    displays: [
                        {
                            id: 'AD3gqvG0_6',
                            type: 'LinearReferenceSequenceDisplay',
                            height: 180,
                            configuration:
                                'GRCh38-ReferenceSequenceTrack-LinearReferenceSequenceDisplay',
                            showForward: true,
                            showReverse: true,
                            showTranslation: true,
                        },
                    ],
                },
                {
                    id: 'EUnTnpVI6',
                    type: 'QuantitativeTrack',
                    configuration: 'hg38.100way.phyloP100way',
                    minimized: false,
                    displays: [
                        {
                            id: 'mrlawr9Wtg',
                            type: 'LinearWiggleDisplay',
                            height: 100,
                            configuration: 'hg38.100way.phyloP100way-LinearWiggleDisplay',
                            selectedRendering: '',
                            resolution: 1,
                            constraints: {},
                        },
                    ],
                },
                {
                    id: 'Cbnwl72EX',
                    type: 'VariantTrack',
                    configuration:
                        'ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf',
                    minimized: false,
                    displays: [
                        {
                            id: 'dvXz01Wf6w',
                            type: 'LinearVariantDisplay',
                            height: 100,
                            configuration:
                                'ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf-LinearVariantDisplay',
                        },
                    ],
                },
                {
                    id: 'clinvar',
                    type: 'FeatureTrack',
                    configuration:
                        'clinvar',
                    minimized: false,
                    displays: [
                        {
                            id: 'dvXz01Wf6w',
                            type: 'LinearVariantDisplay',
                            height: 100,
                        },
                    ],
                },
            ],
            hideHeader: false,
            hideHeaderOverview: false,
            hideNoTracksActive: false,
            trackSelectorType: 'hierarchical',
            trackLabels: 'overlapping',
            showCenterLine: false,
            showCytobandsSetting: true,
            showGridlines: true,
        },
    }
    return session
}

export default getSession