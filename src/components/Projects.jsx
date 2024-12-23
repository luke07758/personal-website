import {useRef, useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import graphThumbnail from "../assets/graphThumbnail.png";
import Graph from "graphing-calculator";
import "graphing-calculator/styles";

const NUM_PROJECTS = 1;
const PROJECT_TITLES = [ "Graphing Calculator" ];
const PROJECT_PATHS = [ "graph" ];

const Projects = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const gridRef = useRef(null);
  const cardRef = useRef(null);
  const numColumns = useRef(null);
  const [emptyCardCount, setEmptyCardCount] = useState(20);
  
  const initialProjectPath = location.pathname.split("/projects/")[1];
  const initialProjectIndex = PROJECT_PATHS.indexOf(initialProjectPath);

  const [projectOpen, setProjectOpen] = useState(initialProjectIndex !== -1);
  const projectNum = useRef(initialProjectIndex !== -1 ? initialProjectIndex : 0);
  const projectContainerRef = useRef(null);
  const [projectOpacity, setProjectOpacity] = useState(initialProjectIndex !== -1 ? 1 : 0);

  const calcEmptyCards = () => {
    if (!gridRef.current || !cardRef.current) {
      return 0;
    }
    const gridRect = gridRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    const availableHeight = window.innerHeight - gridRect.top;
    const cardsPerRow = Math.floor(gridRect.width / cardRect.width);
    const maxRows = Math.ceil(availableHeight / (cardRect.height + 10));
    return Math.max(0, cardsPerRow * maxRows - gridRef.current.querySelectorAll(".card:not(.no-project)").length);
  };

  const getCardStyle = (index) => {
    if (gridRef.current && cardRef.current) {
      if (index === 0) {
        const gridComputedStyle = window.getComputedStyle(gridRef.current);
        numColumns.current = gridComputedStyle.getPropertyValue("grid-template-columns").split(" ").length;
      }
      const rowIndex = Math.floor((index + NUM_PROJECTS) / numColumns.current);
      const cardHeight = cardRef.current.getBoundingClientRect().height;
      const startOpacity = 1.0 - (((cardHeight + 10) * rowIndex) / (window.innerHeight - 300));
      const endOpacity = Math.max(0, startOpacity - (cardHeight / (window.innerHeight - 300)));
      return {
        "--start-opacity": `${startOpacity}`,
        "--end-opacity": `${endOpacity}`,
      };
    }
    return {};
  }

  const openProject = (num) => {
    projectNum.current = num;
    navigate(`/projects/${PROJECT_PATHS[num]}`);
    setProjectOpen(true);
  };

  const closeProject = () => {
    navigate("/projects");
    setProjectOpacity(0);
  };

  useEffect(() => {
    if (projectOpen) {
      setProjectOpacity(1);
    }
  }, [projectOpen]);

  useEffect(() => {
    if (projectOpacity === 0) {
      setTimeout(() => setProjectOpen(false), 500);
    }
  }, [projectOpacity]);

  useEffect(() => {
    const projectPath = location.pathname.split('/projects/')[1];
    const projectIndex = PROJECT_PATHS.indexOf(projectPath);
    
    if (projectIndex !== -1) {
      projectNum.current = projectIndex;
      setProjectOpen(true);
    } else if (projectOpen) {
      setProjectOpacity(0);
    }
  }, [location]);

  useEffect(() => {
    const updateEmptyCards = () => {
      setEmptyCardCount(calcEmptyCards());
    };

    updateEmptyCards();

    window.addEventListener("resize", updateEmptyCards);

    return (() => {
      window.removeEventListener("resize", updateEmptyCards);
    });
  }, []);

  return (
    <div style={{overflow: "hidden", height: "calc(100vh - 160px)"}}>
      <div className="projects-grid" ref={gridRef}>
        {/* change to map when adding more projects */}
        <div className="card" ref={cardRef}>
          <div className="thumbnail-container">
            <img src={graphThumbnail}/>
          </div>
          <h2>Graphing Calculator</h2>
          <div className="project-links">
            <div className="project-button" onClick={() => openProject(0)}>Try in browser</div>
            <p><a href="">GitHub</a></p>
          </div>
          <p>Parses mathematical expressions using recursive descent parsing and draws them on an HTML canvas</p>
        </div>
        {[...Array(emptyCardCount)].map((_, index) => (
          <div key={`empty-${index}`} className="card no-project" style={getCardStyle(index)}>
            {index === 0 && <p>More coming soon...</p>}
          </div>
        ))}
      </div>
      {projectOpen && <div className="project-container card" ref={projectContainerRef} style={{opacity: projectOpacity, height: props.mobile ? "calc(94vh - 135px)" : "calc(94vh - 150px)"}}>
        <div className="project-title">
          <h2>{PROJECT_TITLES[projectNum.current]}</h2>
          <svg xmlns="http:///www.w3.org/2000/svg" viewBox="0 0 40 40" onClick={() => closeProject()}>
            <rect x="0" y="15" width="40" height="10" fill="white" transform="rotate(45 20 20)"/>
            <rect x="0" y="15" width="40" height="10" fill="white" transform="rotate(-45 20 20)"/>
          </svg>
        </div>
        <div style={{height: "93%", width: "100%", marginTop: "20px", borderRadius: "15px", overflow: "hidden"}}>
          <Graph/>
        </div>
      </div>}
    </div>
  );
};
export default Projects;