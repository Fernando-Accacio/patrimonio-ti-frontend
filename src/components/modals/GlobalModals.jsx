import React from 'react';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import PromptModal from './PromptModal';

export default function GlobalModals({ alertModal, setAlertModal, confirmModal, setConfirmModal, promptModal, setPromptModal }) {
  return (
    <>
      <AlertModal 
        show={alertModal.show} 
        title={alertModal.title} 
        message={alertModal.message} 
        type={alertModal.type} 
        onClose={() => setAlertModal({ ...alertModal, show: false })} 
      />

      <ConfirmModal 
        show={confirmModal.show} 
        title={confirmModal.title} 
        message={confirmModal.message} 
        onCancel={() => setConfirmModal({ ...confirmModal, show: false })} 
        onConfirm={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, show: false }); }} 
      />

      <PromptModal 
        show={promptModal.show} 
        title={promptModal.title} 
        placeholder={promptModal.placeholder} 
        inputValue={promptModal.inputValue} 
        setInputValue={(val) => setPromptModal({ ...promptModal, inputValue: val })} 
        isPassword={promptModal.isPassword} 
        allowEmpty={promptModal.allowEmpty} 
        onCancel={() => setPromptModal({ ...promptModal, show: false, inputValue: '' })} 
        onConfirm={async () => {
          await promptModal.onConfirm?.(promptModal.inputValue);
          setPromptModal({ ...promptModal, show: false, inputValue: '' });
        }} 
      />
    </>
  );
}