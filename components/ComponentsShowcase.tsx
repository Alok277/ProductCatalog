'use client'

import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { icons } from '@/assets'
import "./ComponentsShowcase.css"
import { GrFormEdit } from "react-icons/gr";


type FieldStatus = 'default' | 'success' | 'error' | 'disabled'

interface BaseProps {
  label: string
  placeholder: string
  status?: FieldStatus
  message?: string
  prefix?: string
  postfix?: string
  multiline?: boolean
  rows?: number
  maxLength?: number
  multiple?: boolean
  options?: string[]
}

const statusStyles: Record<FieldStatus, { border: string; focus: string; text: string; message: string }> = {
  default: {
    border: 'border-[#CED1D3]',
    focus: 'focus:ring-2 focus:ring-primary/60 focus:border-primary',
    text: 'text-[14181B]',
    message: 'text-gray-500',
  },
  success: {
    border: 'border-green-500',
    focus: 'focus:ring-2 focus:ring-green-400 focus:border-green-500',
    text: 'text-green-700',
    message: 'text-green-600',
  },
  error: {
    border: 'border-red-500',
    focus: 'focus:ring-2 focus:ring-red-400 focus:border-red-500',
    text: 'text-red-700',
    message: 'text-red-600',
  },
  disabled: {
    border: 'border-gray-200 bg-gray-50',
    focus: '',
    text: 'text-gray-400',
    message: 'text-gray-400',
  },
}

function TextFieldDemo({
  label,
  placeholder,
  status = 'default',
  message,
  prefix,
  postfix,
}: BaseProps) {
  const disabled = status === 'disabled'
  const styles = statusStyles[status]
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-[14181B]">{label}</label>
      <div
        className={`flex items-center gap-2 rounded-lg border ${styles.border} ${styles.focus} px-3 py-2 bg-white ${disabled ? 'opacity-80' : ''}`}
      >
        {prefix && <span className="text-xs font-semibold text-gray-500">{prefix}</span>}
        <input
          disabled={disabled}
          placeholder={placeholder}
          className={`flex-1 bg-transparent text-sm outline-none ${styles.text} placeholder:text-gray-400`}
        />
        {postfix && <span className="text-xs font-semibold text-gray-500">{postfix}</span>}
      </div>
      {message && <p className={`text-xs font-medium ${styles.message}`}>{message}</p>}
    </div>
  )
}

function TextAreaDemo({
  label,
  placeholder,
  status = 'default',
  message,
  rows = 3,
  maxLength = 100,
}: BaseProps) {
  const disabled = status === 'disabled'
  const styles = statusStyles[status]
  const [value, setValue] = useState('')
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-[14181B]">{label}</label>
      <div className={`rounded-lg border ${styles.border} ${styles.focus} bg-white ${disabled ? 'opacity-80' : ''}`}>
        <textarea
          disabled={disabled}
          rows={rows}
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full bg-transparent px-3 py-2 text-sm resize-none outline-none ${styles.text} placeholder:text-gray-400`}
        />
        <div className="flex items-center justify-between px-3 pb-2 text-xs text-gray-400">
          <span />
          <span>
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
      {message && <p className={`text-xs font-medium ${styles.message}`}>{message}</p>}
    </div>
  )
}

function SelectDemo({
  label,
  status = 'default',
  message,
  multiple,
  options = ['Option 1', 'Option 2', 'Option 3'],
}: BaseProps) {
  const disabled = status === 'disabled'
  const styles = statusStyles[status]
  const selectOptions = useMemo(
    () => options.map((opt) => ({ label: opt, value: opt })),
    [options]
  )
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  const toggleValue = (value: string) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    } else {
      setSelected([value])
      setOpen(false)
    }
  }

  const displayValue =
    selected.length === 0 ? 'Select' : multiple ? selected.join(', ') : selected[0]

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`relative w-full rounded-lg border ${styles.border} ${styles.focus} bg-white px-3 py-2 text-left ${styles.text} placeholder:text-gray-400 ${disabled ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-wrap items-center gap-2 pr-6">
            {selected.length === 0 && <span className="text-gray-400">{displayValue}</span>}
            {multiple &&
              selected.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
                >
                  {value}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleValue(value)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={`Remove ${value}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            {!multiple && selected.length === 1 && <span>{selected[0]}</span>}
          </div>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            ▾
          </span>
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg border border-gray-200 bg-white shadow-lg max-h-56 overflow-auto">
            {selectOptions.map((opt) => {
              const active = selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleValue(opt.value)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${active ? 'bg-primary/5 text-primary' : 'text-gray-700'}`}
                >
                  {opt.label}
                </button>
              )
            })}
            {selectOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No options</div>
            )}
          </div>
        )}
      </div>
      {message && <p className={`text-xs font-medium ${styles.message}`}>{message}</p>}
    </div>
  )
}

