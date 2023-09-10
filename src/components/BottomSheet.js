import React, { useState, useEffect, useRef } from "react";
import "./BottomSheet.css";

const BottomSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(40);

  let isDragging = false;
  let startY = 0;
  let startHeight = 0;

  // Refs for accessing DOM elements
  const contentElementRef = useRef(null);
  const sheetElementRef = useRef(null);
  const dragIconElementRef = useRef(null);
  const overlayElementRef = useRef(null);
  const showModalButtonElementRef = useRef(null);

  // Methods to manipulate the element

  const showSheet = () => {
    setIsVisible(true);
    document.body.style.overflowY = "hidden";
    updateSheetHeight(50);
  };

  const updateSheetHeight = (newHeight) => {
    if (contentElementRef.current) {
      contentElementRef.current.style.height = `${newHeight}vh`;
      setHeight(newHeight);
    }
  };

  const hideSheet = () => {
    setIsVisible(false);
    document.body.style.overflowY = "auto";
  };

  const startDrag = (e) => {
    isDragging = true;
    const clientY = e.pageY;
    startY = clientY;
    if (contentElementRef.current) {
      const newHeight = parseInt(contentElementRef.current.style.height);
      startHeight = newHeight;
    }
    if (sheetElementRef.current) {
      sheetElementRef.current.classList.add("dragging");
    }
  };

  const touchStartDrag = (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      const clientY = e.touches[0].pageY;
      startY = clientY;
      if (contentElementRef.current) {
        const newHeight = parseInt(contentElementRef.current.style.height);
        startHeight = newHeight;
      }
    }
  };

  const duringDrag = (e) => {
    if (!isDragging) return;
    const clientY = e ? e.pageY : e.touches[0].pageY;
    const delta = startY - clientY;
    const newHeight = startHeight + (delta / window.innerHeight) * 100;
    updateSheetHeight(newHeight);
  };

  const stopDrag = () => {
    isDragging = false;
    if (sheetElementRef.current) {
      sheetElementRef.current.classList.remove("dragging");
    }
    if (contentElementRef.current) {
      const sheetHeight = parseInt(contentElementRef.current.style.height) || 0;
      sheetHeight < 40
        ? updateSheetHeight(30)
        : sheetHeight > 75
        ? updateSheetHeight(90)
        : updateSheetHeight(50);
    }
  };

  // Use useEffect to add event listeners when the component mounts
  useEffect(() => {
    const dragIconElement = dragIconElementRef.current;
    const overlayElement = overlayElementRef.current;
    const showModalButtonElement = showModalButtonElementRef.current;

    if (dragIconElement) {
      dragIconElement.addEventListener("mousedown", startDrag);
      dragIconElement.addEventListener("touchstart", touchStartDrag, {
        passive: true,
      });
    }

    if (overlayElement) {
      overlayElement.addEventListener("click", hideSheet);
    }

    if (showModalButtonElement) {
      showModalButtonElement.addEventListener("click", showSheet);
    }

    document.addEventListener("mousemove", duringDrag);
    document.addEventListener("touchmove", duringDrag);

    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);

    // Cleanup event listeners when the component unmounts
    return () => {
      if (dragIconElement) {
        dragIconElement.removeEventListener("mousedown", startDrag);
        dragIconElement.removeEventListener("touchstart", touchStartDrag);
      }

      if (overlayElement) {
        overlayElement.removeEventListener("click", hideSheet);
      }

      if (showModalButtonElement) {
        showModalButtonElement.removeEventListener("click", showSheet);
      }
      document.removeEventListener("mousemove", duringDrag);
      document.removeEventListener("touchmove", duringDrag);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchend", stopDrag);
    };
  }, []);

  return (
    <div>
      <button className="show-modal" ref={showModalButtonElementRef}>
        Open
      </button>
      <div
        className={`bottom-sheet ${isVisible ? "show" : ""}`}
        ref={sheetElementRef}
      >
        <div className="sheet-overlay" ref={overlayElementRef}></div>
        <div className="content" ref={contentElementRef}>
          <div className="header">
            <div className="drag-icon" ref={dragIconElementRef}>
              <span></span>
            </div>
          </div>
          <div className="body">
            <h2>Bottom Sheet</h2>
            <div>
              <button
                onClick={() => updateSheetHeight(90)}
                disabled={height === 90}
              >
                Top
              </button>
              <button
                onClick={() => updateSheetHeight(50)}
                disabled={height === 50}
              >
                Middle
              </button>
              <button
                onClick={() => updateSheetHeight(30)}
                disabled={height === 30}
              >
                Bottom
              </button>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              erat urna, laoreet id augue eget, consequat placerat quam. Morbi
              finibus commodo eros, sollicitudin rutrum erat ultricies lobortis.
              Donec purus enim, facilisis id commodo at, rhoncus vitae justo.
              Integer pellentesque neque id tristique hendrerit. Vivamus posuere
              iaculis massa pulvinar efficitur. Sed nec lectus quis massa
              sagittis egestas sed nec ex. Donec luctus euismod nisi vitae
              molestie. Praesent nec ultrices dolor. Fusce semper erat quis
              metus dictum, et imperdiet velit fringilla. Sed porttitor mi ut
              purus rhoncus, sit amet blandit odio posuere. Suspendisse suscipit
              et purus hendrerit mattis. Fusce et massa risus.
            </p>
            <p>
              Vivamus sapien dui, gravida eu turpis quis, lobortis pellentesque
              massa. Donec quis sodales ipsum. Ut varius tellus vitae enim
              ullamcorper, non iaculis purus commodo. Duis tempus mauris nec
              accumsan dignissim. Phasellus in mattis nunc, eget dapibus augue.
              Proin vitae dui eget risus rutrum condimentum. Morbi in lorem
              lacus. Pellentesque id eros justo. Nunc dictum felis augue, vitae
              eleifend ante varius nec. Cras interdum turpis vitae dolor
              fermentum, sed posuere mi congue. Quisque orci orci, tincidunt nec
              leo non, mollis elementum quam.
            </p>
            <p>
              Etiam lobortis mattis consectetur. Morbi euismod augue et sem
              facilisis fringilla. In varius felis at tellus ultrices, ac
              consectetur ligula elementum. Suspendisse sit amet dui interdum,
              ullamcorper dolor vitae, varius ex. Phasellus vitae dictum tellus,
              at interdum nisi. Pellentesque dictum lorem mauris, eu fermentum
              dui interdum et. Nullam fringilla accumsan mauris. Morbi vitae dui
              mattis, ullamcorper ante sit amet, imperdiet augue. Cras eget urna
              enim. Etiam tincidunt sem ac erat aliquet, sit amet sodales est
              condimentum.
            </p>
            <p>
              Morbi vel elementum ex. Curabitur sit amet risus ultrices,
              tristique mi nec, accumsan enim. Aliquam ligula nibh, lacinia vel
              sapien eu, ultrices semper mauris. Aenean libero magna, suscipit
              vitae nunc sit amet, iaculis cursus nibh. In sit amet dolor sem.
              Suspendisse interdum mauris a auctor dictum. Sed id magna urna.
              Etiam id risus metus. Sed tristique neque ipsum, sed faucibus leo
              rhoncus et.
            </p>
            <p>
              Sed vitae nunc maximus, tempus lacus ac, vestibulum tellus. Proin
              accumsan erat augue, ut pellentesque tortor feugiat a. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. In et molestie enim, sed consequat turpis.
              Aliquam porttitor erat id ante finibus commodo. Proin venenatis
              justo ut nulla interdum commodo. Etiam lorem nisi, auctor tempor
              velit nec, sagittis lobortis tellus. Nunc malesuada lorem arcu, eu
              pellentesque lacus gravida in. Suspendisse ut ultrices augue.
              Vivamus tortor dolor, malesuada id viverra eget, vehicula nec
              eros. Cras condimentum turpis non ligula malesuada, id eleifend
              justo luctus. Ut vitae tellus cursus, porta neque et, commodo
              felis. Sed felis ante, ultricies quis venenatis ornare, tincidunt
              at neque. Maecenas porttitor et diam vel congue. Pellentesque
              semper, eros et egestas euismod, diam felis pharetra augue, eu
              posuere augue sem nec orci.
            </p>
            <p>
              Nulla convallis tempor tellus a rhoncus. Nulla finibus feugiat
              scelerisque. Pellentesque justo odio, tristique quis dui a,
              posuere tempus ex. Fusce aliquet semper augue, lacinia placerat
              ante vehicula sit amet. Pellentesque habitant morbi tristique
              senectus et netus et malesuada fames ac turpis egestas. Nam at
              elit in felis condimentum finibus nec sit amet ipsum. Aliquam
              gravida leo nisl, quis efficitur nisl placerat ac. Nullam in risus
              sed augue tincidunt pharetra. Suspendisse vehicula velit eget urna
              luctus, semper lacinia urna finibus. Phasellus vitae neque vitae
              sem sodales volutpat quis et velit. Etiam posuere erat sapien,
              quis condimentum urna sodales nec. Etiam condimentum, orci in
              posuere cursus, enim felis tristique ipsum, ac pharetra tellus
              tortor non nunc. In commodo risus ligula, a pulvinar odio
              vulputate id. Cras ac ipsum scelerisque, rutrum orci id, faucibus
              metus. Maecenas in nulla neque.
            </p>
            <p>
              Nunc magna purus, condimentum et dapibus ac, placerat vel neque.
              Nam a tempus augue. Integer ultrices urna arcu, a tempus elit
              faucibus luctus. Suspendisse nibh ipsum, vulputate eu quam
              maximus, euismod scelerisque nulla. Suspendisse at molestie quam,
              eu rhoncus dolor. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Aenean vehicula purus ac ante luctus, vel
              pellentesque diam ornare. In tortor sem, ullamcorper at magna in,
              tincidunt lacinia enim. Class aptent taciti sociosqu ad litora
              torquent per conubia nostra, per inceptos himenaeos. Vestibulum
              condimentum aliquam mauris id congue. Curabitur eu volutpat velit,
              sed eleifend metus. Nunc malesuada, mauris et dapibus tincidunt,
              erat nulla venenatis lacus, nec imperdiet metus nibh eget leo.
              Proin ut condimentum metus. Vestibulum in finibus nibh. Duis nec
              nisi auctor, imperdiet nisl vel, fringilla turpis. Aliquam eget
              commodo mi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
