import { Trash2 } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"

export function ConfirmationDialog({ title, description, onDelete }: any) {
  return (
    <Dialog>
      <DialogTrigger className="z-20">
        <Button size="icon" variant="destructive" className="h-8 w-8">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px] max-h-[650px] overflow-scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="destructive" type="submit" onClick={onDelete}>
              Delete
            </Button>
          </DialogClose>
          <DialogClose>
            <Button type="submit">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
