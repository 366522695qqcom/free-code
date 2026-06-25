import { useCallback } from 'react'
import { useWorkspaceState, useSetWorkspaceState } from '../state/WorkspaceState.js'
import { SLASH_COMMANDS } from '../types/index.js'

export function useSlashCommand() {
  const slashCommandOpen = useWorkspaceState(s => s.slashCommandOpen)
  const slashCommandFilter = useWorkspaceState(s => s.slashCommandFilter)
  const slashCommandIndex = useWorkspaceState(s => s.slashCommandIndex)
  const setState = useSetWorkspaceState()

  const filteredCommands = SLASH_COMMANDS.filter(cmd =>
    cmd.name.toLowerCase().includes(slashCommandFilter.toLowerCase())
  )

  const openSlashPanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      slashCommandOpen: true,
      slashCommandFilter: '',
      slashCommandIndex: 0,
    }))
  }, [setState])

  const closeSlashPanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      slashCommandOpen: false,
      slashCommandFilter: '',
      slashCommandIndex: 0,
    }))
  }, [setState])

  const updateFilter = useCallback((filter: string) => {
    setState(prev => ({
      ...prev,
      slashCommandFilter: filter,
      slashCommandIndex: 0,
    }))
  }, [setState])

  const navigateUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      slashCommandIndex: Math.max(0, prev.slashCommandIndex - 1),
    }))
  }, [setState])

  const navigateDown = useCallback(() => {
    setState(prev => ({
      ...prev,
      slashCommandIndex: Math.min(filteredCommands.length - 1, prev.slashCommandIndex + 1),
    }))
  }, [setState, filteredCommands.length])

  const selectCommand = useCallback((index?: number) => {
    const idx = index ?? slashCommandIndex
    const cmd = filteredCommands[idx]
    if (cmd) {
      // In a real app, this would execute the command
      closeSlashPanel()
    }
  }, [slashCommandIndex, filteredCommands, closeSlashPanel])

  return {
    slashCommandOpen,
    slashCommandFilter,
    slashCommandIndex,
    filteredCommands,
    openSlashPanel,
    closeSlashPanel,
    updateFilter,
    navigateUp,
    navigateDown,
    selectCommand,
  }
}
