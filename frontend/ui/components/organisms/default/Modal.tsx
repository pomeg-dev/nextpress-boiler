import classNames from "classnames";
import { ReactNode } from "react";
import Button from "../../atoms/Button";

type ModalProps = {
  children: ReactNode;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  maxWidth?: string;
  maxHeight?: string;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({
  children,
  showModal,
  setShowModal,
  maxWidth,
  maxHeight,
  className,
}) => {
  const style: React.CSSProperties = {
    ...(maxWidth && { maxWidth }),
    ...(maxHeight && { maxHeight }),
  };

  return (
    <div
      className={classNames(
        "fixed left-0 top-0 h-screen w-screen bg-white/70 transition-opacity overflow-auto",
        showModal
          ? "opacity-100 z-[9999] pointer-events-auto"
          : "opacity-0 z-[-999] pointer-events-none",
        className
      )}
    >
      <div
        className={classNames(
          "absolute left-1/2 top-1/2 h-fit md:min-h-[unset] min-h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 transition-transform",
          showModal ? "scale-100" : "scale-0"
        )}
        style={style}
      >
        <Button
          className="!absolute right-[15px] top-[15px] z-50"
          style="high-contrast"
          iconRight="Close"
          type="button"
          onClick={() => setShowModal(false)}
        />
        {children}
      </div>
    </div>
  );
}

export default Modal;