function DatePickerDemo({ state }: { state: FieldStatus }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const disabled = state === 'disabled'

  const openPicker = () => {
    if (disabled) return
    const el = inputRef.current
    // Prefer showPicker when available (Chromium)
    if (el && typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === 'function') {
      ;(el as HTMLInputElement & { showPicker?: () => void }).showPicker()
    } else if (el) {
      el.click()
    }
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-gray-800">Label</label>
      <div
        className={`flex items-center justify-between rounded-lg border px-3 py-2 bg-white ${
          statusStyles[state].border
        } ${disabled ? 'opacity-80' : ''}`}
      >
        <input
          ref={inputRef}
          className={`date-input w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          type="date"
          disabled={disabled}
          defaultValue={state === 'default' || disabled ? '' : '2025-12-12'}
        />
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="ml-3 flex h-5 w-5 items-center justify-center disabled:cursor-not-allowed"
          aria-label="Open date picker"
        >
          <Image
            src={icons.dateIcon}
            alt="date-icon"
            width={20}
            height={20}
            className="opacity-70 pointer-events-none select-none text-[#14181B]"
          />
        </button>
      </div>
      {state === 'success' && <p className="text-xs font-medium text-green-600">Message</p>}
      {state === 'error' && <p className="text-xs font-medium text-red-600">Message</p>}
    </div>
  )
}

function SearchDemo({ 
  status = 'default',
  showClear = false,
  isFocused = false,
  defaultValue = ''
}: { 
  status?: FieldStatus
  showClear?: boolean
  isFocused?: boolean
  defaultValue?: string
}) {
  const disabled = status === 'disabled'
  const styles = statusStyles[status]
  const [searchValue, setSearchValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus if isFocused prop is true
  useEffect(() => {
    if (isFocused && inputRef.current && !disabled) {
      // Use setTimeout to ensure it focuses after render
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isFocused, disabled])

  const handleClear = () => {
    if (disabled) return
    setSearchValue('')
    inputRef.current?.focus()
  }

  // Determine border style - if focused, use primary border
  const borderStyle = isFocused && !disabled 
    ? 'border-primary' 
    : styles.border
  const focusStyle = isFocused && !disabled
    ? 'ring-2 ring-primary/60'
    : styles.focus

  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 rounded-lg border ${borderStyle} ${focusStyle} px-3 py-2 bg-white ${disabled ? 'opacity-80' : ''}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={disabled ? 'text-gray-400' : 'text-gray-500'}
        >
          <path
            d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 14L11.1 11.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`flex-1 bg-transparent text-sm outline-none ${styles.text} placeholder:text-gray-400`}
        />
        {showClear && searchValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

interface UploadedFile {
  id: string
  file: File
  isValid: boolean
}

function FileUploadDemo({ 
  status = 'default', 
  variant = 'browse' 
}: { 
  status?: FieldStatus
  variant?: 'browse' | 'dragdrop'
}) {
  const disabled = status === 'disabled'
  const styles = statusStyles[status]
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [hasError, setHasError] = useState(false)

  const acceptedTypes = ['.png', '.jpg', '.pdf']
  const acceptedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf']

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    return acceptedTypes.includes(extension) || acceptedMimeTypes.includes(file.type)
  }

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      isValid: validateFile(file),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    
    // Set error state if any file is invalid
    const hasInvalidFile = newFiles.some((f) => !f.isValid)
    if (hasInvalidFile) {
      setHasError(true)
    } else if (status === 'default') {
      setHasError(false)
    }
  }, [status])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    handleFiles(e.target.files)
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return
    // Only set dragging to false if we're leaving the drop zone itself, not child elements
    const currentTarget = e.currentTarget as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!currentTarget.contains(relatedTarget)) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleRemoveFile = (id: string) => {
    if (disabled) return
    setUploadedFiles((prev) => {
      const remaining = prev.filter((f) => f.id !== id)
      // Check if there are any invalid files remaining
      const hasInvalid = remaining.some((f) => !f.isValid)
      setHasError(hasInvalid)
      return remaining
    })
  }

  const handlePreview = (file: UploadedFile) => {
    if (disabled || !file.isValid) return
    // Create object URL for preview
    const url = URL.createObjectURL(file.file)
    window.open(url, '_blank')
    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  const displayStatus = hasError ? 'error' : status === 'success' && uploadedFiles.length > 0 && uploadedFiles.every(f => f.isValid) ? 'success' : status
  const displayStyles = statusStyles[displayStatus]

  if (variant === 'browse') {
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800">Label</label>
          <p className="text-xs text-gray-500">Accepts .png, .jpg, .pdf</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.pdf,image/png,image/jpeg,application/pdf"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={handleBrowseClick}
            className={`w-full rounded-lg border px-4 py-2 flex items-center justify-center gap-2 bg-white ${
              displayStyles.border
            } ${disabled ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={disabled ? 'opacity-50' : ''}
            >
              <path
                d="M8 2V10M8 2L5 5M8 2L11 5M3 10V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Browse</span>
          </button>
        </div>
        {uploadedFiles.map((uploadedFile) => (
          <div
            key={uploadedFile.id}
            className={`rounded-lg border bg-gray-50 px-3 py-2 flex items-center justify-between ${
              disabled ? 'text-gray-400 border-gray-200' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>📄</span>
              <div className="text-sm leading-tight">
                <p>{uploadedFile.file.name}</p>
                <button
                  onClick={() => handlePreview(uploadedFile)}
                  className="text-primary text-xs hover:underline"
                  disabled={disabled || !uploadedFile.isValid}
                >
                  Preview
                </button>
              </div>
            </div>
            {!disabled && (
              <button
                onClick={() => handleRemoveFile(uploadedFile.id)}
                className="text-gray-500 hover:text-gray-700 text-sm"
                aria-label="Remove file"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {displayStatus === 'success' && uploadedFiles.length > 0 && uploadedFiles.every(f => f.isValid) && (
          <p className="text-xs font-medium text-green-600">Upload complete</p>
        )}
        {displayStatus === 'error' && (
          <p className="text-xs font-medium text-red-600">Upload failed. Invalid file format</p>
        )}
      </div>
    )
  }

  // Drag and drop variant
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-800">Label</label>
        <p className="text-xs text-gray-500">Accepts .png, .jpg, .pdf</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.pdf,image/png,image/jpeg,application/pdf"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center gap-4 bg-white transition-colors ${
            isDragging && !disabled
              ? 'border-primary bg-primary/5'
              : displayStyles.border.replace('border-', 'border-dashed border-')
          } ${disabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
          onClick={handleBrowseClick}
        >
          <span className="text-4xl">📁</span>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Drag and drop here or browse files</p>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                handleBrowseClick()
              }}
              className={`px-6 py-2 rounded-lg font-medium text-sm ${
                disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Browse
            </button>
          </div>
        </div>
      </div>
      {uploadedFiles.map((uploadedFile) => (
        <div
          key={uploadedFile.id}
          className={`rounded-lg border bg-gray-50 px-3 py-2 flex items-center justify-between ${
            disabled ? 'text-gray-400 border-gray-200' : 'text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>📄</span>
            <div className="text-sm leading-tight">
              <p>{uploadedFile.file.name}</p>
              <button
                onClick={() => handlePreview(uploadedFile)}
                className="text-primary text-xs hover:underline"
                disabled={disabled || !uploadedFile.isValid}
              >
                Preview
              </button>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={() => handleRemoveFile(uploadedFile.id)}
              className="text-gray-500 hover:text-gray-700 text-sm"
              aria-label="Remove file"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {displayStatus === 'success' && uploadedFiles.length > 0 && uploadedFiles.every(f => f.isValid) && (
        <p className="text-xs font-medium text-green-600">Upload complete</p>
      )}
      {displayStatus === 'error' && (
        <p className="text-xs font-medium text-red-600">Upload failed. Invalid file format</p>
      )}
    </div>
  )
}

// Toggle Component
function ToggleDemo({ 
  checked = false, 
  isFocused = false, 
  disabled = false 
}: { 
  checked?: boolean
  isFocused?: boolean
  disabled?: boolean
}) {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleToggle = () => {
    if (!disabled) {
      setIsChecked(!isChecked)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          disabled
            ? isChecked
              ? 'bg-blue-200 cursor-not-allowed'
              : 'bg-gray-200 cursor-not-allowed'
            : isChecked
            ? 'bg-blue-600'
            : 'bg-gray-300'
        } ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? 'translate-x-6' : 'translate-x-1'
          } ${isFocused ? 'ring-2 ring-blue-400' : ''}`}
        />
      </button>
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>Toggle</span>
    </div>
  )
}

// RadioButton Component
function RadioButtonDemo({ 
  checked = false, 
  isFocused = false, 
  disabled = false 
}: { 
  checked?: boolean
  isFocused?: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        className={`h-4 w-4 cursor-pointer appearance-none rounded-full border-2 transition-all ${
          disabled
            ? checked
              ? 'border-gray-400 bg-gray-400'
              : 'border-gray-300 bg-transparent'
            : checked
            ? 'border-blue-600 bg-blue-600'
            : 'border-gray-300 bg-transparent'
        } ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        style={{
          backgroundImage: checked
            ? `radial-gradient(circle, white 30%, transparent 30%)`
            : 'none',
        }}
      />
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>Radiobutton</span>
    </div>
  )
}

// Radio Icon Component (standalone)
function RadioIconDemo({ 
  checked = false 
}: { 
  checked?: boolean
}) {
  return (
    <input
      type="radio"
      checked={checked}
      className={`h-4 w-4 cursor-pointer appearance-none rounded-full border-2 transition-all ${
        checked
          ? 'border-blue-600 bg-blue-600'
          : 'border-gray-300 bg-transparent'
      }`}
      style={{
        backgroundImage: checked
          ? `radial-gradient(circle, white 30%, transparent 30%)`
          : 'none',
      }}
    />
  )
}

// Checkbox Component
function CheckboxDemo({ 
  checked = false,
  indeterminate = false,
  isFocused = false,
  disabled = false
}: { 
  checked?: boolean
  indeterminate?: boolean
  isFocused?: boolean
  disabled?: boolean
}) {
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const getCheckboxStyle = () => {
    if (disabled) {
      if (checked || indeterminate) {
        return 'border-gray-400 bg-gray-400'
      }
      return 'border-gray-300 bg-transparent'
    }
    if (checked || indeterminate) {
      return 'border-blue-600 bg-blue-600'
    }
    return 'border-gray-300 bg-transparent'
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked && !indeterminate}
          disabled={disabled}
          className={`h-4 w-4 cursor-pointer appearance-none rounded border-2 transition-all ${getCheckboxStyle()} ${
            isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''
          }`}
        />
        {(checked || indeterminate) && (
          <span
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
              disabled ? 'text-white' : 'text-white'
            }`}
          >
            {indeterminate ? (
              <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                <rect width="10" height="2" rx="1" />
              </svg>
            ) : (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        )}
      </div>
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>Checkbox</span>
    </div>
  )
}

// Check Icon Component (standalone)
function CheckIconDemo({ 
  checked = false,
  indeterminate = false
}: { 
  checked?: boolean
  indeterminate?: boolean
}) {
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const getCheckboxStyle = () => {
    if (checked || indeterminate) {
      return 'border-blue-600 bg-blue-600'
    }
    return 'border-gray-300 bg-transparent'
  }

  return (
    <div className="relative">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked && !indeterminate}
        className={`h-4 w-4 cursor-pointer appearance-none rounded border-2 transition-all ${getCheckboxStyle()}`}
      />
      {(checked || indeterminate) && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          {indeterminate ? (
            <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
              <rect width="10" height="2" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      )}
    </div>
  )
}

// Button Component
function ButtonDemo({ 
  variant = 'text',
  color = 'gray',
  state = 'default',
  label = 'Button'
}: { 
  variant?: 'text' | 'icon'
  color?: 'gray' | 'light-gray' | 'blue' | 'red' | 'white'
  state?: 'default' | 'focused' | 'solid'
  label?: string
}) {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-lg font-medium transition-colors focus:outline-none'
    
    if (variant === 'icon') {
      const sizeClasses = 'h-10 w-10 p-0 flex items-center justify-center'
      const colorClasses = {
        gray: state === 'solid' ? 'bg-gray-800 text-white' : 'bg-gray-800 text-white',
        'light-gray': 'bg-white border border-gray-300 text-gray-700',
        blue: state === 'solid' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-400 text-blue-600',
        red: 'bg-red-600 text-white',
        white: 'bg-white border border-gray-300 text-gray-700',
      }[color]
      const focusClasses = state === 'focused' ? 'ring-2 ring-blue-500 border-blue-500' : ''
      return `${baseClasses} ${sizeClasses} ${colorClasses} ${focusClasses}`
    } else {
      // Text button
      const sizeClasses = 'px-4 py-2'
      const colorClasses = {
        gray: state === 'solid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white',
        'light-gray': state === 'solid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
        blue: state === 'solid' ? 'bg-blue-600 text-white' : 'bg-blue-400 text-white',
        red: 'bg-red-600 text-white',
        white: state === 'solid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700',
      }[color]
      const focusClasses = state === 'focused' ? 'ring-2 ring-blue-500 border-blue-500' : ''
      return `${baseClasses} ${sizeClasses} ${colorClasses} ${focusClasses}`
    }
  }

  return (
    <button className={getButtonClasses()}>
      {variant === 'icon' ? (
        <span className="text-xls" aria-hidden="true">
          <GrFormEdit />
        </span>
      ) : (
        label
      )}
    </button>
  )
}

// Circular Button with C icon
function CircularButtonDemo({ 
  color = 'gray',
  state = 'default'
}: { 
  color?: 'gray' | 'light-gray' | 'blue' | 'red' | 'white'
  state?: 'default' | 'focused'
}) {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-full h-10 w-10 p-0 flex items-center justify-center font-medium transition-colors focus:outline-none'
    const colorClasses = {
      gray: 'bg-gray-800 text-white',
      'light-gray': 'bg-white border border-gray-300 text-gray-700',
      blue: 'bg-blue-400 text-white',
      red: 'bg-red-600 text-white',
      white: state === 'focused' ? 'bg-white border border-blue-400 text-blue-600' : 'bg-white border border-gray-300 text-gray-700',
    }[color]
    const focusClasses = state === 'focused' ? 'ring-2 ring-blue-500 border-blue-500' : ''
    return `${baseClasses} ${colorClasses} ${focusClasses}`
  }

  return (
    <button className={getButtonClasses()}>
      <span className="text-lg font-bold">C</span>
    </button>
  )
}

type ToastVariant = 'info' | 'success' | 'warning' | 'error'

function ToastDemo({
  variant = 'info',
  withDescription = false,
}: {
  variant?: ToastVariant
  withDescription?: boolean
}) {
  const variantStyles: Record<
    ToastVariant,
    { iconClass: string; iconSymbol: string; bgClass: string }
  > = {
    info: {
      iconClass: 'border border-gray-400 text-gray-200',
      iconSymbol: 'i',
      bgClass: 'bg-gray-500 bg-opacity-20',
    },
    success: {
      iconClass: 'border border-green-500 text-green-400',
      iconSymbol: '✓',
      bgClass: 'bg-green-500 bg-opacity-20',
    },
    warning: {
      iconClass: 'border border-yellow-500 text-yellow-300',
      iconSymbol: '!',
      bgClass: 'bg-yellow-500 bg-opacity-20',
    },
    error: {
      iconClass: 'border border-red-500 text-red-400',
      iconSymbol: '!',
      bgClass: 'bg-red-500 bg-opacity-20',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="flex items-center justify-between rounded-lg bg-[#14181B] px-4 py-2 text-white shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex justify-center items-center w-8 h-8 ${styles.bgClass} rounded-lg`}>
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full bg-transparent ${styles.iconClass}`}
        >
          <span className="text-xs font-bold">{styles.iconSymbol}</span>
        </div>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Title</p>
          {withDescription && (
            <p className="mt-0.5 text-xs text-gray-300">Description</p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="ml-4 text-sm text-gray-300 hover:text-white"
        aria-label="Close toast"
      >
        ✕
      </button>
    </div>
  )
}

type StepStatus = 'done' | 'current' | 'upcoming' | 'disabled'

function StepperDot({ 
  status, 
  stepNumber = 1 
}: { 
  status: StepStatus
  stepNumber?: number
}) {
  const isDone = status === 'done'
  const isCurrent = status === 'current'
  const isDisabled = status === 'disabled'

  const base =
    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'

  if (isDisabled) {
    return (
      <div className={`${base} border-2 border-gray-300 bg-white text-gray-400`}>
        {stepNumber}
      </div>
    )
  }

  if (isDone) {
    return (
      <div className={`${base} bg-green-500 text-white`}>
        ✓
      </div>
    )
  }

  if (isCurrent) {
    return (
      <div className={`${base} bg-green-500 text-white`}>
        {stepNumber}
      </div>
    )
  }

  // upcoming
  return (
    <div className={`${base} border-2 border-gray-300 bg-white text-gray-600`}>
      {stepNumber}
    </div>
  )
}

function HorizontalStepper({ steps }: { steps: Array<{ status: StepStatus; stepNumber: number }> }) {
  return (
    <div className="flex items-start gap-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.status === 'done' || (step.status === 'current' && index > 0)
        const lineColor = isCompleted ? 'bg-green-500' : 'bg-gray-300'

        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <StepperDot status={step.status} stepNumber={step.stepNumber} />
              {!isLast && (
                <div className={`h-0.5 w-16 ${lineColor} mt-3`} />
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <p className="text-sm font-bold text-gray-900">Step</p>
              <p className="text-xs text-gray-500">Description</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VerticalStepper({ steps }: { steps: Array<{ status: StepStatus; stepNumber: number }> }) {
  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.status === 'done' || (step.status === 'current' && index > 0)
        const lineColor = isCompleted ? 'bg-green-500' : 'bg-gray-300'

        return (
          <div key={index} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <StepperDot status={step.status} stepNumber={step.stepNumber} />
              {!isLast && (
                <div className={`w-0.5 h-8 ${lineColor} mt-2`} />
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <p className="text-sm font-bold text-gray-900">Step</p>
              <p className="text-xs text-gray-500">Description</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VerticalStepperWithStatus({ steps }: { steps: Array<{ status: StepStatus; stepNumber: number; hasSubSteps?: boolean; subSteps?: Array<{ status: StepStatus }> }> }) {
  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.status === 'done' || (step.status === 'current' && index > 0)
        const lineColor = isCompleted ? 'bg-green-500' : 'bg-gray-300'

        return (
          <div key={index}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <StepperDot status={step.status} stepNumber={step.stepNumber} />
                {!isLast && (
                  <div className={`w-0.5 h-8 ${lineColor} mt-2`} />
                )}
              </div>
              <div className="flex flex-col pt-0.5">
                <p className="text-sm font-bold text-gray-900">Step</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
                  Status
                </span>
              </div>
            </div>
            {step.hasSubSteps && step.subSteps && (
              <div className="ml-9 mt-2 flex flex-col gap-3">
                {step.subSteps.map((subStep, subIndex) => {
                  const isSubLast = subIndex === step.subSteps!.length - 1
                  const isSubCompleted = subStep.status === 'done'
                  const isSubDotted = subStep.status === 'upcoming'
                  const subLineColor = isSubCompleted ? 'bg-green-500' : isSubDotted ? 'bg-gray-300' : 'bg-green-500'

                  return (
                    <div key={subIndex} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        {subStep.status === 'done' ? (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                            <span className="text-[10px] text-white">✓</span>
                          </div>
                        ) : subStep.status === 'current' ? (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-green-500 bg-white" />
                        ) : (
                          <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${isSubDotted ? 'border-dashed border-gray-300' : 'border-gray-300'} bg-white`} />
                        )}
                        {!isSubLast && (
                          <div 
                            className={`w-0.5 h-6 ${subLineColor} mt-1`}
                            style={isSubDotted ? { 
                              backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgb(209 213 219) 2px, rgb(209 213 219) 4px)',
                              backgroundSize: '2px 4px'
                            } : {}}
                          />
                        )}
                      </div>
                      <div className="flex flex-col pt-0.5">
                        <p className="text-xs text-gray-500">Sub step</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepperItem({
  label = 'Step',
  description = 'Description',
  status = 'upcoming',
  stepNumber = 1,
  orientation = 'horizontal'
}: {
  label?: string
  description?: string
  status?: StepStatus
  stepNumber?: number
  orientation?: 'horizontal' | 'vertical'
}) {
  const isDisabled = status === 'disabled'
  const textColor = isDisabled ? 'text-gray-400' : 'text-gray-900'
  const descColor = isDisabled ? 'text-gray-300' : 'text-gray-500'

  if (orientation === 'vertical') {
    return (
      <div className="flex items-start gap-3">
        <StepperDot status={status} stepNumber={stepNumber} />
        <div className="flex flex-col pt-0.5">
          <p className={`text-sm font-bold ${textColor}`}>{label}</p>
          <p className={`text-xs ${descColor}`}>{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <StepperDot status={status} stepNumber={stepNumber} />
      <div className="flex flex-col items-center">
        <p className={`text-sm font-bold ${textColor}`}>{label}</p>
        <p className={`text-xs ${descColor}`}>{description}</p>
      </div>
    </div>
  )
}

// Table Components
function TableHeaderInput({ 
  label = 'Bot Name', 
  sortDirection = 'none' 
}: { 
  label?: string
  sortDirection?: 'up' | 'down' | 'none'
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
        <input
          type="text"
          placeholder={label}
          className="flex-1 text-sm outline-none"
        />
        {sortDirection === 'down' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
          </svg>
        )}
        {sortDirection === 'up' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7.5L6 4.5L9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
          </svg>
        )}
      </div>
    </div>
  )
}

function TableRowCell({ 
  type = 'text',
  content = 'Text',
  avatar = false,
  tag = false,
  tagCount = 12,
  link = false,
  masked = false,
  checkbox = false,
  checked = false
}: {
  type?: 'text' | 'avatar' | 'tag' | 'status' | 'link' | 'masked' | 'checkbox'
  content?: string
  avatar?: boolean
  tag?: boolean
  tagCount?: number
  link?: boolean
  masked?: boolean
  checkbox?: boolean
  checked?: boolean
}) {
  if (type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={checked}
          className="h-4 w-4 rounded border-gray-300 checked:border-blue-600 checked:bg-blue-600" 
        />
      </div>
    )
  }

  if (type === 'link') {
    return (
      <div className="text-sm text-blue-600">{content}</div>
    )
  }

  if (type === 'masked') {
    return (
      <div className="text-sm text-gray-700">{content}</div>
    )
  }

  if (type === 'avatar') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
        <span className="text-sm text-gray-700">{content}</span>
      </div>
    )
  }

  if (type === 'tag') {
    return (
      <div className="flex items-center gap-2">
        {tag && (
          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700">
            Tag +{tagCount}
          </span>
        )}
      </div>
    )
  }

  if (type === 'status') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full border-2 border-blue-600"></div>
        <span className="text-sm text-gray-700">{content}</span>
      </div>
    )
  }

  return (
    <div className="text-sm text-gray-700">{content}</div>
  )
}

function MetricsCard({ 
  title = 'Messages sent',
  value = '237k',
  trend = 'up',
  trendValue = '50%',
  period = 'this week'
}: {
  title?: string
  value?: string
  trend?: 'up' | 'down'
  trendValue?: string
  period?: string
}) {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600'
  const arrowPath = trend === 'up' 
    ? 'M8 4L12 8L8 12M12 8H4'
    : 'M8 12L4 8L8 4M4 8H12'

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d={arrowPath} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{trend === 'up' ? '↑' : '↓'} {trendValue} {period}</span>
      </div>
    </div>
  )
}

function TrendIndicator({ 
  trend = 'up',
  value = '50%',
  period = 'this week'
}: {
  trend?: 'up' | 'down'
  value?: string
  period?: string
}) {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600'
  const arrowPath = trend === 'up' 
    ? 'M8 4L12 8L8 12M12 8H4'
    : 'M8 12L4 8L8 4M4 8H12'

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d={arrowPath} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{trend === 'up' ? '↑' : '↓'} {value} {period}</span>
      </div>
    </div>
  )
}

