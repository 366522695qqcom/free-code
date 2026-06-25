/**
 * Slash 命令面板 hook
 * 借鉴 src/hooks/useTextInput.ts 的键盘事件映射模式
 */
import { useCallback, useMemo } from 'react'
import { useWorkspaceState, useSetWorkspaceState } from '../state/store'
import { SLASH_COMMANDS, type SlashCommand } from '../types'

export function useSlashCommand() {
  const isOpen = useWorkspaceState(s => s.slashCommandOpen)
  const filter = useWorkspaceState(s => s.slashCommandFilter)
  const highlightIndex = useWorkspaceState(s => s.slashCommandIndex)
  const inputValue = useWorkspaceState(s => s.inputValue)
  const setState = useSetWorkspaceState()

  const filteredCommands: SlashCommand[] = useMemo(() => {
    if (!filter) return SLASH_COMMANDS
    return SLASH_COMMANDS.filter(c => c.command.startsWith(filter))
  }, [filter])

  const openPanel = useCallback(() => {
    setState(prev => ({ ...prev, slashCommandOpen: true, slashCommandFilter: '', slashCommandIndex: 0 }))
  }, [setState])

  const closePanel = useCallback(() => {
    setState(prev => ({ ...prev, slashCommandOpen: false, slashCommandFilter: '' }))
  }, [setState])

  /** 处理输入变化，检测 / 开头触发面板 */
  const handleInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, inputValue: value }))
    if (value.startsWith('/') && !prev.slashCommandOpen) {
      setState(prev => ({ ...prev, slashCommandOpen: true, slashCommandFilter: value, slashCommandIndex: 0 }))
    } else if (value.startsWith('/') && prev.slashCommandOpen) {
      setState(prev => ({ ...prev, slashCommandFilter: value, slashCommandIndex: 0 }))
    } else if (!value.startsWith('/') && prev.slashCommandOpen) {
      setState(prev => ({ ...prev, slashCommandOpen: false, slashCommandFilter: '' }))
    }
  }, [setState])

  /** 键盘导航 — 借鉴 useTextInput 的按键映射 */
  const handleKeyDown = useCallback((e: KeyboardEvent): boolean => {
    if (!isOpen) return false
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        slashCommandIndex: Math.min(prev.slashCommandIndex + 1, filteredCommands.length - 1),
      }))
      return true
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setState(prev => ({
        ...prev,
        slashCommandIndex: Math.max(prev.slashCommandIndex - 1, 0),
      }))
      return true
    }
    if (e.key === 'Enter' && filteredCommands[highlightIndex]) {
      e.preventDefault()
      const cmd = filteredCommands[highlightIndex]
      setState(prev => ({
        ...prev,
        slashCommandOpen: false,
        slashCommandFilter: '',
        inputValue: cmd.command + ' ',
      }))
      return true
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      closePanel()
      return true
    }
    return false
  }, [isOpen, filteredCommands, highlightIndex, setState, closePanel])

  const selectCommand = useCallback((cmd: SlashCommand) => {
    setState(prev => ({
      ...prev,
      slashCommandOpen: false,
      slashCommandFilter: '',
      inputValue: cmd.command + ' ',
    }))
  }, [setState])

  return {
    isOpen,
    filteredCommands,
    highlightIndex,
    inputValue,
    openPanel,
    closePanel,
    handleInput,
    handleKeyDown,
    selectCommand,
  }
}
