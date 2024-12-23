import {useRef} from "react";

import About from "./About";
import Projects from "./Projects";
import Resume from "./Resume";
import Contact from "./Contact";
import Privacy from "./Privacy";
import "./Content.css";

const Content = (props) => {
  const contentContainerRef = useRef(null);

  return (
    <div 
      className="content-container" 
      style={{
        maxWidth: `${12.8 * window.screen.height / 9}px`, 
        transform:`translateX(${props.position * 100}vw)`,
      }}
      onTransitionEnd={() => {
        console.log(`Transition ended for tab ${props.currentTab} at position ${props.position}`);
      }}  
      ref={contentContainerRef}
    >
      <div className="content">
        {props.currentTab === 0 && <About mobile={props.mobile}/>}
        {props.currentTab === 1 && <Projects mobile={props.mobile}/>}
        {props.currentTab === 2 && <Resume mobile={props.mobile}/>}
        {props.currentTab === 3 && <Contact mobile={props.mobile}/>}
        {props.currentTab === 4 && <Privacy mobile={props.mobile}/>}
      </div>      
      <div className="footer-wrapper">
        <div className="footer" style={{fontSize: props.mobile ? "14px" : "18px"}}>
          <p>&copy; Luke Nelson 2024</p>
          <svg viewBox="0 0 10 8" width="8" height="8" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#9ca3af"/>
          </svg>
          <p>Made with React</p>
          <svg viewBox="0 0 10 8" width="8" height="8" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#9ca3af"/>
          </svg>
          <p><a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
};
export default Content;