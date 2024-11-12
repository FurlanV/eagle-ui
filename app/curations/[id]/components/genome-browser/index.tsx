import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  JBrowseLinearGenomeView,
  createViewState,
} from "@jbrowse/react-linear-genome-view"
import { createRoot, hydrateRoot } from "react-dom/client"

import assembly from "./assembly"
import getSession from "./default-session"
import theme from "./theme"
import tracks from "./tracks"

type ViewModel = ReturnType<typeof createViewState>

export function GenomeBrowser({ geneInfoData }: any) {
  const [viewState, setViewState] = useState<ViewModel>()
  const [patches, setPatches] = useState("")
  const [stateSnapshot, setStateSnapshot] = useState("")

  useEffect(() => {
    const defaultSession = getSession(geneInfoData)

    const state = createViewState({
      assembly,
      tracks,
      onChange: (patch: any) => {
        setPatches((previous) => previous + JSON.stringify(patch) + "\n")
      },
      defaultSession,
      configuration: {
        theme,
        rpc: {
          defaultDriver: "WebWorkerRpcDriver",
        },
      },
      makeWorkerInstance: () => {
        return new Worker(new URL("./rpc-worker", import.meta.url))
      },
      hydrateFn: hydrateRoot,
      createRootFn: createRoot,
    })
    setViewState(state)
  }, [])

  if (!viewState) {
    return null
  }

  return <JBrowseLinearGenomeView viewState={viewState} />
}
