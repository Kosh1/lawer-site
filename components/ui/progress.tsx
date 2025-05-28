"use client"

import * as React from "react"

export function Progress({ value = 0, className = "" }: { value?: number; className?: string }) {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className} dark:bg-gray-700`}>
      <div
        className="h-full bg-blue-600 transition-all duration-500 dark:bg-blue-400"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
