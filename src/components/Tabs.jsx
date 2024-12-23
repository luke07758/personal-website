import "./Tabs.css";

const Tabs = (props) => {
  const tabs = ["About", "Projects", "Resume", "Contact"];

  return(
    <div className="tab-wrapper" style={props.mobile ? { 
      flexDirection: "column", 
      alignItems: "end", 
      width: "100vw",
      margin: "10px 80px 0 0",
    } : {}}>
      {tabs.map((_,index) => {
        return (
          <div 
            className={`tab no-select ${index === props.currentTab ? "active" : ""}`}
            onClick={() => {
              props.setCurrentTab(index);
            }}
            key={index}
          >{tabs[index]}</div>
        );
      })}
    </div>
  );
};
export default Tabs;