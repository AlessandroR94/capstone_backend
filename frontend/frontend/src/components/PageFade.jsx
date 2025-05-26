import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useRef } from 'react';

export default function PageFade({ children, location }) {
  const nodeRef = useRef(null);

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        classNames="fade"
        timeout={300}
        nodeRef={nodeRef}
        unmountOnExit
      >
        <div ref={nodeRef}>{children}</div>
      </CSSTransition>
    </SwitchTransition>
  );
}
