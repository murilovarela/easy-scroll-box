# An easy scroll box implementation

It is a very common component in mobile and desktop UIs. Useful when displaing horizontal lists. The image bellow shows an example of a scroll box that displays a list of color. And that is what we are going to be reproducing with React, so you can apply it in your oun project to display anything you want!

[imagem](imagem)

## Let's start coding
#### Basic structure
Our scroll box consists in a wrapper with a horizintal scroll and a container that will have its content width.

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
[imagem](imagem)

#### Getting rid of the scroll bar

As you could see the mobile and the desktop version still display the scroll bar and that may no be what we need. So using css it's possible to hide it. Our css file would look like bellow:

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

Now the scroll bar disapears. I you want this component for mobile UI, that's ready to go! You alread have a very nice scroll behaviour with the screen touch. But if you need it to be used in desktop browsers scrolling with the mouse pointer, read the next lines. 

#### Controlling the with a mouse pointer


