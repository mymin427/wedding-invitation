import { useEffect, useRef } from "react"

const X_SPEED = 0.2
const X_SPEED_VARIANCE = 0.3

const Y_SPEED = 0.6
const Y_SPEED_VARIANCE = 0.5

const FLIP_SPEED_VARIANCE = 0.005

// Petal class
class Petal {
  x: number
  y: number
  w: number = 0
  h: number = 0
  opacity: number = 0
  flip: number = 0
  xSpeed: number = 0
  ySpeed: number = 0
  flipSpeed: number = 0

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height * 2 - canvas.height

    this.initialize()
  }

  initialize() {
    this.w = 3 + Math.random() * 3
    this.h = this.w
    this.opacity = 0.4 + Math.random() * 0.4
    this.flip = Math.random()

    this.xSpeed = X_SPEED + Math.random() * X_SPEED_VARIANCE
    this.ySpeed = Y_SPEED + Math.random() * Y_SPEED_VARIANCE
    this.flipSpeed = Math.random() * FLIP_SPEED_VARIANCE
  }

  draw() {
    if (this.y > this.canvas.height || this.x > this.canvas.width) {
      this.initialize()

      const rand = Math.random() * (this.canvas.width + this.canvas.height)
      if (rand > this.canvas.width) {
        this.x = 0
        this.y = rand - this.canvas.width
      } else {
        this.x = rand
        this.y = 0
      }
    }
    this.ctx.globalAlpha = this.opacity
    const r = (this.w / 2) * (0.8 + Math.abs(Math.cos(this.flip)) / 5)

    // subtle shadow for visibility on light backgrounds
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
    this.ctx.shadowBlur = 4
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0

    // fill
    this.ctx.fillStyle = "#FFFFFF"
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, r, 0, Math.PI * 2)
    this.ctx.fill()

    // outline stroke for extra contrast (winter pastel tone)
    this.ctx.strokeStyle = "#D5E1EE"
    this.ctx.lineWidth = 1
    this.ctx.stroke()

    // reset shadow so it doesn't accumulate
    this.ctx.shadowColor = "transparent"
    this.ctx.shadowBlur = 0
  }

  animate() {
    this.x += this.xSpeed
    this.y += this.ySpeed
    this.flip += this.flipSpeed
    this.draw()
  }
}

export const BGEffect = () => {
  const ref = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)

  const petalsRef = useRef<Petal[]>([])

  const resizeTimeoutRef = useRef(0)
  const animationFrameIdRef = useRef(0)

  useEffect(() => {
    const canvas = ref.current

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const getPetalNum = () => {
      return Math.floor((window.innerWidth * window.innerHeight) / 20000)
    }

    const initializePetals = () => {
      const count = getPetalNum()
      const petals = []
      for (let i = 0; i < count; i++) {
        petals.push(new Petal(canvas, ctx))
      }
      petalsRef.current = petals
    }

    initializePetals()

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      petalsRef.current.forEach((petal) => petal.animate())
      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    const onResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = window.setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const newPetalNum = getPetalNum()
        if (newPetalNum > petalsRef.current.length) {
          for (let i = petalsRef.current.length; i < newPetalNum; i++) {
            petalsRef.current.push(new Petal(canvas, ctx))
          }
        } else if (newPetalNum < petalsRef.current.length) {
          petalsRef.current.splice(newPetalNum)
        }
      }, 100)
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(animationFrameIdRef.current)
    }
  }, [])

  return (
    <div className="bg-effect">
      <canvas ref={ref} />
    </div>
  )
}
