import { cn } from "@/lib/utils"

export function Stepper({ data, selectedPhase, setSelectedPhase }: any) {
  return (
    <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 shadow-sm dark:text-gray-400 sm:text-basesm:p-4 sm:space-x-4 rtl:space-x-reverse h-[53px]">
      {data.map((job: any, index: number) => (
        <li className="flex items-center">
          <span
            className={cn(
              "flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-600 rounded-full shrink-0 text-left",
              selectedPhase?.id === job.id && "border-2 font-bold dark:font-white"
            )}
          >
            {index + 1}
          </span>

          <span
            className={cn(
              "cursor-pointer",
              selectedPhase?.id === job.id && "font-bold"
            )}
            onClick={() => setSelectedPhase(job)}
          >
            {job.name}
          </span>
          {index !== data.length - 1 && (
            <svg
              className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 12 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m7 9 4-4-4-4M1 9l4-4-4-4"
              />
            </svg>
          )}
        </li>
      ))}
    </ol>
  )
}
