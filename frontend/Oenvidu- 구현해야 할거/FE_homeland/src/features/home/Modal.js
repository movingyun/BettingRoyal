import React from "react";
import "./Modal.css";

const Modal = (props) => {
  // 열기, 닫기, 모달 텍스트를 부모로부터 받아옴
  const { open, close } = props;

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <main>{props.children}</main>
          {/*
          <footer>
            <button className="close" onClick={close}>
              {' '}
              close{' '}
            </button>
          </footer>
          */}
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
