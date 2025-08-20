import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './NewsletterSignup.module.scss'
import Button from './Button'

gsap.registerPlugin(ScrollTrigger)

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 200%',
        },
      })

      tl.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
        .from(subtextRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(
          formRef.current,
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.2 },
          '-=0.2'
        )
      // .from(
      //   formRef.current!.querySelector('.btn-primary'),
      //   { y: 20, opacity: 0, duration: 0.6, stagger: 0.2 },
      //   '-=0.2'
      // )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // fake request
      setStatus('success')
      setEmail('')
      // 🎉 Animate success message
      gsap.fromTo(
        `.${styles.success}`,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
      )
    } catch (err) {
      setStatus('error')
      // ❌ Shake the form on error
      gsap.fromTo(
        formRef.current,
        { x: 0 },
        { x: -10, repeat: 3, yoyo: true, duration: 0.1 }
      )
    }
  }

  return (
    <section className={styles.newsletter} ref={sectionRef}>
      <div className={styles.container}>
        <h2 ref={headingRef} className={styles.heading}>
          Stay in the loop
        </h2>
        <p ref={subtextRef} className={styles.subtext}>
          Subscribe to our newsletter for updates on new collections, offers,
          and more.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        {status === 'success' && (
          <p className={styles.success}>🎉 Thanks for subscribing!</p>
        )}
        {status === 'error' && (
          <p className={styles.error}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  )
}

export default NewsletterSignup