function TableHeader({ title = 'All users' }: { title?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
    </div>
  )
}

function TableFooter({ 
  start = 1,
  end = 10,
  total = 245
}: {
  start?: number
  end?: number
  total?: number
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
      <p className="text-sm text-gray-600">Showing {start} to {end} of {total} results</p>
    </div>
  )
}

function TablePagination({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-4 items-center">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input type="radio" name="pagination" className="h-4 w-4" defaultChecked={idx === 0} />
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm">
            <option>10 Entries</option>
          </select>
        </div>
      ))}
    </div>
  )
}

function TableFilter({ count = 3, value = 'Fruit, Apple' }: { count?: number; value?: string }) {
  return (
    <div className="flex gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <select key={idx} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
          <option>{value}</option>
        </select>
      ))}
    </div>
  )
}

function BreadcrumbDemo() {
  const crumbs = ['Title', 'Title', 'Title']

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-900">Title</p>
      <p className="text-sm text-gray-800">
        {crumbs[0]} <span className="text-gray-400">›</span>{' '}
        <span className="font-semibold">{crumbs[1]}</span>
      </p>
      <p className="text-sm text-gray-800">
        {crumbs[0]} <span className="text-gray-400">›</span> {crumbs[1]}{' '}
        <span className="text-gray-400">›</span>{' '}
        <span className="font-semibold">{crumbs[2]}</span>
      </p>
      <p className="text-sm text-gray-800">
        {crumbs[0]} <span className="text-gray-400">›</span>{' '}
        <span className="text-gray-400">…</span>{' '}
        <span className="font-semibold">{crumbs[2]}</span>
      </p>
    </div>
  )
}

