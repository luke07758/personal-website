import PDFViewerCopy from "./PDFViewerCopy";

const Resume = () => {
  const resumeURL = "/resume.pdf";

  return (
    <div className="resume-grid">
      <div className="card">
        <h2>Resume</h2>
        <h3 style={{fontSize: "26px"}}>Click <a href={resumeURL} target="_blank" rel="noopener noreferrer">here</a> to download PDF</h3>
      </div>
      <div className="card" style={{
        padding: "0", 
        width: "100%", 
        aspectRatio: "17/22", 
        overflow: "hidden", 
        background: "white", 
        borderRadius: "15px"
      }}>
        <PDFViewerCopy url={resumeURL}/>
      </div>
    </div>
  );
};
export default Resume;