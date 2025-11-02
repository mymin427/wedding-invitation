import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ArrowLeft from "../../icons/angle-left-sm.svg?react"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import { useModal } from "../modal"
import { GALLERY_IMAGES, GALLERY_THUMBS, GALLERY_ORIGINALS } from "../../images"

const CAROUSEL_ITEMS = GALLERY_IMAGES.map((item, idx) => (
  <div className="carousel-item" key={idx}>
    <img src={item} draggable={false} alt={`${idx}`} />
  </div>
))

const DRAG_SENSITIVITY = 15

type Status =
  | "stationary"
  | "clicked"
  | "clickCanceled"
  | "dragging"
  | "dragEnding"
  | "moving-left"
  | "moving-right"

type DragOption = {
  startingClientX: number
  startingClientY: number
  currentTranslateX: number
}

type ClickMove = "left" | "right" | null

export const Gallery = () => {
  const { openModal, closeModal } = useModal()
  const carouselRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  useEffect(() => {
    // no eager preloading to speed up initial load
  }, [])

  const [slide, _setSlide] = useState(0)
  const slideRef = useRef(0)
  const setSlide = (slide: number) => {
    _setSlide(slide)
    slideRef.current = slide
  }

  // parent-level neighbor preload removed; handled within lightbox component

  const [status, _setStatus] = useState<Status>("stationary")
  const statusRef = useRef<Status>("stationary")
  const setStatus = (status: Status) => {
    _setStatus(status)
    statusRef.current = status
  }

  const [dragOption, _setDragOption] = useState<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const dragOptionRef = useRef<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const setDragOption = (dragOption: DragOption) => {
    _setDragOption(dragOption)
    dragOptionRef.current = dragOption
  }

  const [moveOption, setMoveOption] = useState({
    srcIdx: 0,
    dstIdx: 0,
  })

  const clickMoveRef = useRef<ClickMove>(null)
  const setClickMove = (clickMove: ClickMove) => {
    clickMoveRef.current = clickMove
  }

  // For debugging
  // useEffect(() => {
  //   console.log(status)
  // }, [status])

  const click = (
    status: Status,
    clientX: number,
    clientY: number,
    carouselWidth: number,
  ) => {
    if (status !== "stationary") return
    setDragOption({
      startingClientX: clientX,
      startingClientY: clientY,
      currentTranslateX: -carouselWidth,
    })
    setStatus("clicked")
  }

  const dragging = useCallback(
    (dragOption: DragOption, clientX: number, carouselWidth: number) => {
      let moveTranslateX = clientX - dragOption.startingClientX

      if (moveTranslateX > carouselWidth) {
        moveTranslateX = carouselWidth
      } else if (moveTranslateX < -carouselWidth) {
        moveTranslateX = -carouselWidth
      }

      setDragOption({
        ...dragOption,
        currentTranslateX: moveTranslateX - carouselWidth,
      })
    },
    [],
  )

  const dragEnd = useCallback(
    (slide: number, dragOption: DragOption, carouselWidth: number) => {
      let move = 0
      if (dragOption.currentTranslateX < -carouselWidth * 1.1) {
        move = 1
      } else if (dragOption.currentTranslateX > -carouselWidth * 0.9) {
        move = -1
      }

      setDragOption({
        ...dragOption,
        currentTranslateX: -carouselWidth * (move + 1),
      })

      setStatus("dragEnding")

      setTimeout(() => {
        setDragOption({
          ...dragOption,
          currentTranslateX: -carouselWidth,
        })
        setStatus("stationary")
        setSlide((slide + move + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)
      }, 300)
    },
    [],
  )

  const move = useCallback((srcIdx: number, dstIdx: number) => {
    setSlide(dstIdx)
    if (srcIdx < dstIdx) {
      setStatus("moving-right")
    } else {
      setStatus("moving-left")
    }

    setMoveOption({ srcIdx, dstIdx })

    setTimeout(() => {
      setClickMove(null)
      setStatus("stationary")
    }, 300)
  }, [])

  /* Events */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const status = statusRef.current

      if (status === "clicked") {
        setStatus("dragging")
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const status = statusRef.current

      if (status === "clicked") {
        e.preventDefault()
        const xMove =
          e.targetTouches[0].clientX - dragOptionRef.current.startingClientX
        const yMove =
          e.targetTouches[0].clientY - dragOptionRef.current.startingClientY
        if (Math.abs(xMove) > DRAG_SENSITIVITY) {
          setStatus("dragging")
        } else if (Math.abs(yMove) > DRAG_SENSITIVITY) {
          setStatus("clickCanceled")
        }
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.targetTouches[0].clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onMouseTouchUp = useCallback(() => {
    const status = statusRef.current
    const clickMove = clickMoveRef.current
    const slide = slideRef.current

    if (status === "clicked") {
      if (clickMove === "left") {
        move(slide, (slide + CAROUSEL_ITEMS.length - 1) % CAROUSEL_ITEMS.length)
      } else if (clickMove === "right") {
        move(slide, (slide + 1) % CAROUSEL_ITEMS.length)
      } else {
        setStatus("stationary")
      }
    } else if (status === "dragging") {
      dragEnd(slide, dragOptionRef.current, carouselRef.current.clientWidth)
    } else if (status === "clickCanceled") {
      setStatus("stationary")
    }
  }, [dragEnd, move])

  useEffect(() => {
    const carouselElement = carouselRef.current
    if (!carouselElement || !(carouselElement as any).addEventListener) {
      return
    }

    window.addEventListener("mousemove", onMouseMove)
    carouselElement.addEventListener("touchmove", onTouchMove)
    window.addEventListener("mouseup", onMouseTouchUp)
    window.addEventListener("touchend", onMouseTouchUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      carouselElement.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("mouseup", onMouseTouchUp)
      window.removeEventListener("touchend", onMouseTouchUp)
    }
  }, [onMouseMove, onTouchMove, onMouseTouchUp])

  const onIndicatorClick = useCallback(
    (status: Status, srcIdx: number, dstIdx: number) => {
      if (status !== "stationary" || srcIdx === dstIdx) return
      move(srcIdx, dstIdx)
    },
    [move],
  )

  const transformStyle = useMemo(() => {
    switch (status) {
      case "dragging":
      case "dragEnding":
        return { transform: `translateX(${dragOption.currentTranslateX}px)` }
      default:
        return {}
    }
  }, [status, dragOption])

  const transformClass = useMemo(() => {
    const className = "carousel-list"
    switch (status) {
      case "dragEnding":
        return className + " transitioning"
      case "moving-left":
        return className + " moving-left"
      case "moving-right":
        return className + " moving-right"
      default:
        return className
    }
  }, [status])

  const LightboxContent = ({ initialIndex }: { initialIndex: number }) => {
    const [idx, setIdx] = useState(initialIndex)
    const len = GALLERY_ORIGINALS.length
    useEffect(() => {
      const prev = (idx + len - 1) % len
      const next = (idx + 1) % len
      ;[prev, next].forEach((i) => {
        const img = new Image()
        img.src = GALLERY_ORIGINALS[i]
      })
    }, [idx, len])

    return (
      <>
        <div className="viewer">
          <div className="nav left" onClick={() => setIdx((idx + len - 1) % len)}>
            <ArrowLeft className="arrow" />
          </div>
          <img src={GALLERY_ORIGINALS[idx]} alt={`${idx}`} draggable={false} />
          <div className="nav right" onClick={() => setIdx((idx + 1) % len)}>
            <ArrowLeft className="arrow right" />
          </div>
        </div>
        <div className="counter">{idx + 1} / {len}</div>
      </>
    )
  }

  const openLightbox = (startIdx: number) => {
    openModal({
      className: "lightbox-modal",
      closeOnClickBackground: true,
      header: <div className="title">사진 보기</div>,
      content: <LightboxContent initialIndex={startIdx} />,
      footer: (
        <Button
          buttonStyle="style2"
          className="bg-light-grey-color text-dark-color"
          onClick={closeModal}
        >
          닫기
        </Button>
      ),
    })
  }

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div className="photo-grid">
        {GALLERY_THUMBS.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt={`${idx}`}
            draggable={false}
            loading="lazy"
            decoding="async"
            onClick={() => openLightbox(idx)}
          />
        ))}
      </div>
    </LazyDiv>
  )
}
