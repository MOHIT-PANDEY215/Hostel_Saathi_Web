import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import Image from "next/image";
import React from "react";

interface ImageModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  src: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onOpenChange, title, src }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" classNames={{
        base:'p-8',
        closeButton:'m-8 border-gray-500 border-2 outline:none data-[focus-visible=true]:outline-0'
    }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="flex justify-center items-center h-full">
              <div className="relative w-4/5 h-4/5 p-20">
                <Image src={src} alt={title} layout="fill" objectFit="contain" />
              </div>
            </ModalBody>
            <ModalFooter className="absolute bottom-5 left-0 w-full flex justify-center">
              <Button className="border-2 border-pink-700 rounded-full" color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ImageModal;
