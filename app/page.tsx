'use client'

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowUpRight, BriefcaseBusiness, Check, ExternalLink, Mail, Menu, MessageCircle, X } from 'lucide-react'
import Lenis from 'lenis'


const profile = {
  email: 'sandra.bh.asante@gmail.com',
  whatsapp: 'https://wa.me/233559490777?s=p',
  github: 'https://github.com/sassante',
  linkedin: 'https://www.linkedin.com/in/sandrasante',
}

const projects = [
  { title: 'Weather App', type: 'web development', tech: 'JavaScript · API integration', description: 'A focused weather experience with dynamic scenery, clear forecasts, and a friendly search flow.', tone: 'sunset', href: 'https://weather-app-sandra.vercel.app' },
  { title: 'SafeSmartTech', type: 'Web design & development', tech: 'WordPress · Responsive UI', description: 'A modern, mobile-first website that makes digital safety feel approachable for every audience.', tone: 'blue', href: 'https://safesmarttech.vercel.app' },
  { title: 'Henmasi Trading', type: 'E-commerce experience', tech: 'TypeScript · UI engineering', description: 'A practical storefront designed to help customers browse, trust, and buy with confidence.', tone: 'green', href: 'https://henmasi-trading.vercel.app' },
  { title: 'cloudBridge', type: 'Product concept', tech: 'JavaScript · UX thinking', description: 'A seamless file-transfer concept for moving work between cloud platforms without the download loop.', tone: 'violet', href: 'https://cloudbridge.vercel.app' },
]

const designProjects = [
  { title: 'Ghana Beauty', type: 'Mobile app concept', tech: 'Figma · Product design', description: 'A warm, expressive beauty booking experience designed around local needs and everyday confidence.', tone: 'rose', href: 'https://www.figma.com/' },
  { title: 'Game', type: 'Mobile interaction', tech: 'Figma · Prototyping', description: 'A playful game prototype exploring tactile feedback, simple rules, and satisfying progression.', tone: 'orange', href: 'https://www.figma.com/' },
  { title: 'E-commerce', type: 'Web app concept', tech: 'Figma · UX/UI', description: 'A clean shopping journey that keeps product discovery, comparison, and checkout feeling effortless.', tone: 'teal', href: 'https://www.figma.com/' },
]

function WordReveal({ children }: { children: string }) {
  return <span className="word-reveal" aria-label={children}>{children.split(' ').map((word, index) => <span key={`${word}-${index}`} style={{ '--word-index': index } as CSSProperties}>{word}{index < children.split(' ').length - 1 ? ' ' : ''}</span>)}</span>
}

function TouchCursor() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`)
      setVisible(true)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <span className={`touch-cursor ${visible ? 'is-visible' : ''}`} aria-hidden="true" />
}

function ParticleField({ mode = 'repulse', tone = 'dark' }: { mode?: 'repulse' | 'constellation' | 'vortex'; tone?: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: -999, y: -999 })
  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const context = canvas.getContext('2d')
    if (!context) return
    const light = tone === 'light'
    const rgb = light ? '237, 103, 63' : '255, 168, 76'
    const speed = light ? .0007 : .00025
    const particles = Array.from({ length: Math.round((mode === 'constellation' ? 34 : 42) * (light ? 1.7 : 1)) }, (_, index) => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * speed, vy: (Math.random() - .5) * speed, seed: index * 1.7 }))
    let width = 0, height = 0, frame = 0
    const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 2); width = host.clientWidth; height = host.clientHeight; canvas.width = width * ratio; canvas.height = height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
    const move = (event: PointerEvent) => { const bounds = host.getBoundingClientRect(); pointer.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top } }
    const leave = () => { pointer.current = { x: -999, y: -999 } }
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const points = particles.map((particle) => {
        particle.x = (particle.x + particle.vx + 1) % 1; particle.y = (particle.y + particle.vy + 1) % 1
        let x = particle.x * width, y = particle.y * height
        const distance = Math.hypot(x - pointer.current.x, y - pointer.current.y)
        const influence = Math.max(0, 1 - distance / 150)
        if (mode === 'repulse') { x += (x - pointer.current.x) * influence * .18; y += (y - pointer.current.y) * influence * .18 }
        if (mode === 'vortex') { const angle = Math.atan2(y - pointer.current.y, x - pointer.current.x) + influence * .025; const radius = distance * (1 - influence * .08); x = pointer.current.x + Math.cos(angle) * radius; y = pointer.current.y + Math.sin(angle) * radius }
        return { x, y, influence }
      })
      if (mode === 'constellation') { context.strokeStyle = `rgba(${rgb}, ${light ? .3 : .38})`; context.lineWidth = .6; points.forEach((point, index) => points.slice(index + 1).forEach((other) => { if (Math.hypot(point.x - other.x, point.y - other.y) < 145) { context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke() } })) }
      points.forEach(({ x, y, influence }) => { const size = (light ? 2.2 : 1.5) + influence * 3; context.fillStyle = `rgba(${rgb}, ${(light ? .6 : .55) + influence * .9})`; context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill() })
      frame = requestAnimationFrame(draw)
    }
    resize(); window.addEventListener('resize', resize); host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave) }
  }, [mode, tone])
  return <canvas ref={canvasRef} className={`particle-field particle-${mode} particle-${tone}`} aria-hidden="true" />
}

function MagneticButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const move = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box || !ref.current) return
    ref.current.style.setProperty('--mag-x', `${(event.clientX - box.left - box.width / 2) * 0.12}px`)
    ref.current.style.setProperty('--mag-y', `${(event.clientY - box.top - box.height / 2) * 0.12}px`)
  }
  const reset = () => {
    ref.current?.style.setProperty('--mag-x', '0px')
    ref.current?.style.setProperty('--mag-y', '0px')
  }
  return <a ref={ref} href={href} className={`magnetic-button ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</a>
}

