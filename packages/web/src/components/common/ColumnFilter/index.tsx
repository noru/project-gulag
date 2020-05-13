import React, { useState, useRef } from 'react'
import { Input } from 'antd'

export function ColumnFilter({ onChange }) {
  let ref = useRef(null)
  let [query, setQuery] = useState('')

  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={ref}
        value={query}
        onChange={(e) => {
          let query = e.target.value
          setQuery(query)
          onChange(query)
        }}
      />
    </div>
  )
}
