import React, { FC, useRef, Fragment, ReactNode } from 'react'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'

import { useScreenResize } from '../hooks/useScreenResize'
import { useTouchHandlers } from '../hooks/useTouchHandlers'
import { useAutoplay } from '../hooks/useAutoplay'
import { useSliderState } from './SliderContext'
import SliderTrack from './SliderTrack'
import Arrow from './Arrow'
import PaginationDots from './PaginationDots'

interface Props extends SliderLayoutSiteEditorProps {
  showCounter: boolean,
  counterTimeout: number,
  totalItems: number
  itemsPerPage: number
  centerMode: SliderLayoutProps['centerMode']
  // This type comes from React itself. It is the return type for
  // React.Children.toArray().
  children?: Array<Exclude<ReactNode, boolean | null | undefined>>
}

const CSS_HANDLES = ['sliderLayoutContainer', 'sliderTrackContainer'] as const

const Slider: FC<Props> = ({
  children,
  totalItems,
  infinite = false,
  showNavigationArrows,
  showPaginationDots,
  usePagination: shouldUsePagination = true,
  arrowSize,
  fullWidth,
  itemsPerPage,
  centerMode,
  showCounter,
  counterTimeout
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()
  const { label = 'slider', slidesPerPage } = useSliderState()
  const containerRef = useRef<HTMLDivElement>(null)
  const { onTouchEnd, onTouchStart, onTouchMove } = useTouchHandlers({
    infinite,
    centerMode,
  })

  useAutoplay(infinite, showCounter, counterTimeout, containerRef)
  useScreenResize(infinite, itemsPerPage)

  const shouldBeStaticList = slidesPerPage >= totalItems

  const controls = `${label
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')}-items`

  const shouldShowArrows = Boolean(
    (showNavigationArrows === 'always' ||
      (showNavigationArrows === 'mobileOnly' && isMobile) ||
      (showNavigationArrows === 'desktopOnly' && !isMobile)) &&
      !shouldBeStaticList
  )

  const shouldShowPaginationDots = Boolean(
    (showPaginationDots === 'always' ||
      (showPaginationDots === 'mobileOnly' && isMobile) ||
      (showPaginationDots === 'desktopOnly' && !isMobile)) &&
      !shouldBeStaticList
  )

  const touchStartHandler = (e: React.TouchEvent) =>
    shouldUsePagination && !shouldBeStaticList ? onTouchStart(e) : null

  const touchEndHandler = (e: React.TouchEvent) =>
    shouldUsePagination && !shouldBeStaticList ? onTouchEnd(e) : null

  const touchMoveHandler = (e: React.TouchEvent) =>
    shouldUsePagination && !shouldBeStaticList ? onTouchMove(e) : null

  return (
    <section
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
      onTouchMove={touchMoveHandler}
      aria-label={label}
      style={{
        WebkitOverflowScrolling: !shouldUsePagination ? 'touch' : undefined,
        paddingLeft: fullWidth ? undefined : arrowSize * 2,
        paddingRight: fullWidth ? undefined : arrowSize * 2,
      }}
      className={`w-100 flex items-center relative ${handles.sliderLayoutContainer}`}
    >
      <div
        className={`w-100 ${handles.sliderTrackContainer} ${
          shouldUsePagination ? 'overflow-hidden' : 'overflow-x-scroll'
        }`}
        ref={containerRef}
      >
        <SliderTrack
          centerMode={centerMode}
          infinite={infinite}
          totalItems={totalItems}
          usePagination={shouldUsePagination}
        >
          {children}
        </SliderTrack>
      </div>
      {shouldShowArrows && shouldUsePagination && (
        <Fragment>
          <Arrow
            totalItems={totalItems}
            orientation="left"
            controls={controls}
            infinite={infinite}
            arrowSize={arrowSize}
          />
          <Arrow
            totalItems={totalItems}
            orientation="right"
            controls={controls}
            infinite={infinite}
            arrowSize={arrowSize}
          />
        </Fragment>
      )}
      {shouldShowPaginationDots && shouldUsePagination && (
        <PaginationDots
          totalItems={totalItems}
          controls={controls}
          infinite={infinite}
          showCounter={showCounter}
        />
      )}
    </section>
  )
}

export default Slider