function MagneticSkill({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (event: ReactPointerEvent<HTMLDivElement>) => { const box = ref.current?.getBoundingClientRect(); if (!box || !ref.current) return; ref.current.style.setProperty('--mx', `${(event.clientX - box.left - box.width / 2) * .08}px`); ref.current.style.setProperty('--my', `${(event.clientY - box.top - box.height / 2) * .08}px`) }
  const reset = () => { ref.current?.style.setProperty('--mx', '0px'); ref.current?.style.setProperty('--my', '0px') }
  return <div ref={ref} onPointerMove={move} onPointerLeave={reset} className="magnetic-skill">{icon}<span>{title}</span><small>{detail}</small></div>
}

function PerspectiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: -999, y: -999 })
  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    if (!canvas || !section) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    let width = 0
    let height = 0
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = section.clientWidth
      height = section.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const move = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect()
      pointer.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }
    const leave = () => { pointer.current = { x: -999, y: -999 } }
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const horizon = height * 0.28
      const spacing = 34
      const points: Array<{ x: number; y: number }> = []
      for (let row = 0; row < 13; row++) {
        const progress = row / 12
        const y = horizon + Math.pow(progress, 1.7) * (height - horizon + 30)
        const step = spacing + progress * 24
        for (let x = -width; x < width * 2; x += step) {
          const drift = Math.sin(time * 0.0005 + row * 0.7 + x * 0.01) * (1 + progress * 2)
          points.push({ x: x + drift, y })
        }
      }
      context.lineWidth = 0.65
      context.strokeStyle = 'rgba(105, 220, 255, .16)'
      for (let i = 0; i < 13; i++) {
        const progress = i / 12
        const y = horizon + Math.pow(progress, 1.7) * (height - horizon + 30)
        context.beginPath()
        context.moveTo(0, y)
        context.lineTo(width, y)
        context.stroke()
      }
      for (let x = -width; x < width * 2; x += 48) {
        context.beginPath()
        context.moveTo(width / 2 + (x - width / 2) * 0.04, horizon)
        context.lineTo(x, height)
        context.stroke()
      }
      points.forEach((point, index) => {
        const distance = Math.hypot(point.x - pointer.current.x, point.y - pointer.current.y)
        const influence = Math.max(0, 1 - distance / 130)
        const lift = influence * 18
        const size = 1.1 + influence * 2.2 + Math.sin(time * 0.002 + index) * 0.35
        context.fillStyle = `rgba(151, 234, 255, ${0.2 + influence * 0.65})`
        context.fillRect(point.x - size / 2, point.y - lift - size / 2, size, size)
        if (influence > 0.1) {
          context.strokeStyle = `rgba(248, 170, 101, ${influence * 0.34})`
          context.beginPath()
          context.moveTo(point.x, point.y - lift)
          context.lineTo(pointer.current.x, pointer.current.y)
          context.stroke()
        }
      })
      frame = requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener('resize', resize)
    section.addEventListener('pointermove', move)
    section.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', leave) }
  }, [])
  return <canvas ref={canvasRef} className="perspective-grid" aria-hidden="true" />
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <a href={project.href} className="project-card group" target="_blank" rel="noreferrer">
      <div className={`project-art ${project.tone}`} aria-hidden="true"><span>{project.title === 'cloudBridge' ? '↗' : project.title.slice(0, 2).toUpperCase()}</span></div>
      <div className="project-copy">
        <div className="eyebrow">{project.type}</div>
        <h3>{project.title}<ArrowUpRight size={17} strokeWidth={1.8} /></h3>
        <p>{project.description}</p>
        <div className="tech">{project.tech}</div>
      </div>
    </a>
  )
}

