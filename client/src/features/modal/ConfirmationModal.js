import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectModalIsOpen,
  closeModal,
} from "./confirmationSlice";

const ConfirmationModal = (props) => {
  const dispatch = useDispatch();
  const modalIsOpen = useSelector(selectModalIsOpen);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      padding: "0px",
      background: "transparent",
      border: "none"
    },
    overlay: {
      backgroundColor: "lightgray",
      zIndex: 20
    },
  };


  Modal.setAppElement("#root");

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => dispatch(closeModal())}
      style={customStyles}
      contentLabel="Example Modal"
    >
      {props.body}
    </Modal>
  );
};

export default ConfirmationModal;
