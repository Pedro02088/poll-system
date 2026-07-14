import { useState, useEffect } from 'react'

export function useSSE(url) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!url) return

    const source = new EventSource(url, { withCredentials: true })

    source.onmessage = (event) => {
      setData(JSON.parse(event.data))
    }

    return () => source.close()
  }, [url])

  return data
}