function DesignCard({ project }: { project: (typeof designProjects)[number] }) {
  return (
    <a className="design-card" href={project.href} target="_blank" rel="noreferrer">
      <div className={`design-art ${project.tone}`} aria-hidden="true"><div className="phone-shape"><div /><div /><div /></div></div>
      <div className="design-copy"><div className="eyebrow">{project.type}</div><h3>{project.title}<ArrowUpRight size={17} strokeWidth={1.8} /></h3><p>{project.description}</p><div className="tech">{project.tech}</div><span className="figma-link">View in Figma <ArrowUpRight size={14} /></span></div>
    </a>
  )
}
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

function Words({ text, start = 0 }: { text: string; start?: number }) {
  return <>{text.split(' ').map((word, i) => (
    <span className="word" key={i}><span style={{ '--i': start + i } as CSSProperties}>{word}</span></span>
  ))}</>
}

const topics = ['Website', 'App design', 'Collaboration', 'Just saying hi']

function TalkSection() {
  const [ref, seen] = useInView<HTMLElement>()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [topic, setTopic] = useState(topics[0])
  const delay = (ms: number) => ({ '--d': ms } as CSSProperties)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1100)
  }

  const links = [
    { label: 'WhatsApp', value: 'Chat with me', href: `https://wa.me/${profile.whatsapp}`, icon: <MessageCircle size={18} /> },
    { label: 'LinkedIn', value: 'Connect', href: profile.linkedin, icon: <ExternalLink size={18} /> },
  ]

  return (
    <section ref={ref} className={`talk-section ${seen ? 'is-in' : ''}`} id="contact">
      <div className="talk-glow one" aria-hidden="true" />
      <div className="talk-glow two" aria-hidden="true" />
      <ParticleField mode="vortex" />

      <div className="talk-inner">
        <div className="talk-left">
          <span className="section-number talk-reveal">04</span>
          <h2 className="talk-title" aria-label="Have a good idea? Let's make it real.">
            <span className="line" aria-hidden="true"><Words text="Have a good idea?" /></span>
            <span className="line" aria-hidden="true"><em><Words text="Let's make it real." start={3} /></em></span>
          </h2>
          <p className="talk-copy talk-reveal" style={delay(500)}>
            I&apos;m always open to new projects, new collaborations, or just saying hello.
          </p>
          <div className="talk-pill talk-reveal" style={delay(620)}><i /> Replies within 24 hours</div>

          <div className="talk-links talk-reveal" style={delay(740)}>
            {links.map(link => (
              <a key={link.label} className="talk-link" href={link.href} target="_blank" rel="noreferrer">
                {link.icon}
                <span><small>{link.label}</small><strong>{link.value}</strong></span>
                <ArrowUpRight size={18} className="talk-arrow" />
              </a>
            ))}
          </div>
        </div>

        <div className="talk-card talk-reveal" style={delay(400)}>
          {status === 'sent' ? (
            <div className="talk-success" role="status">
              <svg className="talk-check" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30" /><path d="M27 41l9 9 18-20" /></svg>
              <h3>Message sent</h3>
              <p>Thanks for reaching out. I&apos;ll be in touch very soon.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="talk-card-title">What&apos;s it about?</div>
              <div className="talk-chips">
                {topics.map(item => (
                  <button type="button" key={item} className={`talk-chip ${topic === item ? 'on' : ''}`} onClick={() => setTopic(item)}>{item}</button>
                ))}
              </div>
              <input type="hidden" name="topic" value={topic} />

              <div className="talk-field"><input required name="name" placeholder=" " id="t-name" /><label htmlFor="t-name">Your name</label></div>
              <div className="talk-field"><input required type="email" name="email" placeholder=" " id="t-email" /><label htmlFor="t-email">Email address</label></div>
              <div className="talk-field"><textarea required name="message" rows={4} placeholder=" " id="t-msg" /><label htmlFor="t-msg">Tell me about your idea</label></div>

              <button className="talk-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending'
                  ? <span className="talk-dots" aria-label="Sending"><i /><i /><i /></span>
                  : <>Send message <ArrowUpRight size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="talk-marquee" aria-hidden="true">
        <div className="talk-track">
          {[0, 1].map(group => (
            <div key={group}>
              <span>Let&apos;s work together</span><span>✦</span><span>Say hello</span><span>✦</span><span>Start a project</span><span>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SoftCursor() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    if (!el) return
    let x = 0, y = 0, tx = 0, ty = 0, frame = 0
    const move = (event: MouseEvent) => {
      tx = event.clientX; ty = event.clientY
      el.classList.add('is-visible')
      el.classList.toggle('is-active', !!(event.target as HTMLElement).closest('a, button, input, textarea'))
    }
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    frame = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(frame) }
  }, [])
  return <span ref={ref} className="soft-cursor" aria-hidden="true" />
}

function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)

    // keep nav links (#work, #contact…) smooth and clear of the sticky header
    const click = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return
      const id = link.getAttribute('href')!
      if (id === '#top') { event.preventDefault(); lenis.scrollTo(0); return }
      const target = document.querySelector(id) as HTMLElement | null
      if (target) { event.preventDefault(); lenis.scrollTo(target, { offset: -78 }) }
    }
    document.addEventListener('click', click)

    return () => { document.removeEventListener('click', click); cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
  return null
}


