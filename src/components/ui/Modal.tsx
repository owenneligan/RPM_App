import React, { useState, useRef, useCallback, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, GripHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useIsMobile } from '../../hooks/useIsMobile'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

const maxWidths: Record<string, number> = {
  sm: 384,
  md: 512,
  lg: 672,
  xl: 896,
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  footer,
}: ModalProps) {
  const isMobile = useIsMobile()

  // null = use CSS centering; once dragged, switch to absolute pixel coords
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset to centered whenever the modal opens
  useEffect(() => {
    if (open) setPos(null)
  }, [open])

  const onHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()

    const el = contentRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: rect.left,
      startPosY: rect.top,
    }
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startMouseX
      const dy = e.clientY - dragRef.current.startMouseY

      const el = contentRef.current
      if (!el) return
      const w = el.offsetWidth
      const h = el.offsetHeight
      const vw = window.innerWidth
      const vh = window.innerHeight

      const newX = Math.min(Math.max(dragRef.current.startPosX + dx, 0), vw - w)
      const newY = Math.min(Math.max(dragRef.current.startPosY + dy, 0), vh - h)

      setPos({ x: newX, y: newY })
    }

    const onUp = () => {
      setDragging(false)
      dragRef.current = null
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  // Touch swipe-to-close for mobile sheet
  const touchStartY = useRef<number | null>(null)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (deltaY > 60) onClose()
    touchStartY.current = null
  }, [onClose])

  const positionStyle: React.CSSProperties = pos
    ? { position: 'fixed', left: pos.x, top: pos.y, transform: 'none', margin: 0 }
    : { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', margin: 0 }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 fade-in"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
        />

        {isMobile ? (
          /* ── Mobile bottom sheet ── */
          <Dialog.Content
            ref={contentRef}
            className={cn(
              'z-[51]',
              'bg-white border border-[var(--border)]',
              'flex flex-col',
              'sheet-slide-up'
            )}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              borderRadius: '20px 20px 0 0',
              maxHeight: '90vh',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.14), 0 -2px 8px rgba(0,0,0,0.06)',
            }}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Drag handle pill */}
            <div
              className="flex justify-center pt-3 pb-1 shrink-0"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(0,0,0,0.18)',
                }}
              />
            </div>

            {/* Header */}
            {title && (
              <div
                className="flex items-start justify-between gap-3 px-6 pt-3 pb-4 shrink-0 select-none"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="min-w-0">
                  <Dialog.Title className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight">
                    {title}
                  </Dialog.Title>
                  {subtitle && (
                    <Dialog.Description className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {subtitle}
                    </Dialog.Description>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 p-1.5 rounded-[var(--radius-sm)] transition-all"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
              {children}
            </div>

            {/* Footer — safe-area aware */}
            {footer && (
              <div
                className="px-6 pt-4 flex items-center justify-end gap-2 shrink-0"
                style={{
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-base)',
                  borderRadius: '0',
                  paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                }}
              >
                {footer}
              </div>
            )}
          </Dialog.Content>
        ) : (
          /* ── Desktop centered + draggable ── */
          <Dialog.Content
            ref={contentRef}
            className={cn(
              'z-[51] rounded-[var(--radius-xl)]',
              'bg-white border border-[var(--border)]',
              'flex flex-col',
              'fade-up'
            )}
            style={{
              ...positionStyle,
              width: `min(calc(100vw - 2rem), ${maxWidths[size]}px)`,
              maxHeight: 'min(85vh, 700px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)',
            }}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Header — drag handle */}
            {title && (
              <div
                onMouseDown={onHeaderMouseDown}
                className={cn(
                  'flex items-start justify-between gap-3 px-6 pt-5 pb-4 shrink-0 select-none',
                  dragging ? 'cursor-grabbing' : 'cursor-grab'
                )}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-start gap-2 min-w-0">
                  <GripHorizontal
                    size={14}
                    className="mt-1 shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <div className="min-w-0">
                    <Dialog.Title className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight">
                      {title}
                    </Dialog.Title>
                    {subtitle && (
                      <Dialog.Description className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {subtitle}
                      </Dialog.Description>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 p-1.5 rounded-[var(--radius-sm)] transition-all"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.06)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
              {children}
            </div>

            {/* Footer — always pinned, never hidden */}
            {footer && (
              <div
                className="px-6 py-4 flex items-center justify-end gap-2 shrink-0"
                style={{
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-base)',
                  borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
                }}
              >
                {footer}
              </div>
            )}
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm rounded-[var(--radius)] transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className="h-9 px-4 text-sm rounded-[var(--radius)] font-medium transition-all border"
            style={
              danger
                ? {
                    background: 'rgba(179,92,68,0.08)',
                    color: 'var(--red)',
                    borderColor: 'rgba(179,92,68,0.22)',
                  }
                : {
                    background: '#2B4C7E',
                    color: 'white',
                    borderColor: 'transparent',
                  }
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
    </Modal>
  )
}
