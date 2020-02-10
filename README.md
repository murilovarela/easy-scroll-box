![Scroll box with scroll bar](https://dev-to-uploads.s3.amazonaws.com/i/i7m1tseg4dfe1ohglenv.gif)

# An easy scroll box implementation

It is a very common component in mobile and desktop UIs. Useful when displaying horizontal lists. The image below shows an example of a scroll box that displays a list of colors. And that is what we are going to be reproducing with React, so you can apply it in your project to display anything you want!

*All the code can be found in this git repository [here](https://github.com/murilovarela/easy-scroll-box).*

## Let's start coding
#### Basic structure
Our scroll box consists of a wrapper with a horizontal scroll and a container that will have its content width.

```jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './scrollBox.css';

function ScrollBox({ children }) {
  return (
    <div className="scroll-box">
      <div className="scroll-box__wrapper">
        <div className="scroll-box__container" role="list">
          {children.map((child, i) => (
            <div className="scroll-box__item" role="listitem" key={`scroll-box-item-${i}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollBox;
```

The style should guarantee that the wrapper creates the horizontal scroll and the container displays its content inline.

```css
.scroll-box {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.scroll-box__wrapper {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: scroll;
}

.scroll-box__container {
  height: 100%;
  display: inline-flex;
}
```

![Scroll box with scroll bar](https://dev-to-uploads.s3.amazonaws.com/i/ngvmvj3qy8qxvov47w05.png)

#### Getting rid of the scroll bar

As you could see the mobile and the desktop version still display the scroll bar and that may not be what we need. So using CSS it's possible to hide it. Our CSS file would look like below:

```css
.scroll-box {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.scroll-box__wrapper {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: scroll;
+   -ms-overflow-style: none; /* IE */
+   overflow: -moz-scrollbars-none; /* Firefox */
}

+ .scroll-box__wrapper::-webkit-scrollbar {
+   display: none; /* Chrome and Safari */
+ }

.scroll-box__container {
  height: 100%;
  display: inline-flex;
}
```

![Scroll box working on mobile](https://dev-to-uploads.s3.amazonaws.com/i/bq1addh3qdkltjegi0qs.gif)

Now the scroll bar disappears. If you want this component for mobile UI, that's ready to go! You already have a very nice scroll behavior with the screen touch. But if you need it to be used in desktop browsers scrolling with the mouse pointer, read the next lines. 

#### Controlling the scroll with the mouse pointer

First of all, we need to get a `ref` of our wrapper so we can attach functions to the events `onmousemove`, `onmousedown`, `onmouseup`, and `onmouseleave`. So let's use the hook `useRef` to create a `scrollWrapperRef` and pass it to our wrapper div.
The next step is to attach functions to the events listed above when the ref if set. The code will look something like this:

```jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './scrollBox.css';

function ScrollBox({ children }) {
  const scrollWrapperRef = useRef();

  const scrollWrapperCurrent = scrollWrapperRef.current;
  useEffect(() => {
    if (scrollWrapperRef.current) {
      const handleDragStart = () => {};
      const handleDragMove = () => {};
      const handleDragEnd = () => {};

      if (scrollWrapperRef.current.ontouchstart === undefined) {
        scrollWrapperRef.current.onmousedown = handleDragStart;
        scrollWrapperRef.current.onmousemove = handleDragMove;
        scrollWrapperRef.current.onmouseup = handleDragEnd;
        scrollWrapperRef.current.onmouseleave = handleDragEnd;
      }
    }
  }, [scrollWrapperCurrent]);

  return (
    <div className="scroll-box">
      <div className="scroll-box__wrapper" ref={scrollWrapperRef}>
        <div className="scroll-box__container" role="list">
          {children.map((child, i) => (
            <div role="listitem" key={`scroll-box-item-${i}`} className="scroll-box__item">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollBox;
```

##### The handleDragStart
When the mouse button is pressed down we understand that the drag has begun, and we need to save the initial pointer position on the X-axis and the current scroll position. That's what we are going to do.

```javascript
...
const [clickStartX, setClickStartX] = useState();
const [scrollStartX, setScrollStartX] = useState();
...
const handleDragStart = e => {
  setClickStartX(e.screenX);
  setScrollStartX(scrollWrapperRef.current.scrollLeft);
};
```

##### The handleDragMove
While having the mouse button pressed down and moving the cursor we understand that the scroll is being dragged, so we set the delta of the mouse X-axis plus the initial horizontal scroll to the wrapper horizontal scroll. That makes it follow the mouse pointer position.

```javascript
...
const [clickStartX, setClickStartX] = useState();
const [scrollStartX, setScrollStartX] = useState();
...
const handleDragMove = e => {
  if (clickStartX !== undefined && scrollStartX !== undefined) {
    const touchDelta = clickStartX - e.screenX;
    scrollWrapperRef.current.scrollLeft = scrollStartX + touchDelta;
  }
};
```

##### The handleDragEnd
Releasing the mouse button or leaving the scroll box area is understood as stopping the dragging. And for that, we want to just unset the clickStartX and scrollStartX so the handleDragMove won't set the scrollLeft anymore.

```javascript
...
const [clickStartX, setClickStartX] = useState();
const [scrollStartX, setScrollStartX] = useState();
...
const handleDragEnd = () => {
  if (clickStartX !== undefined) {
    setClickStartX(undefined);
    setScrollStartX(undefined);
  }
};
```

#### Why setting mouse events inside the useEffect?
You may be asking yourself why we need to set that inside the useEffect. The main reason is to trigger the mouse events set up on the change of `scrollWrapperRef.current`, but once the `scrollWrapperRef` is a mutable object, we set the `scrollWrapperRef.current` it to a const `scrollWrapperCurrent`. That makes possible to the useEffect to understand that the `current` inside `scrollWrapperRef` has changed.  

#### Tracking mouse position for desktop browsers only
On mobile browsers, the `scrollWrapperRef.current.ontouchstart` will have the value of `null` meaning that it may be used but is just not set. On desktop browsers, the value is undefined, once we won't have 'touches' on the screen (at least in most of the computers). So we just want that to happen in desktop browsers. 

*I didn't have the chance to test it out on desktop touch screen. If you have so, please leave a comment!*

```javascript
  if (scrollWrapperRef.current.ontouchstart === undefined) {
    scrollWrapperRef.current.onmousedown = handleDragStart;
    scrollWrapperRef.current.onmousemove = handleDragMove;
    scrollWrapperRef.current.onmouseup = handleDragEnd;
    scrollWrapperRef.current.onmouseleave = handleDragEnd;
  }
```

#### Let's add physics! 
As you can see the movement stops at the same place where the pointer stops dragging, and that's not what we get in the mobile experience. For that, we must add a momentum effect. It must keep its speed and gently slow down. 

On the `handleDragMove` we must capture the mouse movement speed. To do that we will use the speed equation that is `v = ds/dt`, or the variation of space by an interval of time. See the code below to clarify a bit more.

```javascript
const timing = (1 / 60) * 1000;
...
const [isDragging, setIsDragging] = useState(false);
const [lastScreenX, setLastScreenX] = useState(0);
const [speed, setSpeed] = useState(0);
const [direction, setDirection] = useState(0);

const handleLastScrollX = useCallback(
  throttle(screenX => {
    setLastScreenX(screenX);
  }, timing),
  []
);
...
const handleDragMove = e => {
  if (clickStartX !== undefined && scrollStartX !== undefined) {
    const touchDelta = clickStartX - e.screenX;
    scrollWrapperRef.current.scrollLeft = scrollStartX + touchDelta;

    if (Math.abs(touchDelta) > 1) {
      setIsDragging(true);
      setDirection(touchDelta / Math.abs(touchDelta));
      setSpeed(Math.abs((lastScreenX - e.screenX) / timing));
      setLastScreenX(e.screenX);
    }
  }
};
```

From `lodash` we get the throttle function that will guarantee that we only set the setLastScrollX one time each 16.666667ms, or `(1 / 60) * 1000`, what matches the 60 frames per second screen update from browsers.
The `(lastScreenX - e.screenX) / timing` will give us the current speed of the mouse pointer. And `touchDelta / Math.abs(touchDelta)` will provide us a result o -1 or 1 as a hint of movement direction.

To apply the continuation of movement after dragging the scroll box, an useEffect can be used just like shown below.

```javascript
const timing = (1 / 60) * 1000;
const decay = v => -0.1 * ((1 / timing) ^ 4) + v;
...
const [momentum, setMomentum] = useState(0);
...
const handleMomentum = useCallback(
  throttle(nextMomentum => {
    setMomentum(nextMomentum);
    scrollRef.current.scrollLeft = scrollRef.current.scrollLeft + nextMomentum * timing * direction;
  }, timing),
  [scrollWrapperCurrent, direction]
);

useEffect(() => {
  if (direction !== 0) {
    if (momentum > 0 && !isDragging) {
      handleMomentum(decay(momentum));
    } else if (isDragging) {
      setMomentum(speed);
    } else {
      setDirection(0);
    }
  }
}, [momentum, isDragging, speed, direction, handleMomentum]);
```

The decay function describes the exponential decrease of a value over a rate and time. Just what we need! So after isDragging is set to false on our handleDragEnd, it starts to add a value of dislocation caused by the momentum that will be recalculated each time until it reaches zero, so the movement stops. 

And to stop the movement after clicking on the scroll box we set the direction to zero.
```javascript
const handleDragStart = e => {
  ...
  setDirection(0);
};
```

#### Dragging links and images
Using the isDragging that we are already tracking, we can set the container pointer-events to `none`. So while dragging no links, buttons or images are going to act like it should and will just be dragged normally. 

```jsx
const handleDragMove = e => {
  e.preventDefault();
  e.stopPropagation();
  ...
}
...
return (
  <div className="scroll-box">
    <div className="scroll-box__wrapper" ref={scrollWrapperRef}>
      <div className="scroll-box__container" role="list" style={{ pointerEvents: isDragging ? 'none' : undefined }}>
        {children.map((child, i) => (
          <div role="listitem" key={`scroll-box-item-${i}`} className="scroll-box__item">
            {child}
          </div>
        ))}
      </div>
    </div>
  </div>
 );
```

### The final component
```jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import './scrollBox.css';

const timing = (1 / 60) * 1000;
const decay = v => -0.1 * ((1 / timing) ^ 4) + v;

function ScrollBox({ children }) {
  const scrollWrapperRef = useRef();
  const [clickStartX, setClickStartX] = useState();
  const [scrollStartX, setScrollStartX] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [lastScrollX, setLastScrollX] = useState(0);
  const [speed, setSpeed] = useState(0);
  const handleLastScrollX = useCallback(
    throttle(screenX => {
      setLastScrollX(screenX);
    }, timing),
    []
  );
  const handleMomentum = useCallback(
    throttle(nextMomentum => {
      setMomentum(nextMomentum);
      scrollRef.current.scrollLeft = scrollRef.current.scrollLeft + nextMomentum * timing * direction;
    }, timing),
    [scrollWrapperCurrent, direction]
  );
  useEffect(() => {
    if (direction !== 0) {
      if (momentum > 0.1 && !isDragging) {
        handleMomentum(decay(momentum));
      } else if (isDragging) {
        setMomentum(speed);
      } else {
        setDirection(0);
      }
    }
  }, [momentum, isDragging, speed, direction, handleMomentum]);

  const scrollWrapperCurrent = scrollWrapperRef.current;
  useEffect(() => {
    if (scrollWrapperRef.current) {
      const handleDragStart = e => {
        setClickStartX(e.screenX);
        setScrollStartX(scrollWrapperRef.current.scrollLeft);
        setDirection(0);
      };
      const handleDragMove = e => {
        e.preventDefault();
        e.stopPropagation();

        if (clickStartX !== undefined && scrollStartX !== undefined) {
          const touchDelta = clickStartX - e.screenX;
          scrollWrapperRef.current.scrollLeft = scrollStartX + touchDelta;

          if (Math.abs(touchDelta) > 1) {
            setIsDragging(true);
            setDirection(touchDelta / Math.abs(touchDelta));
            setSpeed(Math.abs((lastScrollX - e.screenX) / timing));
            handleLastScrollX(e.screenX);
          }
        }
      };
      const handleDragEnd = () => {
        if (isDragging && clickStartX !== undefined) {
          setClickStartX(undefined);
          setScrollStartX(undefined);
          setIsDragging(false);
        }
      };

      if (scrollWrapperRef.current.ontouchstart === undefined) {
        scrollWrapperRef.current.onmousedown = handleDragStart;
        scrollWrapperRef.current.onmousemove = handleDragMove;
        scrollWrapperRef.current.onmouseup = handleDragEnd;
        scrollWrapperRef.current.onmouseleave = handleDragEnd;
      }
    }
  }, [scrollWrapperCurrent, clickStartX, isDragging, scrollStartX, handleLastScrollX, lastScrollX]);

  return (
    <div className="scroll-box">
      <div className="scroll-box__wrapper" ref={scrollWrapperRef}>
        <div className="scroll-box__container" role="list" style={{ pointerEvents: isDragging ? 'none' : undefined }}>
          {children.map((child, i) => (
            <div role="listitem" key={`scroll-box-item-${i}`} className="scroll-box__item">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollBox;
```

### Improvements!
We can make use of a hook to remove all the logic from our component by creating a hook! And that's dead simple! 

Our hook will be called useScrollBox:
```javascript
import { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash/throttle';

const timing = (1 / 60) * 1000;
const decay = v => -0.1 * ((1 / timing) ^ 4) + v;

function useScrollBox(scrollRef) {
  const [clickStartX, setClickStartX] = useState();
  const [scrollStartX, setScrollStartX] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [lastScrollX, setLastScrollX] = useState(0);
  const [speed, setSpeed] = useState(0);

  const scrollWrapperCurrent = scrollRef.current;
  const handleLastScrollX = useCallback(
    throttle(screenX => {
      setLastScrollX(screenX);
    }, timing),
    []
  );
  const handleMomentum = useCallback(
    throttle(nextMomentum => {
      setMomentum(nextMomentum);
      scrollRef.current.scrollLeft = scrollRef.current.scrollLeft + nextMomentum * timing * direction;
    }, timing),
    [scrollWrapperCurrent, direction]
  );
  useEffect(() => {
    if (direction !== 0) {
      if (momentum > 0.1 && !isDragging) {
        handleMomentum(decay(momentum));
      } else if (isDragging) {
        setMomentum(speed);
      } else {
        setDirection(0);
      }
    }
  }, [momentum, isDragging, speed, direction, handleMomentum]);

  useEffect(() => {
    if (scrollRef.current) {
      const handleDragStart = e => {
        setClickStartX(e.screenX);
        setScrollStartX(scrollRef.current.scrollLeft);
        setDirection(0);
      };
      const handleDragMove = e => {
        e.preventDefault();
        e.stopPropagation();

        if (clickStartX !== undefined && scrollStartX !== undefined) {
          const touchDelta = clickStartX - e.screenX;
          scrollRef.current.scrollLeft = scrollStartX + touchDelta;

          if (Math.abs(touchDelta) > 1) {
            setIsDragging(true);
            setDirection(touchDelta / Math.abs(touchDelta));
            setSpeed(Math.abs((lastScrollX - e.screenX) / timing));
            handleLastScrollX(e.screenX);
          }
        }
      };
      const handleDragEnd = () => {
        if (isDragging && clickStartX !== undefined) {
          setClickStartX(undefined);
          setScrollStartX(undefined);
          setIsDragging(false);
        }
      };

      if (scrollRef.current.ontouchstart === undefined) {
        scrollRef.current.onmousedown = handleDragStart;
        scrollRef.current.onmousemove = handleDragMove;
        scrollRef.current.onmouseup = handleDragEnd;
        scrollRef.current.onmouseleave = handleDragEnd;
      }
    }
  }, [scrollWrapperCurrent, clickStartX, isDragging, scrollStartX, handleLastScrollX, lastScrollX]);

  return { clickStartX, scrollStartX, isDragging, direction, momentum, lastScrollX, speed };
}

export default useScrollBox;
```

And our component can use it as any other hook.

```jsx
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import useScrollBox from './useScrollBox';
import './scrollBox.css';

function ScrollBox({ children }) {
  const scrollWrapperRef = useRef();
  const { isDragging } = useScrollBox(scrollWrapperRef);
  return (
    <div className="scroll-box">
      <div className="scroll-box__wrapper" ref={scrollWrapperRef}>
        <div className="scroll-box__container" role="list" style={{ pointerEvents: isDragging ? 'none' : undefined }}>
          {children.map((child, i) => (
            <div role="listitem" key={`scroll-box-item-${i}`} className="scroll-box__item">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScrollBox;
```

How pretty is it now? Hope you have enjoyed and learned something new!
