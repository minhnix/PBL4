import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import "../../src/index.css";
import { calculateTimeDifference } from "../utils/formatTime";

const Modal = ({ children, onClose }) => {
  const modalRoot = document.getElementById("portal-root");
  const el = document.createElement("div");

  React.useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    el
  );
};

const MessagePopUpModal = ({ fileUrl }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleCloseModal = () => {
    setIsZoomed(false);
  };

  useEffect(() => {
    const img = new Image();
    img.src = fileUrl;

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxHeight = window.innerHeight * 0.7;
      const maxWidth = window.innerWidth * 0.7;

      if (aspectRatio > 1) {
        setImageSize({ width: maxWidth, height: maxWidth / aspectRatio });
      } else {
        setImageSize({ width: maxHeight * aspectRatio, height: maxHeight });
      }
    };
  }, [fileUrl]);

  return (
    <>
      <div
        className={`image-container ${isZoomed ? "zoomed z-100 " : ""}`}
        onClick={handleImageClick}
      >
        <img
          src={fileUrl}
          alt="image-content"
          onClick={handleImageClick}
          className="zoomable-image"
        />
      </div>

      {isZoomed && (
        <Modal onClose={handleCloseModal}>
          <div className="relative">
            <AiOutlineClose
              className="p-2 rounded-full bg-white absolute top-2 left-2 hover:cursor-pointer hover:opacity-60"
              size={32}
              onClick={handleCloseModal}
            />
            <img
              src={fileUrl}
              alt="image-content"
              className="zoomable-image-modal"
              style={{ width: imageSize.width, height: imageSize.height }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default MessagePopUpModal;
