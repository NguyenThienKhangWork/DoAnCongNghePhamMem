import { useEffect, useRef } from 'react'

export default function StarsBg() {
  const bgRef = useRef(null)
  const sakuraRef = useRef(null)

  useEffect(() => {
    // Stars
    const bg = bgRef.current
    if (bg) {
      for (let i = 0; i < 180; i++) {
        const s = document.createElement('div')
        s.className = 'star-dot'
        const size = Math.random() * 2.5 + 0.5
        s.style.cssText = `
          width:${size}px;height:${size}px;
          left:${Math.random() * 100}%;
          top:${Math.random() * 100}%;
          --d:${2 + Math.random() * 4}s;
          --delay:-${Math.random() * 5}s;
        `
        bg.appendChild(s)
      }
    }

    // Sakura petals
    const sc = sakuraRef.current
    if (sc) {
      for (let i = 0; i < 22; i++) {
        const p = document.createElement('div')
        p.className = 'petal'
        p.style.cssText = `
          left:${Math.random() * 100}%;
          --fall-d:${7 + Math.random() * 8}s;
          --fall-delay:${Math.random() * 10}s;
        `
        sc.appendChild(p)
      }
    }

    return () => {
      if (bg) bg.innerHTML = ''
      if (sc) sc.innerHTML = ''
    }
  }, [])

  return (
    <>
      <div className="stars-bg" ref={bgRef} />
      <div className="sakura-container" ref={sakuraRef} />
    </>
  )
}
