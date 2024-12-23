import {useEffect, useState, useRef} from "react";
import {Routes, Route, useLocation} from "react-router-dom";
import Header from "./components/Header";
import Content from "./components/Content";
import "./App.css";

const App = () => {
  const pathToTab = {
    "/": 0,
    "/projects": 1,
    "/resume": 2,
    "/contact": 3,
    "/privacy": 4,
  };
  
  const location = useLocation();
  const initialTab = pathToTab["/" + location.pathname.split("/")[1]] ?? 0;

  const backgroundRef = useRef(null);
  const [mobile, setMobile] = useState(false);
  const [contents, setContents] = useState([
    { key: `${Date.now()}_i`, tab: initialTab }
  ]);
  const [isRight, setIsRight] = useState(true);
  const isAnim = useRef(false);
  const queuedTab = useRef(null);
  const nextContents = useRef(null);
  const currentTab = useRef(initialTab);

  const changeTab = (tab) => {
    if (isAnim.current) {
      queuedTab.current = tab;
    } else {
      currentTab.current = tab;
      const newContent = { key: `${Date.now()}_${tab}`, tab: tab };
      if (tab < contents[0].tab) {   
        if (!isRight) {
          setContents([newContent, {...contents[0]}]);
        } else {
          nextContents.current = [newContent, {...contents[0]}];
          setIsRight(false);
        }
      } else {
        if (isRight) {
          setContents([{...contents[0]}, newContent]);
        } else {
          nextContents.current = [{...contents[0]}, newContent];
          setIsRight(true);
        }
      }
    }
  };

  useEffect(() => {
    const turnstileScript = document.getElementById("turnstile-script");
    if (!turnstileScript) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.id = "turnstile-script";
      document.body.appendChild(script);
    }
    const moveBackground = (e) => {
      if (backgroundRef.current) {
        const x = Math.min(15, Math.max(-15, (e.clientX / window.innerWidth) * 100 - 50));
        const y = Math.min(10, Math.max(-15, (e.clientY / window.innerHeight) * 100 - 50));
        backgroundRef.current.style.setProperty("--mouse-x", `${Math.floor(x)}%`);
        backgroundRef.current.style.setProperty("--mouse-y", `${Math.floor(y)}%`);
      }
    };
    const changeWidth = () => {
      setMobile(window.innerWidth <= 950);
    };

    changeWidth();

    window.addEventListener("mousemove", moveBackground);
    window.addEventListener("resize", changeWidth);
    return () => {
      window.removeEventListener("mousemove", moveBackground);
      window.removeEventListener("resize", changeWidth);
    };
  }, []);

  useEffect(() => {
    const subdirectory = "/" + location.pathname.split("/")[1];
    const tab = pathToTab[subdirectory] ?? 0;
    if (tab !== currentTab.current) {
      changeTab(tab);
    }
  }, [location]);

  useEffect(() => {
    if (!isAnim.current) {
      if (contents.length > 1) {
        isAnim.current = true;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsRight(!isRight);
          });
        });
      } else if (queuedTab.current !== null) {
        let queuedTabCopy = queuedTab.current;
        queuedTab.current = null;
        changeTab(queuedTabCopy);
      }
    }
  }, [contents]);

  useEffect(() => {
    if (nextContents.current !== null) {
      const nextContentsCopy = nextContents.current.map(a => {return {...a}});
      nextContents.current = null;
      setContents(nextContentsCopy);
    } else if (isAnim.current) {
      setTimeout(() => {
        if (isRight) {
          setContents([{...contents[0]}]);
        } else {
          setContents([{...contents[1]}]);
        }
        isAnim.current = false;
      }, 750);
    }
  }, [isRight]);

  return (
    <div className="app">
      <div className="background" ref={backgroundRef}/>
      <Header 
        mobile={mobile}
      />
      <Routes>
        <Route path="/" element={null}/>
        <Route path="/projects" element={null}/>
        <Route path="/projects/graph" element={null}/>
        <Route path="/resume" element={null}/>
        <Route path="/contact" element={null}/>
        <Route path="/privacy" element={null}/>
      </Routes>
      {contents.map((content, index) => {
        return (
          <Content 
            key={content.key}
            mobile={mobile}
            currentTab={content.tab}
            position={contents.length === 1 ? 0 : index + isRight - 1}
          />
        );
      })}
    </div>
  );
};

export default App;
