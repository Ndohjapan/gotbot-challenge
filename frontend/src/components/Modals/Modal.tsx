interface ModalProps {
  children: React.ReactNode;
  visible: boolean;
  setModalVisible: (value: boolean) => void;
}

export default function Modal({ children, visible, setModalVisible }: ModalProps) {
  return (
    <>
      {visible && (
        <div
          className="fixed z-[100] top-0 left-0 right-0 bottom-0 w-full h-full bg-black bg-opacity-40 flex items-end md:items-center justify-center"
          onClick={() => setModalVisible(false)}
        >
          <div className="md:-translate-y-20" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
