import { Progress } from "@/components/ui/progress"

import { Icons } from "./icons"

export function FileUploadItem({ fileName, progress }: any) {
  return (
    <div className="grid grid-cols-4 w-full items-center gap-4">
      <div className="flex flex-row items-center gap-2">
        <Icons.file className="h-6 w-6 text-muted-foreground" />
        <h4 className="text-xs">{fileName.length > 35 ? fileName.substring(0,35)+ "...pdf" : fileName}</h4>
      </div>
      <Progress value={progress} className="col-span-3 w-full" />
    </div>
  )
}
