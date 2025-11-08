"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const sponsors = [
  "LISK",
  "BlockdevID",
  "Binus University",
  "Garuda Spark",
  "EKRAF",
  "UPbit",
  "BBCC",
  "Infinity"
]

// Helper function untuk horizontal loop animation
function horizontalLoop(items: HTMLElement[], gsapInstance: any, config?: {
  repeat?: number
  paused?: boolean
  speed?: number
  snap?: number | false
  paddingRight?: number
  reversed?: boolean
}) {
  if (!gsapInstance) return null
  
  config = config || {}
  const tl = gsapInstance.timeline({
    repeat: config.repeat,
    paused: config.paused !== undefined ? config.paused : false,
    defaults: { ease: "none" },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
  })

  const length = items.length
  const startX = items[0].offsetLeft
  const times: number[] = []
  const widths: number[] = []
  const xPercents: number[] = []
  let curIndex = 0
  const pixelsPerSecond = (config.speed || 1) * 100
  const snap = config.snap === false ? (v: number) => v : gsapInstance.utils.snap(config.snap || 1)

  gsapInstance.set(items, {
    xPercent: (i: number, el: HTMLElement) => {
      const w = widths[i] = parseFloat(gsapInstance.getProperty(el, "width", "px") as string)
      xPercents[i] = snap(
        parseFloat(gsapInstance.getProperty(el, "x", "px") as string) / w * 100 +
        parseFloat(gsapInstance.getProperty(el, "xPercent") as string)
      )
      return xPercents[i]
    }
  })

  gsapInstance.set(items, { x: 0 })

  const totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth * parseFloat(gsapInstance.getProperty(items[length - 1], "scaleX") as string) +
    (parseFloat(config.paddingRight?.toString() || "0") || 0)

  for (let i = 0; i < length; i++) {
    const item = items[i]
    const curX = (xPercents[i] / 100) * widths[i]
    const distanceToStart = item.offsetLeft + curX - startX
    const distanceToLoop = distanceToStart + widths[i] * parseFloat(gsapInstance.getProperty(item, "scaleX") as string)

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond
      },
      0
    )
      .fromTo(
        item,
        { xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100) },
        {
          xPercent: xPercents[i],
          duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond)

    times[i] = distanceToStart / pixelsPerSecond
  }

  function toIndex(index: number, vars?: any) {
    vars = vars || {}
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length
    }
    const newIndex = gsapInstance.utils.wrap(0, length, index)
    let time = times[newIndex]

    if ((time > tl.time()) !== (index > curIndex)) {
      vars.modifiers = { time: gsapInstance.utils.wrap(0, tl.duration()) }
      time += tl.duration() * (index > curIndex ? 1 : -1)
    }

    curIndex = newIndex
    vars.overwrite = true
    return tl.tweenTo(time, vars)
  }

  tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars)
  tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars)
  tl.current = () => curIndex
  tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars)
  tl.times = times

  tl.progress(1, true).progress(0, true)

  if (config.reversed) {
    tl.vars.onReverseComplete?.()
    tl.reverse()
  }

  return tl
}

