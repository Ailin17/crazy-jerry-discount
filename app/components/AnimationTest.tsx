import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

export const AnimationTest = () => {
  const container = useRef<HTMLDivElement>(null)
  const goodRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    (context, contextSafe) => {
      // ✅ directly using gsap after importing
      gsap.to(goodRef.current, { x: 100 })

      // ✅ event listener safely wrapped
      const onClickGood = contextSafe!(() => {
        gsap.to(goodRef.current, { rotation: 180 })
      })
      goodRef.current?.addEventListener('click', onClickGood)

      return () => {
        goodRef.current?.removeEventListener('click', onClickGood)
      }
    },
    { scope: container }
  )

  return (
    <div ref={container}>
      <button ref={goodRef}>Click me</button>
    </div>
  )
}

export const AnimationTest2 = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.box', { duration: 5, opacity: 0, stagger: 0.1, x: 300 })
    },
    { scope: container }
  )

  return (
    <div ref={container}>
      <div className="box">A</div>
      <div className="box">B</div>
      <div className="box">C</div>
    </div>
  )
}
