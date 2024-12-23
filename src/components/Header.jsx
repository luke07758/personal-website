import {useRef, useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Tabs from "./Tabs";
import GithubLogo from "../assets/github.svg";
import Bars from "../assets/bars.svg";
import "./Header.css";

const Header = (props) => {
  const [mobileTabsVisible, setMobileTabsVisible] = useState(false);
  const containerRef = useRef(null);

  const getCurrentTab = (pathname) => {
    const pathToTab = {
      "/": 0,
      "/about": 0,
      "/projects": 1,
      "/projects/graph": 1,
      "/resume": 2,
      "/contact": 3,
      "/privacy": 4,
    };
    return pathToTab[pathname] ?? 0;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(getCurrentTab(location.pathname));

  const handleTabClick = (tab, isMobile) => {
    const paths = {
      0: "/",
      1: "/projects",
      2: "/resume",
      3: "/contact",
      4: "/privacy"
    };

    navigate(paths[tab]);

    if (isMobile) {
      toggleMobileTabs();
    }
    setCurrentTab(tab);
  };

  const toggleMobileTabs = (instant = false) => {
    // If opening tabs, draw tabs first then change height
    // Otherwise, change height first
    if (mobileTabsVisible) {
      containerRef.current.className = "header-closed";
      setTimeout(() => setMobileTabsVisible(false), instant ? 0 : 500); // wait for transition before removing tabs
    }
    else {
      setMobileTabsVisible(true);
    }
  };

  useEffect(() => { 
    if (mobileTabsVisible) toggleMobileTabs(true) 
  }, [props.mobile]);
  useEffect(() => {
    if (mobileTabsVisible) {
      containerRef.current.className = "header-open";
    }
  }, [mobileTabsVisible]);

  return (
      <div className="header-container">
        <div className="header-closed" ref={containerRef} style={{
          display: "flex", 
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          width: "85vw", 
          maxWidth: `${12.8 * window.screen.height / 9}px`,
          transition: "height 0.5s ease-in-out"
        }}>
          <div className="header-content">
            <div className="header-element">
              <h1 className="header-title no-select">Luke Nelson</h1>
            </div>
            {!props.mobile && 
              <div className="header-element">
                <Tabs className="header-tabs" setCurrentTab={(tab) => handleTabClick(tab, false)} currentTab={currentTab}/>
              </div>
            }
            <div className="header-element">
              {props.mobile ?
                <img className="header-logo" src={Bars} onClick={() => toggleMobileTabs()}/> :
                <a href="https://github.com/luke07758" target="_blank" rel="noopener noreferrer">
                  <img className="header-logo" src={GithubLogo}/>
                </a>
              }
            </div>
          </div>
          {mobileTabsVisible && 
            <>
              <Tabs className="header-tabs" mobile={props.mobile} setCurrentTab={(tab) => handleTabClick(tab, true)} currentTab={currentTab}/>
            </>
          }
        </div>
      </div>
  );
};
export default Header;