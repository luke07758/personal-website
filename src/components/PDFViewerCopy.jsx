import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFViewer, EventBus, PDFLinkService } from "pdfjs-dist/web/pdf_viewer.mjs";
import "pdfjs-dist/web/pdf_viewer.css";

import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const PDFViewerCopy = ({ url }) => {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const pdfViewerRef = useRef(null);
  const loadingTaskRef = useRef(null);

  const handleResize = () => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.currentScale = Math.min(
        window.innerWidth * 0.85,
        (12.8 * window.screen.height) / 9
      ) / 816;
    }
  };

  useEffect(() => {
    const eventBus = new EventBus();

    pdfViewerRef.current = new PDFViewer({
      container: viewerContainerRef.current,
      eventBus: eventBus,
      removePageBorders: true,
    });

    loadingTaskRef.current = pdfjsLib.getDocument(url);
    loadingTaskRef.current.promise.then(pdfDocument => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.setDocument(pdfDocument);
        handleResize();
      }
    }).catch(error => {
      console.error("Error loading PDF:", error);
    });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy();
      }
      if (pdfViewerRef.current?.pdfDocument) {
        pdfViewerRef.current.pdfDocument.destroy();
      }
      if (pdfViewerRef.current) {
        pdfViewerRef.current.cleanup();
        pdfViewerRef.current = null;
      }
      if (eventBus) {
        eventBus.dispatch("destruct", { source: this });
      }
    };
  }, []);

  return (
    <div id="viewerContainer" ref={viewerContainerRef} style={{ 
      position: 'absolute',
      left: "50%",
      transform: "translateX(-50%)",
    }}>
      <div id="viewer" className="pdfViewer" ref={viewerRef}></div>
    </div>
  );
};

export default PDFViewerCopy;