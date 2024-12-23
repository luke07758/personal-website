import CppLogo from "../assets/cpp.svg";
import ReactLogo from "../assets/react.svg";
import JSLogo from "../assets/js.svg";
import PythonLogo from "../assets/python.svg";
import JavaLogo from "../assets/java.svg";
import LinuxLogo from "../assets/linux.svg";
import NodeLogo from "../assets/nodejs.svg";
import UTDLogo from "../assets/utd.png";
import TCCLogo from "../assets/tcc.png";

const About = (props) => {
  return (
    <div className="about-grid">
      <div className="card" style={props.mobile ?
        {gridColumn: "1 / end", gridRow: "1 / span 1",} :
        {}
      }>
        <h1>Software Engineer</h1>
        <h3>Dallas, TX</h3>
      </div>
      <div className="card" style={props.mobile ? 
        {gridColumn: "1 / end", gridRow: "2 / span 1"} :
        {gridRow: "2 / span 1"}
      }>
        <h2>About</h2>
        <p>Undergraduate student currently pursuing a Bachelor's in Computer Science at UT Dallas. Passionate about programming and front-end design.</p>
      </div>
      <div className="card skills" style={props.mobile ? 
        {gridColumn: "1 / end", gridRow: "3 / span 1"} :
        {gridColumn: "2 / end", gridRow: "1 / span 2"} 
      }>
        <h2>Skills</h2>
        <div className="skill-wrapper first-skill">
          <img src={CppLogo}/>
          <p>C/C++</p>
        </div>
        <div className="skill-wrapper">
          <img src={ReactLogo}/>
          <p>ReactJS</p>
        </div>
        <div className="skill-wrapper">
          <img src={JSLogo}/>
          <p>Javascript</p>
        </div>
        <div className="skill-wrapper">
          <img src={NodeLogo}/>
          <p>Node.js</p>
        </div>
        <div className="skill-wrapper">
          <img src={PythonLogo}/>
          <p>Python</p>
        </div>
        <div className="skill-wrapper">
          <img src={JavaLogo}/>
          <p>Java</p>
        </div>
        <div className="skill-wrapper">
          <img src={LinuxLogo}/>
          <p>Linux</p>
        </div>
      </div>
      <div className="card" style={{gridColumn: "1 / end"}}>
        <h2>Education</h2>
        <div className="edu-container" style={props.mobile ? {flexDirection: "column"} : {}}>
          <div className="edu-wrapper">
            <h2>Computer Science B.S.</h2>
            <div className="school-container">
              <img src={UTDLogo} height="60px"/>
              <div>
                <h3>The University of Texas at Dallas</h3>
                <h4>Richardson, TX</h4>
              </div>
            </div>
            <ul>
              <li>2023 - current</li>
              <li>3.65 GPA</li>
              <li>Expected Graduation: December 2025</li>
            </ul>
          </div>
          <div className="edu-wrapper">
            <h2>Computer Information Systems A.S.</h2>
            <div className="school-container">
              <img src={TCCLogo} height="60px"/>
              <div>
                <h3>Tulsa Community College</h3>
                <h4>Tulsa, OK</h4>
              </div>
            </div>
            <ul>
              <li>2021 - 2023</li>
              <li>3.43 GPA</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card" style={{gridColumn: "1 / end"}}>
        <h2>Relevant Coursework</h2>
        <ul className="course-list" style={props.mobile ? {"columns": "1"} : {}}>
          <li>Data Structure and Algorithm Analysis</li>
          <li>Computer Architecture</li>
          <li>Advanced Algorithm Design and Analysis</li>
          <li>Systems Programming in UNIX</li>
        </ul>
      </div>
    </div>
  );
  
};
export default About;