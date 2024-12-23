import {useState, useEffect, useRef} from "react";
import LoadingIcon from "../assets/loading.svg";

const Contact = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [loadingState, setLoadingState] = useState(0);
  const submitRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const turnstileToken = useRef("");
  const abortController = useRef(null);
  const widgetId = useRef(null);
  const [captchaVisibility, setCaptchaVisibility] = useState("hidden");
  const [formDisabled, setFormDisabled] = useState(false);

  const closeLoading = () => {
    if (loadingState === 0 && abortController.current) {
      // Cancel fetch
      abortController.current.abort();
    } else if (loadingState === 1) {
      // Clear form fields
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    }
    // Reset turnstile widget
    if (window.turnstile && widgetId.current) {
      window.turnstile.reset(widgetId.current);
    }
    setIsLoading(false); 
    setLoadingState(0);
  }

  useEffect(() => {
    if (loadingState !== 0) {
      const visibleDelay = setTimeout(() => setLoadingVisible(false), 250);
      return () => {
        clearTimeout(visibleDelay);
      };
    }
    setLoadingVisible(true);
  }, [loadingState]);

  useEffect(() => {
    if (!widgetId.current && window.turnstile) {
      widgetId.current = window.turnstile.render("#turnstile-widget", {
        sitekey: import.meta.env.VITE_SITE_KEY,
        theme: "dark",
        size: "flexible",
        callback: (token) => {
          if (captchaVisibility === "visible") {
            setCaptchaVisibility("hidden");
          }
          turnstileToken.current = token;
        },
        "expired-callback": () => {
          turnstileToken.current = "";
        },
        "error-callback": () => {
          turnstileToken.current = "";
        },
        "timeout-callback": () => {
          turnstileToken.current = "";
        },
        "unsupported-callback": () => {
          setFormDisabled(true);
        },
      });
    };

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, []);

  return (
    <div className="contact-grid">
      <div className="card" style={{gridColumn: "1 / end", gridRow: "1 / span 1"}}>
        <h2>Contact</h2>
      </div>
      <div style={{gridColumn: props.mobile ? "1 / end" : "1 / span 1", gridRow: "2 / span 2", position: "relative"}}>
        <div className="card" style={
            formDisabled ? 
            {
              msFilter: "blur(5px) grayscale(100%)",
              webkitFilter: "blur(5px) grayscale(100%)",
              filter: "blur(5px) grayscale(100%)",
              pointerEvents: "none"
            } : 
            {}
          }>
          <form>
            <label htmlFor="name">Name</label><br/>
            <input type="text" id="name" name="name" className="form" ref={nameRef}/><br/>
            <label htmlFor="email">Email</label><br/>
            <input type="text" id="email" name="email" className="form" ref={emailRef}/><br/>
            <label htmlFor="message">Message</label><br/>
            <textarea id="message" name="message" cols="40" rows="5" className="form contact-message" ref={messageRef}/>
            <p style={{color: "#db4548", visibility: captchaVisibility, marginTop: "5px", marginBottom: "10px"}}>Please complete the CAPTCHA.</p>
              <div className="form-submit" style={props.mobile ? {flexDirection: "column"} : {height: "65px"}}>
                <div id="turnstile-widget"/>
                <div style={{flex: "1", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                  <div className="form-button" ref={submitRef} onClick={async () => {
                    if (nameRef && emailRef && messageRef) {
                      if (turnstileToken.current === "") {
                        setCaptchaVisibility("visible");
                      } else {
                        // Show div with loading icon
                        setIsLoading(true);
                        if (abortController.current) abortController.current.abort();
                        abortController.current = new AbortController();
                        try {
                          // Call API with token
                          fetch("https://api.lukenelson.io/submit-form", {
                            method: "POST",
                            signal: abortController.current.signal,
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              token: `${turnstileToken.current}`,
                              name: `${nameRef.current.value}`,
                              email: `${emailRef.current.value}`,
                              message: `${messageRef.current.value}`,
                            }),
                          }).then((response) => {
                            if (response.status === 200) {
                              // request succeeded
                              setLoadingState(1);
                            } else throw new Error();
                          });
                        } catch (error) {
                          // server error or invalid token
                          setLoadingState(2);
                        }
                      }
                    }
                  }}>Send Message</div>
                </div>
              </div>
              <p>By submitting this form, you agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
            </form>
        </div>
        {formDisabled && <div className="card disabled-message">
          <p>Your browser is not supported. Use another browser or <a href={import.meta.env.VITE_EMAIL}>email</a> me instead.</p>
        </div>}
      </div>
      <div className="card contact-card" style={props.mobile ?
        {gridColumn: "1 / end", gridRow: "4 / span 1"} :
        {gridColumn: "2 / end", gridRow: "2 / span 1"}
      }>
        <h2>Fill out this form to contact me.</h2>
      </div>
      <div className="card contact-card" style={props.mobile ?
        {gridColumn: "1 / end", gridRow: "5 / span 1"} :
        {gridColumn: "2 / end", gridRow: "3 / span 1"}
      }>
        <h2>Alternatively, you can email me at <a href={`mailto:${import.meta.env.VITE_EMAIL}`}>{import.meta.env.VITE_EMAIL}</a>.</h2>
      </div>
      {isLoading && <div className="loading-wrapper">
        <div className="loading-card" style={{border: "1px solid #303030", width: "380px", height: "260px"}}>
          <div className="loading-icon-container">
            <div style={{position: "relative", height: "40px", width: "40px"}}>
              <img className="loading-icon message-icon" src={LoadingIcon} style={{zIndex: "9", visibility: loadingVisible ? "visible" : "hidden"}}/>
              {loadingState === 1 && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="message-icon" style={{zIndex: "10"}}>
                <clipPath id="icon-transition">
                  <circle cx="200" cy="200" r="0">
                    <animate attributeName="r" from="0" to="200" dur="0.25s" fill="freeze"/>
                  </circle>
                </clipPath>
                <clipPath id="loading-icon-clippath" clipPath="url(#icon-transition)">
                  <rect x="0" y="0" width="0" height="400">
                    <animate attributeName="width" from="0" to="400" dur="0.5s" fill="freeze"/>
                  </rect>
                </clipPath>
                <g id="a" data-name="Layer 1" clipPath="url(#icon-transition)">
                  <circle cx="200" cy="200" r="200" style={{fill: "#5cc881"}}/>
                </g>
                <g id="b" data-name="Layer 2" clipPath="url(#loading-icon-clippath)">
                  <path d="M103.4,146.07l-53.56,53.56,149.98,149.98,53.56-53.56,141.45-141.45c-6.25-26.92-17.93-51.76-33.83-73.29l-161.18,161.18-96.41-96.41Z" style={{fill: "#fff"}}/>
                  <path d="M245.09,394.9c88.74-20.45,154.91-99.94,154.91-194.9,0-15.63-1.8-30.84-5.19-45.44l-195.03,195.03,45.31,45.31Z" style={{fill: "#1ea04a"}}/>
                </g>
              </svg>}
              {loadingState === 2 && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="message-icon" style={{zIndex: "10"}}>
                <clipPath id="icon-transition">
                  <circle cx="200" cy="200" r="0">
                    <animate attributeName="r" from="0" to="200" dur="0.25s" fill="freeze"/>
                  </circle>
                </clipPath>
                <clipPath id="loading-icon-clippath" clipPath="url(#icon-transition)">
                  <rect x="0" y="0" width="0" height="400">
                    <animate attributeName="width" from="0" to="400" dur="0.5s" fill="freeze"/>
                  </rect>
                </clipPath>
                <g id="a" data-name="Layer 1" clipPath="url(#icon-transition)">
                  <circle cx="200" cy="200" r="200" style={{fill: "#db4548"}}/>
                </g>
                <g id="b" data-name="Layer 2" clipPath="url(#loading-icon-clippath)">
                  <path d="M400,200c0-1.42-.02-2.83-.05-4.25l-71.49-71.49-205.2,205.2,70.44,70.44c2.09.06,4.19.1,6.3.1,110.46,0,200-89.54,200-200Z" style={{fill: "#b30f12"}}/>
                  <rect x="53.9" y="162" width="290.2" height="76" transform="translate(199.71 -82.14) rotate(45)" style={{fill: "#fff"}}/>
                  <rect x="53.9" y="162" width="290.2" height="76" transform="translate(-83.14 199.29) rotate(-45)" style={{fill: "#fff"}}/>
                </g>
              </svg>}
            </div>
          </div>
          {loadingState === 0 && <p>Sending message...</p>}
          {loadingState === 1 && <p>Your message was sent successfully. Thank you for reaching out! I will get back to you shortly.</p>}
          {loadingState === 2 && <p>There was an error while sending your message. Please try again or <a href="mailto:luke@lukenelson.io">email</a> me instead.</p>}
          {loadingState === 0 && <div className="loading-cancel-button" onClick={() => closeLoading()}>Cancel</div>}
          {loadingState !== 0 && <div className="form-button" style={{ marginTop: "36px" }}onClick={() => closeLoading()}>Close</div>}
        </div>
      </div>}
    </div>
  );
};
export default Contact;