export function SponsorMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    let scrollTrigger1: ScrollTrigger | null = null
    let scrollTrigger2: ScrollTrigger | null = null
    let speedTween: any = null
    let tl: any = null
    let tlr: any = null

    // Wait for GSAP and DOM
    const initAnimation = () => {
      if (!gsap || !ScrollTrigger) {
        console.warn("SponsorMarquee: GSAP not loaded")
        return
      }

      const leftElements = leftTextRef.current?.querySelectorAll<HTMLElement>(".sponsor-item")
      const rightElements = rightTextRef.current?.querySelectorAll<HTMLElement>(".sponsor-item")

      if (!leftElements || !rightElements || leftElements.length === 0 || rightElements.length === 0) {
        console.warn("SponsorMarquee: Elements not found", {
          left: leftElements?.length,
          right: rightElements?.length
        })
        return
      }

      const leftArray = Array.from(leftElements)
      const rightArray = Array.from(rightElements)

      console.log("SponsorMarquee: Creating animations", {
        leftCount: leftArray.length,
        rightCount: rightArray.length
      })

      // Calculate total width for seamless loop
      const leftWidth = leftTextRef.current?.scrollWidth || 0
      const rightWidth = rightTextRef.current?.scrollWidth || 0

      // Use horizontalLoop for proper seamless animation
      // Atas (left): scroll ke kanan (normal), Bawah (right): scroll ke kiri (reversed)
      tl = horizontalLoop(leftArray, gsap, { repeat: -1, paused: false, speed: 0.5, reversed: false })
      tlr = horizontalLoop(rightArray, gsap, { repeat: -1, paused: false, speed: 0.5, reversed: true })
      
      // Ensure bottom timeline is reversed (moving left)
      if (tlr) {
        // Double check it's reversed
        if (!tlr.reversed()) {
          tlr.reverse()
        }
      }
      
      // Start both timelines
      if (tl) tl.play()
      if (tlr) {
        tlr.play()
        // Ensure it stays reversed
        if (!tlr.reversed()) {
          tlr.reverse()
        }
      }
      
      if (!tl || !tlr) {
        console.warn("SponsorMarquee: Failed to create animations")
        return
      }

      console.log("SponsorMarquee: Animations created", {
        leftWidth,
        rightWidth,
        tlDuration: tl.duration(),
        tlrDuration: tlr.duration(),
        tlPaused: tl.paused(),
        tlrPaused: tlr.paused()
      })

      // Force play and ensure it's not paused
      console.log("SponsorMarquee: Timeline states before play", {
        tlPaused: tl.paused(),
        tlrPaused: tlr.paused(),
        tlTimeScale: tl.timeScale(),
        tlrTimeScale: tlr.timeScale()
      })
      
      // Ensure both timelines are playing
      tl.play()
      tlr.play()
      
      // Double check after a moment
      setTimeout(() => {
        if (tl.paused()) {
          console.warn("SponsorMarquee: Left timeline still paused, forcing play")
          tl.play()
        }
        if (tlr.paused()) {
          console.warn("SponsorMarquee: Right timeline still paused, forcing play")
          tlr.play()
        }
        
        // Ensure timeScale is set correctly
        if (tlr.timeScale() !== -1) {
          console.warn("SponsorMarquee: Right timeline timeScale not -1, setting now")
          tlr.timeScale(-1)
        }
        
        console.log("SponsorMarquee: Timeline states after play", {
          tlPaused: tl.paused(),
          tlrPaused: tlr.paused(),
          tlTimeScale: tl.timeScale(),
          tlrTimeScale: tlr.timeScale()
        })
      }, 200)

      scrollTrigger1 = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self: any) => {
          if (speedTween) speedTween.kill()
          speedTween = gsap
            .timeline()
            .to(tl, {
              timeScale: 3 * self.direction, // Atas: ke kanan (positive)
              duration: 0.25
            })
            .to(
              tl,
              {
                timeScale: 1 * self.direction, // Atas: ke kanan (positive)
                duration: 1.5
              },
              "+=0.5"
            )
        }
      })

      scrollTrigger2 = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self: any) => {
          if (speedTween) speedTween.kill()
          // For reversed timeline moving left, maintain reversed state
          // When scrolling down (direction = 1), speed up reversed animation
          // When scrolling up (direction = -1), slow down reversed animation
          const baseSpeed = tlr.reversed() ? -1 : 1
          speedTween = gsap
            .timeline()
            .to(tlr, {
              timeScale: baseSpeed * 3 * self.direction, // Maintain reversed direction
              duration: 0.25
            })
            .to(
              tlr,
              {
                timeScale: baseSpeed * 1 * self.direction, // Maintain reversed direction
                duration: 1.5
              },
              "+=0.5"
            )
        }
      })

      console.log("SponsorMarquee: Setup complete")
    }

    // Try multiple times to ensure DOM is ready
    const timer1 = setTimeout(initAnimation, 100)
    const timer2 = setTimeout(initAnimation, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      if (scrollTrigger1) scrollTrigger1.kill()
      if (scrollTrigger2) scrollTrigger2.kill()
      if (speedTween) speedTween.kill()
      if (tl) tl.kill()
      if (tlr) tlr.kill()
    }
  }, [])

  return (
    <section className="py-12 overflow-hidden bg-muted/20 backdrop-blur-sm w-full">
      <div className="w-full">
        {/* Sponsored By Label */}
        <div className="text-center mb-8 px-6">
          <p className="text-sm text-white/50 uppercase tracking-wider font-medium">Sponsored By</p>
        </div>

        {/* Marquee Container - Full width, no container constraint */}
        <div ref={containerRef} className="overflow-hidden w-full relative">
          <h2 
            className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white/50 overflow-hidden leading-none"
            style={{ fontFamily: 'sans-serif' }}
          >
            {/* Left scrolling text - moves right */}
            <div 
              ref={leftTextRef} 
              className="flex whitespace-nowrap"
            >
              {/* Duplicate untuk seamless loop */}
              {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
                <span key={`left-${index}`} className="sponsor-item inline-block px-4 whitespace-nowrap text-white/50">
                  {sponsor}
                  <span className="mx-4 text-white/30">-</span>
                </span>
              ))}
            </div>

            {/* Right scrolling text - moves left */}
            <div 
              ref={rightTextRef} 
              className="flex whitespace-nowrap mt-2"
            >
              {/* Duplicate untuk seamless loop */}
              {[...sponsors, ...sponsors, ...sponsors].map((sponsor, index) => (
                <span key={`right-${index}`} className="sponsor-item inline-block px-4 whitespace-nowrap text-white/50">
                  {sponsor}
                  <span className="mx-4 text-white/30">-</span>
                </span>
              ))}
            </div>
          </h2>
        </div>
      </div>
    </section>
  )
}

