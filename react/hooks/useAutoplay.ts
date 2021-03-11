import { useEffect } from 'react'

import { useSliderState } from '../components/SliderContext'
import { useSliderControls } from './useSliderControls'
import useHovering from './useHovering'

export const useAutoplay = (
  infinite: boolean,
  showCounter: boolean,
  counterTimeout: number,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const { autoplay, counterCurrent, pause } = useSliderState()
  const { isHovering } = useHovering(containerRef)

  const shouldStop = autoplay?.stopOnHover && isHovering

  const { goForward, updateCounter } = useSliderControls(infinite)

  let counterCurrent2 = counterCurrent;
  let counterLimit = 0;

  useEffect(() => {
    if (!autoplay || pause) {
      return
    }

    counterLimit = autoplay.timeout;

    const timeout2 = setTimeout(() => {
      if (showCounter) {
        counterCurrent2 += counterTimeout

        if (counterCurrent2 >= counterLimit - 1000) {
        // if (counterCurrent2 >= counterLimit) {
          counterCurrent2 = 0
          goForward()
        }

        updateCounter(counterCurrent2, counterLimit);
      }
    }, counterTimeout)
    
    shouldStop && clearTimeout(timeout2)

    const timeout = setTimeout(() => {
      goForward()

      if (timeout2) {
        clearTimeout(timeout2)
      }
    }, autoplay.timeout)

    shouldStop && clearTimeout(timeout)

    return () => {
      clearTimeout(timeout)
      clearTimeout(timeout2)
    }
  }, [goForward, shouldStop, autoplay, updateCounter])
}
