import React, { memo, FC } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import { useSliderState } from './SliderContext'
import { useSliderControls } from '../hooks/useSliderControls'

const DOTS_DEFAULT_SIZE = 0.625

interface Props {
  controls: string
  totalItems: number
  infinite: boolean
  showCounter: boolean
}

const CSS_HANDLES = ['paginationDotsContainer', 'paginationDot'] as const

const getSelectedDot = (
  passVisibleSlides: boolean,
  currentSlide: number,
  slidesToShow: number
): number => {
  const realCurrentSlide = passVisibleSlides
    ? currentSlide + (slidesToShow - 1)
    : currentSlide

  return passVisibleSlides
    ? Math.floor(realCurrentSlide / slidesToShow)
    : realCurrentSlide
}

const getSlideIndices = (
  slidesToShow: number,
  passVisibleSlides: boolean,
  totalItems: number
): number[] =>
  slidesToShow
    ? [
        ...Array(
          passVisibleSlides ? Math.ceil(totalItems / slidesToShow) : totalItems
        ).keys(),
      ]
    : []

const PaginationDots: FC<Props> = ({ controls, totalItems, infinite, showCounter }) => {
  const { slidesPerPage, currentSlide, navigationStep, counterLimit, counterCurrent, pause } = useSliderState()
  const { goBack, goForward, setPause, updateCounter } = useSliderControls(infinite)
  const handles = useCssHandles(CSS_HANDLES)
  const passVisibleSlides = navigationStep === slidesPerPage

  const slideIndexes = getSlideIndices(
    slidesPerPage,
    passVisibleSlides,
    totalItems
  )

  const handlePause = (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    setPause(!pause)
  }

  const handleDotClick = (
    event: React.KeyboardEvent | React.MouseEvent,
    index: number
  ) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    updateCounter(0, counterLimit);

    // Considering that each pagination dot represents a page, pageDelta
    // represents how many pages did the user "skip" by clicking in the dot.
    const pageDelta =
      index - getSelectedDot(passVisibleSlides, currentSlide, slidesPerPage)

    const slidesToPass = Math.abs(pageDelta) * navigationStep

    pageDelta > 0 ? goForward(slidesToPass) : goBack(slidesToPass)
  }

    const inEffect = `
      @keyframes custom-scale-in {
        from   { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
      }
    `;

    const divStyle = {
      width: "28px",
      height: "28px",
      margin: "5px"
    }

    const svgStyle = {
      width: "28px",
      height: "28px",
      animationDuration: "0.25s",
      animationName: "custom-scale-in"
    } as React.CSSProperties;

    let svgCircle = {
      width: "100%",
      height: "100%",
      fill: "none",
      stroke: "#E9E9E9",
      strokeWidth: "3",
      strokeLinecap: "round",
      transform: "translate(2px, 2px)"
    } as React.CSSProperties;

    let dashoffset = 100 - (100 * counterCurrent / (counterLimit !== 0 ? counterLimit : 1 ))

    let svgCircle2 = {
      width: "100%",
      height: "100%",
      fill: "none",
      stroke: "#E40044",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeDasharray: 100,
      strokeDashoffset: dashoffset,
      transform: "translate(2px, 2px)",
      transition: "stroke-dashoffset 0.25s"
    } as React.CSSProperties;

  return (
    <div
      className={`${handles.paginationDotsContainer} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Slider pagination dots"
    >
      {slideIndexes.map(index => {
        const isActive = index === getSelectedDot(passVisibleSlides, currentSlide, slidesPerPage)
        if (isActive)
          if (showCounter) return (
            <div
              className={`
                ${applyModifiers(handles.paginationDot, isActive ? 'isActive' : '')}
                ${applyModifiers(handles.paginationDot, pause ? 'isPause' : '')}
              `}
              style={divStyle}
              key={index}
              tabIndex={index}
              onKeyDown={event => handleDotClick(event, index)}
              onClick={event => handlePause(event)}
              role="button"
              aria-controls={controls}
              aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
              data-testid="paginationDot"
            >
              <style children={inEffect} />
              <svg style={svgStyle}>
                <circle style={svgCircle} cx="12" cy="12" r="12"></circle>
                <circle style={svgCircle2} cx="12" cy="12" r="12"></circle>
              </svg>
            </div>
          )
          else return (
            <div
              className={`
                ${applyModifiers(handles.paginationDot, 'isActive')}
              `}
              style={{
                height: `${DOTS_DEFAULT_SIZE}rem`,
                width: `${DOTS_DEFAULT_SIZE}rem`,
              }}
              key={index}
              tabIndex={index}
              onKeyDown={event => handleDotClick(event, index)}
              onClick={event => handleDotClick(event, index)}
              role="button"
              aria-controls={controls}
              aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
              data-testid="paginationDot"
            />
          )
          else
        return (
          <div
            className={`${handles.paginationDot} ${
              isActive ? 'bg-emphasis' : 'bg-muted-3'
            } grow dib br-100 pa2 mr2 ml2 bw0 pointer outline-0`}
            style={{
              height: `${DOTS_DEFAULT_SIZE}rem`,
              width: `${DOTS_DEFAULT_SIZE}rem`,
            }}
            key={index}
            tabIndex={index}
            onKeyDown={event => handleDotClick(event, index)}
            onClick={event => handleDotClick(event, index)}
            role="button"
            aria-controls={controls}
            aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
            data-testid="paginationDot"
          />
        )
      })}
    </div>
  )
}

export default memo(PaginationDots)
