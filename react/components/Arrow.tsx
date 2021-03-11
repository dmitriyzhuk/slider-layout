import React, { memo, FC, ReactNode } from 'react'
import { IconCaret } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'

import { useSliderState } from './SliderContext'
import useKeyboardArrows from '../hooks/useKeyboardArrows'
import { useSliderControls } from '../hooks/useSliderControls'

interface Props {
  custom?: ReactNode
  orientation: 'left' | 'right'
  controls: string
  totalItems: number
  infinite: boolean
  arrowSize: number
}

const CSS_HANDLES = ['sliderLeftArrow', 'sliderRightArrow', 'sliderArrows']

const Arrow: FC<Props> = ({
  custom,
  orientation,
  controls,
  totalItems,
  infinite,
  arrowSize,
}) => {
  const { currentSlide, slidesPerPage, navigationStep, counterLimit } = useSliderState()
  const { goBack, goForward, updateCounter } = useSliderControls(infinite)

  const handles = useCssHandles(CSS_HANDLES)

  const isLeftEndReach = !(currentSlide - (navigationStep || 1) >= 0)
  const isRightEndReach = !(currentSlide + 1 + slidesPerPage <= totalItems)
  const disabled =
    !infinite &&
    ((orientation === 'left' && isLeftEndReach) ||
      (orientation === 'right' && isRightEndReach))

  useKeyboardArrows(goBack, goForward)

  function handleArrowClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    updateCounter(0, counterLimit);

    if (orientation === 'left') {
      goBack()
    }

    if (orientation === 'right') {
      goForward()
    }
  }

  return (
    <button
      className={`${
        orientation === 'left'
          ? `${handles.sliderLeftArrow} left-0`
          : `${handles.sliderRightArrow} right-0`
      } ${
        handles.sliderArrows
      } absolute transparent ma2 flex items-center justify-center bn outline-0 pointer`}
      style={{ background: 'transparent' }}
      onClick={handleArrowClick}
      aria-controls={controls}
      aria-label={`${orientation === 'left' ? 'Previous' : 'Next'} Slide`}
      disabled={disabled}
    >
      {custom ?? <IconCaret size={arrowSize} orientation={orientation} thin />}
    </button>
  )
}

export default memo(Arrow)