function BreadcrumbItemDemo() {
  const items = [
    { label: 'Title', active: false, hasMenu: true },
    { label: 'Title', active: false, hasMenu: true },
    { label: 'Title', active: false, hasMenu: true },
    { label: 'Title', active: true, hasMenu: true },
    { label: 'Title', active: false, hasMenu: true, disabled: true },
    { label: 'Title', active: false, hasMenu: false },
  ]

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const baseItemClasses =
          'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm'
        const activeClasses = item.active
          ? 'border border-blue-500 bg-blue-50 text-blue-700'
          : item.disabled
          ? 'text-gray-300'
          : 'text-gray-800'

        return (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg px-2 py-1"
          >
            <button
              type="button"
              disabled={item.disabled}
              className={`${baseItemClasses} ${activeClasses}`}
            >
              <span>{item.label}</span>
              {!item.active && !item.disabled && (
                <span className="text-gray-400">›</span>
              )}
            </button>
            {item.hasMenu && (
              <button
                type="button"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm ${
                  item.active
                    ? 'border-blue-500 text-blue-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                …
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

type TabStatus = 'default' | 'active' | 'disabled' | 'outlined'

function TabItem({
  label = 'Tab title',
  status = 'default',
}: {
  label?: string
  status?: TabStatus
}) {
  const isActive = status === 'active'
  const isDisabled = status === 'disabled'
  const isOutlined = status === 'outlined'

  const textColor = isDisabled
    ? 'text-gray-300'
    : isActive
    ? 'text-gray-900 font-semibold'
    : 'text-gray-700'

  const underline =
    isActive && !isOutlined ? (
      <div className="mt-1 h-0.5 w-full bg-gray-900" />
    ) : null

  const outlinedClasses = isOutlined
    ? 'border border-blue-500 bg-blue-50'
    : isDisabled
    ? 'bg-gray-50'
    : ''

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`flex flex-col items-center rounded-lg px-3 py-1.5 ${outlinedClasses}`}
    >
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full border border-gray-400" />
        <span className={`text-sm ${textColor}`}>{label}</span>
      </div>
      {underline}
    </button>
  )
}

function TabsRow() {
  return (
    <div className="flex gap-6">
      <TabItem status="active" />
      <TabItem />
      <TabItem />
      <TabItem />
    </div>
  )
}

export default function ComponentsShowcase() {
  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Textfield</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TextFieldDemo label="Label" placeholder="Placeholder text" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" status="success" message="Message" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" status="error" message="Message" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" status="disabled" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" prefix="Pre" />
          <TextFieldDemo label="Label" placeholder="Placeholder text" postfix="Post" />
          <TextFieldDemo
            label="Label"
            placeholder="Placeholder text"
            prefix="Pre"
            postfix="Post"
            status="success"
            message="Message"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Textarea</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TextAreaDemo label="Label" placeholder="Placeholder text" />
          <TextAreaDemo label="Label" placeholder="Placeholder text" />
          <TextAreaDemo label="Label" placeholder="Placeholder text" />
          <TextAreaDemo label="Label" placeholder="Placeholder text" status="success" message="Message" />
          <TextAreaDemo label="Label" placeholder="Placeholder text" status="error" message="Message" />
          <TextAreaDemo label="Label" placeholder="Placeholder text" status="disabled" />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Dropdown</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SelectDemo label="Label" placeholder="Select" />
          <SelectDemo label="Label" placeholder="Select" multiple />
          <SelectDemo label="Label" placeholder="Select" status="success" message="Message" />
          <SelectDemo label="Label" placeholder="Select" status="success" message="Message" multiple />
          <SelectDemo label="Label" placeholder="Select" status="error" message="Message" />
          <SelectDemo label="Label" placeholder="Select" status="error" message="Message" multiple />
          <SelectDemo label="Label" placeholder="Select" status="disabled" />
          <SelectDemo label="Label" placeholder="Select" status="disabled" multiple />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Picker</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(['default', 'success', 'error', 'disabled'] as const).map((state) => (
            <DatePickerDemo key={state} state={state} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">File Upload</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Browse variant - first row */}
          {(['default', 'success', 'error', 'disabled'] as const).map((state) => (
            <FileUploadDemo key={`browse-${state}`} status={state} variant="browse" />
          ))}
          {/* Drag and drop variant - second row */}
          {(['default', 'success', 'error', 'disabled'] as const).map((state) => (
            <FileUploadDemo key={`dragdrop-${state}`} status={state} variant="dragdrop" />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Slider</h2>
        </div>
        <div className="space-y-6">
          {[50, 50, 50, 75, 75, 50].map((val, idx) => {
            const disabled = idx === 2 || idx === 5
            const accent = idx === 4
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="relative w-full">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={val}
                    disabled={disabled}
                    className={`w-full cursor-pointer accent-primary ${
                      disabled ? 'opacity-50' : accent ? 'accent-secondary' : 'accent-primary'
                    }`}
                  />
                  {!disabled && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-2 py-1 rounded">
                      {val}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Toggle</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {/* Row 1: Off, On */}
          <ToggleDemo checked={false} />
          <ToggleDemo checked={true} />
          
          {/* Row 2: Off (darker), On (darker) */}
          <ToggleDemo checked={false} />
          <ToggleDemo checked={true} />
          
          {/* Row 3: Off (focused), On (focused) */}
          <ToggleDemo checked={false} isFocused={true} />
          <ToggleDemo checked={true} isFocused={true} />
          
          {/* Row 4: Disabled Off, Disabled On */}
          <ToggleDemo checked={false} disabled={true} />
          <ToggleDemo checked={true} disabled={true} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Radiobutton</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {/* Row 1: Unselected, Selected */}
          <RadioButtonDemo checked={false} />
          <RadioButtonDemo checked={true} />
          
          {/* Row 2: Unselected, Selected */}
          <RadioButtonDemo checked={false} />
          <RadioButtonDemo checked={true} />
          
          {/* Row 3: Unselected (focused), Selected (focused) */}
          <RadioButtonDemo checked={false} isFocused={true} />
          <RadioButtonDemo checked={true} isFocused={true} />
          
          {/* Row 4: Disabled Unselected, Disabled Selected */}
          <RadioButtonDemo checked={false} disabled={true} />
          <RadioButtonDemo checked={true} disabled={true} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">.Radio Icon</h2>
        </div>
        <div className="flex gap-6">
          <RadioIconDemo checked={false} />
          <RadioIconDemo checked={true} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Checkbox</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-3">
          {/* Row 1: Unchecked, Indeterminate, Checked */}
          <CheckboxDemo checked={false} />
          <CheckboxDemo indeterminate={true} />
          <CheckboxDemo checked={true} />
          
          {/* Row 2: Unchecked, Indeterminate, Checked */}
          <CheckboxDemo checked={false} />
          <CheckboxDemo indeterminate={true} />
          <CheckboxDemo checked={true} />
          
          {/* Row 3: Unchecked (focused), Indeterminate (focused), Checked (focused) */}
          <CheckboxDemo checked={false} isFocused={true} />
          <CheckboxDemo indeterminate={true} isFocused={true} />
          <CheckboxDemo checked={true} isFocused={true} />
          
          {/* Row 4: Disabled Unchecked, Disabled Indeterminate, Disabled Checked */}
          <CheckboxDemo checked={false} disabled={true} />
          <CheckboxDemo indeterminate={true} disabled={true} />
          <CheckboxDemo checked={true} disabled={true} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">.Check</h2>
        </div>
        <div className="flex gap-6">
          <CheckIconDemo checked={false} />
          <CheckIconDemo indeterminate={true} />
          <CheckIconDemo checked={true} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Button</h2>
        </div>
        <div className="grid gap-6 grid-cols-7">
          {/* Row 1: Text Buttons - Gray */}
          <ButtonDemo variant="text" color="gray" state="default" />
          <ButtonDemo variant="text" color="gray" state="default" />
          <ButtonDemo variant="text" color="gray" state="default" />
          <ButtonDemo variant="text" color="gray" state="default" />
          <ButtonDemo variant="text" color="gray" state="focused" />
          <ButtonDemo variant="text" color="gray" state="solid" />
          <CircularButtonDemo color="gray" />
          
          {/* Row 2: Text Buttons - Light Gray */}
          <ButtonDemo variant="text" color="light-gray" state="default" />
          <ButtonDemo variant="text" color="light-gray" state="default" />
          <ButtonDemo variant="text" color="light-gray" state="default" />
          <ButtonDemo variant="text" color="light-gray" state="focused" />
          <ButtonDemo variant="text" color="light-gray" state="default" />
          <ButtonDemo variant="text" color="white" state="focused" />
          <CircularButtonDemo color="light-gray" />
          
          {/* Row 3: Text Buttons - Blue */}
          <ButtonDemo variant="text" color="blue" state="default" />
          <ButtonDemo variant="text" color="blue" state="default" />
          <ButtonDemo variant="text" color="blue" state="default" />
          <ButtonDemo variant="text" color="blue" state="focused" />
          <ButtonDemo variant="text" color="blue" state="default" />
          <ButtonDemo variant="text" color="white" state="focused" />
          <CircularButtonDemo color="blue" />
          
          {/* Row 4: Text Buttons - Red */}
          <ButtonDemo variant="text" color="red" state="default" />
          <ButtonDemo variant="text" color="red" state="default" />
          <ButtonDemo variant="text" color="red" state="default" />
          <ButtonDemo variant="text" color="red" state="focused" />
          <ButtonDemo variant="text" color="red" state="default" />
          <ButtonDemo variant="text" color="white" state="focused" />
          <CircularButtonDemo color="red" />
          
          {/* Row 5: Icon Buttons - Gray */}
          <ButtonDemo variant="icon" color="gray" state="default" />
          <ButtonDemo variant="icon" color="gray" state="default" />
          <ButtonDemo variant="icon" color="gray" state="default" />
          <ButtonDemo variant="icon" color="gray" state="focused" />
          <ButtonDemo variant="icon" color="gray" state="default" />
          <ButtonDemo variant="icon" color="gray" state="solid" />
          <CircularButtonDemo color="gray" />
          
          {/* Row 6: Icon Buttons - White with border */}
          <ButtonDemo variant="icon" color="white" state="default" />
          <ButtonDemo variant="icon" color="white" state="default" />
          <ButtonDemo variant="icon" color="white" state="default" />
          <ButtonDemo variant="icon" color="white" state="focused" />
          <ButtonDemo variant="icon" color="white" state="default" />
          <ButtonDemo variant="icon" color="white" state="focused" />
          <CircularButtonDemo color="light-gray" />
          
          {/* Row 7: Icon Buttons - Blue border */}
          <ButtonDemo variant="icon" color="blue" state="default" />
          <ButtonDemo variant="icon" color="blue" state="default" />
          <ButtonDemo variant="icon" color="blue" state="default" />
          <ButtonDemo variant="icon" color="blue" state="default" />
          <ButtonDemo variant="icon" color="blue" state="default" />
          <ButtonDemo variant="icon" color="blue" state="default" />
          <CircularButtonDemo color="white" state="focused" />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Toast</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <ToastDemo variant="info" />
            <ToastDemo variant="success" />
            <ToastDemo variant="warning" />
            <ToastDemo variant="error" />
          </div>
          <div className="space-y-3">
            <ToastDemo variant="info" withDescription />
            <ToastDemo variant="success" withDescription />
            <ToastDemo variant="warning" withDescription />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Stepper</h2>
        </div>
        <div className="space-y-8">
          {/* Horizontal stepper */}
          <HorizontalStepper steps={[
            { status: 'done', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'upcoming', stepNumber: 1 }
          ]} />

          {/* Vertical stepper */}
          <VerticalStepper steps={[
            { status: 'done', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'upcoming', stepNumber: 1 }
          ]} />

          {/* Vertical stepper with status and sub-steps */}
          <VerticalStepperWithStatus steps={[
            { status: 'done', stepNumber: 1 },
            { 
              status: 'current', 
              stepNumber: 2,
              hasSubSteps: true,
              subSteps: [
                { status: 'done' },
                { status: 'done' },
                { status: 'upcoming' }
              ]
            },
            { status: 'upcoming', stepNumber: 3 }
          ]} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">.Stepper Item</h2>
        </div>
        <div className="space-y-8">
          {/* Horizontal Stepper Items */}
          <div className="flex gap-6">
            <StepperItem status="done" stepNumber={1} orientation="horizontal" />
            <StepperItem status="current" stepNumber={1} orientation="horizontal" />
            <StepperItem status="upcoming" stepNumber={1} orientation="horizontal" />
          </div>
          <div className="flex gap-6">
            <StepperItem status="done" stepNumber={1} orientation="horizontal" />
            <StepperItem status="current" stepNumber={1} orientation="horizontal" />
            <StepperItem status="upcoming" stepNumber={1} orientation="horizontal" />
          </div>

          {/* Vertical Stepper Items */}
          <div className="flex flex-col gap-4">
            <StepperItem status="done" stepNumber={1} orientation="vertical" />
            <StepperItem status="current" stepNumber={1} orientation="vertical" />
            <StepperItem status="upcoming" stepNumber={1} orientation="vertical" />
          </div>
          <div className="flex flex-col gap-4">
            <StepperItem status="done" stepNumber={1} orientation="vertical" />
            <StepperItem status="current" stepNumber={1} orientation="vertical" />
            <StepperItem status="upcoming" stepNumber={1} orientation="vertical" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">.Multi Stepper Item</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <VerticalStepper steps={[
            { status: 'done', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'upcoming', stepNumber: 1 }
          ]} />
          <VerticalStepper steps={[
            { status: 'done', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'upcoming', stepNumber: 1 }
          ]} />
          <VerticalStepper steps={[
            { status: 'done', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'current', stepNumber: 1 },
            { status: 'upcoming', stepNumber: 1 }
          ]} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Breadcrumb</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <BreadcrumbDemo />
          <BreadcrumbItemDemo />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Tab</h2>
        </div>
        <div className="space-y-8">
          {/* Top tab row */}
          <TabsRow />

          {/* Tab Item grid */}
          <div className="grid gap-4 md:grid-cols-2 max-w-md">
            <TabItem status="default" />
            <TabItem status="default" />
            <TabItem status="default" />
            <TabItem status="default" />
            <TabItem status="outlined" />
            <TabItem status="outlined" />
            <TabItem status="disabled" />
            <TabItem status="disabled" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Table Header</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <TableHeaderInput label="Bot Name" sortDirection="down" />
          <TableHeaderInput label="Bot Name" sortDirection="up" />
          
          {/* Checkboxes row */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Checkboxes</label>
            <div className="flex gap-3">
              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              <input type="checkbox" checked className="h-4 w-4 rounded border-blue-600 bg-blue-600" />
              <input type="checkbox" className="h-4 w-4 rounded border-blue-600 bg-blue-600" style={{ appearance: 'none', backgroundImage: 'linear-gradient(to right, white 40%, white 40%, white 60%, blue 60%)' }} />
            </div>
          </div>

          {/* Icon buttons */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Icons</label>
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded border border-gray-300 bg-white flex items-center justify-center text-gray-600">
                =
              </button>
              <button className="h-8 w-8 rounded border border-gray-300 bg-white flex items-center justify-center text-gray-600">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="2" width="8" height="8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="h-8 w-8 rounded border border-gray-300 bg-white flex items-center justify-center text-gray-600">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="2" y="2" width="8" height="8" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Table Row</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Column 1 */}
          <div className="space-y-2">
            <TableRowCell type="text" content="Text" />
            <TableRowCell type="text" content="Text" />
            <TableRowCell type="avatar" content="Text" />
            <TableRowCell type="tag" tag={true} />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-blue-600"></div>
              <TableRowCell type="tag" tag={true} />
            </div>
            <TableRowCell type="link" content="www.helo.ai" />
            <TableRowCell type="masked" content="helo.ai/voice/***" />
            <TableRowCell type="checkbox" />
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <TableRowCell type="text" content="Text" />
            <TableRowCell type="text" content="Text" />
            <TableRowCell type="avatar" content="Text" />
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700">Tag +12</span>
            </div>
            <TableRowCell type="status" content="Status" />
            <TableRowCell type="link" content="www.helo.ai" />
            <TableRowCell type="masked" content="helo.ai/voice/***" />
            <TableRowCell type="checkbox" checked={true} />
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <TableRowCell type="text" content="Text" />
            <TableRowCell type="text" content="Text" />
            <TableRowCell type="avatar" content="Text" />
            <TableRowCell type="tag" tag={true} />
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border-2 border-blue-600"></div>
              <TableRowCell type="tag" tag={true} />
            </div>
            <TableRowCell type="link" content="www.helo.ai" />
            <TableRowCell type="masked" content="helo.ai/voice/***" />
            <TableRowCell type="checkbox" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Metrics Card</h2>
        </div>
        <div className="max-w-xs">
          <MetricsCard />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Trend Indicator</h2>
        </div>
        <div className="flex gap-4">
          <TrendIndicator trend="up" value="50%" />
          <TrendIndicator trend="down" value="30%" />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Table Header</h2>
        </div>
        <div className="max-w-xs">
          <TableHeader />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Table Footer</h2>
        </div>
        <div className="max-w-xs">
          <TableFooter />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Table Pagination</h2>
        </div>
        <TablePagination count={3} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Table Filter</h2>
        </div>
        <TableFilter count={3} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-secondary font-bold">◆</span>
          <h2 className="text-xl font-bold text-gray-900">Search</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {/* Row 1: Default without clear, Default with clear */}
          <SearchDemo />
          <SearchDemo showClear defaultValue="Search" />
          
          {/* Row 2: Default without clear, Default with clear */}
          <SearchDemo />
          <SearchDemo showClear defaultValue="Search" />
          
          {/* Row 3: Default without clear, Default with clear */}
          <SearchDemo />
          <SearchDemo showClear defaultValue="Search" />
          
          {/* Row 4: Focused with clear (blue border), Focused with clear (blue border) */}
          <SearchDemo isFocused={true} showClear defaultValue="Search" />
          <SearchDemo isFocused={true} showClear defaultValue="Search" />
          
          {/* Row 5: Disabled */}
          <SearchDemo status="disabled" />
        </div>
      </section>

    </div>
  )
}

