import {useEffect, useRef} from "react";
import * as pdfJSLib from "pdfjs-dist";
import pdfJSWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfJSLib.GlobalWorkerOptions.workerSrc = pdfJSWorker;

const PDFViewer = (props) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const abortController = useRef(null);
  const renderRef = useRef(null);
  const pdfRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    abortController.current = new AbortController();

    const renderPDF = async () => {
      try {
        if (renderRef.current) {
          renderRef.current.cancel();
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!containerRef.current 
          || !canvasRef.current 
          || !pageRef.current
          || abortController.current.signal.aborted
        ) {
          return;
        }

        const viewport = pageRef.current.getViewport({
          scale: containerRef.current.clientWidth / pageRef.current.getViewport({ scale: 1.0 }).width,
        });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        renderRef.current = pageRef.current.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderRef.current.promise;
      } catch (error) {
        if (!abortController.current.signal.aborted) {
          console.error("Error rendering PDF:", error);
        }
      }
    };

    const loadPDF = async () => {
      try {
        pdfRef.current = await pdfJSLib.getDocument({
          url: props.url,
          signal: abortController.current
        }).promise;

        if (abortController.current.signal.aborted) {
          return;
        }

        pageRef.current = await pdfRef.current.getPage(1);
        await renderPDF();
      } catch (error) {
        if (!abortController.current.signal.aborted) {
          console.error("Error loading PDF:", error);
        }
      }
    };

    loadPDF();

    const handleResize = () => {
      renderPDF();
    };

    window.addEventListener("resize", handleResize);

    return(() => {
      abortController.current.abort();
      if (renderRef.current) {
        renderRef.current.cancel();
      }
      if (pdfRef.current) {
        pdfRef.current.destroy();
      }
    });
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%" }}/>
    </div>
  );
};
export default PDFViewer;