import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function GeneCard({ geneInfo, annotation }: any) {
  return (
    <Card className="flex flex-col w-96 p-4 gap-3">
      <Card className="items-center justify-center h-[20%]">
        <CardHeader className="col-span-4 flex flex-col items-centerspace-y-0 pb-2">
          <CardTitle className="text-xl font-medium">{geneInfo.display_name}</CardTitle>
          <CardTitle className="text-sm font-medium">
            {geneInfo.description}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="items-center justify-center h-full">
        <CardHeader className="col-span-4 flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            Gene Info ({geneInfo.assembly_name})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 gap-5">

          <div className="flex flex-col gap-2">
            <Label className="font-bold text-md">Position</Label>
            <div className="flex flex-row gap-2">
              <div className="text-sm">Chr {geneInfo.seq_region_name}:</div>
              <div className="text-sm">{geneInfo.start} -</div>
              <div className="text-sm">{geneInfo.end}</div>
              <div className="text-sm">({geneInfo.strand})</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold text-md">Senitivity Score</Label>
            <div className="flex flex-row gap-4">
              <div className="text-sm">
                {`(Haplosensitivity) = ${
                  annotation.haplo_score ? annotation.haplo_score : 0.0
                }`}
              </div>
              <div className="text-sm">
                {`(Triplosensitivity) = ${
                  annotation.triplo_score ? annotation.triplo_score : 0.0
                }`}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold text-md">Missensse score</Label>
            <div className="flex flex-row text-sm gap-4">
              <p>z: {annotation.mis ? annotation.mis.z : ""}</p>
              <p>o/e: {annotation.mis ? annotation.mis.oe : ""}</p>
              <p>CI: {annotation.mis ? annotation.mis.CI : ""}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold text-md">Loss of Function scores</Label>
            <div className="flex flex-row text-sm gap-4">
              <p>pLI: {annotation.lof ? annotation.lof.pLI : ""}</p>
              <p>o/e: {annotation.lof ? annotation.lof.oe : ""}</p>
              <p>CI: {annotation.lof ? annotation.lof.CI : ""}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold text-md">Linked Diseases</Label>
            <div className="flex flex-col text-sm gap-2 overflow-scroll h-38">
              {/* <p>{annotation.haplo_disease ? annotation.haplo_disease : ""}</p> */}
              {geneInfo.phenotypes
                ?.reduce((unique: any, phenotype: any) => {
                  if (
                    !unique.some(
                      (item: any) => item.description === phenotype.description
                    )
                  ) {
                    unique.push(phenotype)
                  }
                  return unique
                }, [])
                .map((phenotype: any) => (
                  <p>{phenotype.description}</p>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Card>
  )
}
