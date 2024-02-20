import { ExplorerLogo, GendexLogo } from "@/components/gendex-logo"
import { SearchInput } from "@/components/search-input"

export default function IndexPage() {
  return (
    <div className="flex h-full flex-row">
      <div className="flex flex-col w-full h-full items-center justify-center gap-6">
        <div className="flex flex-row items-center justify-center">
          <ExplorerLogo width="120px" height="120px" />
          <h1 className="text-5xl font-bold">Gendex Explorer</h1>
        </div>

        <SearchInput />
      </div>
    </div>
  )
}
