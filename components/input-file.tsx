import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile() {
  return (
    <div className="flex flex-row w-full justify-center gap-1.5">
      <Input
        className="h-12 w-[60%] border rounded-lg"
        id="paper"
        type="file"
      />
    </div>
  )
}