export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const close = () => setMenuOpen(false)
  return (
    <main>
      <SmoothScroll />
      <SoftCursor />
      <header className="site-header">
        <a className="brand" href="#top" onClick={close}><span className="brand-mark">SA</span><span>Sandra Asante</span></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'open' : ''}>
          <a href="#about" onClick={close}>About</a><a href="#work" onClick={close}>Work</a><a href="#skills" onClick={close}>Skills</a><a href="#contact" className="nav-cta" onClick={close}>Let&apos;s talk <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <section className="intro" id="top">
  <div className="intro-grid">
    <div className="intro-text" id="about">
      <p className="intro-role">Web developer &amp; UI/UX designer · Accra, Ghana</p>
      <h1>I design and build websites that are clear, fast, and easy to use.</h1>
      <p className="intro-copy">I&apos;m Sandra Boahemaa Asante. I turn ideas into responsive websites and apps, from the first Figma sketch to the finished build.</p>
      <div className="intro-actions">
        <a className="btn-solid" href="#work">View my work</a>
        <a className="btn-link" href="#contact">Get in touch</a>
      </div>
    </div>
    <figure className="intro-photo">
      <img src="profile-pic.jpeg" alt="Sandra Asante" />
      <figcaption>Sandra Asante, Accra</figcaption>
    </figure>
  </div>
  <div className="intro-meta">
    <div><span>Currently</span>Available for freelance projects</div>
    <div><span>Works with</span>React · TypeScript · Figma</div>
    <div><span>Elsewhere</span><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a> · <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>
  </div>
</section>

      <section className="work-section section" id="work"><PerspectiveGrid /><div className="section-heading work-content"><div><span className="section-number">01</span><h2>Selected work</h2></div><p>A small collection of things I&apos;ve built, designed, and cared deeply about.</p></div><div className="project-grid">{projects.map(project => <ProjectCard project={project} key={project.title} />)}</div></section>

      <section className="design-section section"><ParticleField mode="constellation" tone="light" /><div className="section-heading"><div><span className="section-number">02</span><h2>Design explorations</h2></div><p>Ideas, interfaces, and visual systems made in Figma.</p></div><div className="design-grid">{designProjects.map(project => <DesignCard project={project} key={project.title} />)}</div></section>

      <section className="skills-section section" id="skills"><ParticleField mode="constellation" /><div className="section-heading skills-content"><div><span className="section-number">03</span><h2>How I work</h2></div></div><div className="skills-layout skills-content"><p className="skills-lede">I bring together <em>curiosity, clarity,</em> and a love for the details that make an experience feel right.</p><div className="skill-list"><MagneticSkill icon={<BriefcaseBusiness size={18} />} title="Web development" detail=" CSS3/SCSS · JavaScript(ES6+) · React" /><MagneticSkill icon={<Check size={18} />} title="Design & Prototyping" detail="Figma · Prototyping · Design systems" /><MagneticSkill icon={<MessageCircle size={18} />} title="Content Management & Backend" detail="WordPress · Headless CMS · REST API ·Custom Gutenberg Blocks" /></div></div></section>

      <TalkSection />
      <footer><span>© 2026 Sandra Asante</span><div><a href="mailto:sandra.asante@gmail.com" aria-label="Email Sandra"><Mail size={17} /></a><a href="#contact" aria-label="WhatsApp Sandra"><MessageCircle size={17} /></a><a href="#top" aria-label="Back to top">Back to top ↑</a></div></footer>
    </main>
  )
}
