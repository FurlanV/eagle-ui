import { SearchInput } from "@/components/search-input"

export default function IndexPage() {
  return (
    <div className="flex h-full flex-row">
      <div className="flex flex-col w-full h-full items-center justify-center gap-6">
        <h1 className="text-5xl font-bold">Gendex Explorer</h1>
        <SearchInput />
      </div>
    </div>
  )
}
