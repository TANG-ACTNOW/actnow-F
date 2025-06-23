'use client';
import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Modal } from '@/components/modals/Modal';
import { SettingDialog } from '@/components/modals/dialogs/SettingDialog';
import { LoginDialog } from '@/components/modals/dialogs/LoginDialog';
import { RegisterDialog } from '@/components/modals/dialogs/RegisterDialog';
import { CreateMemoDialog } from '@/components/modals/dialogs/CreateMemoDialog';
import { EditMemoDialog } from '@/components/modals/dialogs/EditMemoDialog';

interface ModalManagerProps {
  onModalOpenChange?: (isOpen: boolean) => void;
}

export const ModalManager: React.FC<ModalManagerProps> = ({ onModalOpenChange }) => {
  const { 
    currentModal, 
    closeModal, 
    isLoggedIn,
    openModal
  } = useApp();

  // 监听登录状态变化，自动切换到设置界面
  useEffect(() => {
    if (currentModal && isLoggedIn && (currentModal === 'login' || currentModal === 'register')) {
      console.log('User logged in, switching to settings modal');
      openModal('setting');
    }
    // modal开关同步到外部
    onModalOpenChange?.(!!currentModal);
  }, [isLoggedIn, currentModal, openModal, onModalOpenChange]);

  const getModalTitle = () => {
    if (isLoggedIn) {
      if (currentModal === 'setting') return '设置';
      if (currentModal === 'create-memo') return '新建便签';
      if (currentModal === 'edit-memo') return '编辑便签';
    }
    switch (currentModal) {
      case 'login':
        return '登录';
      case 'register':
        return '注册';
      default:
        return '';
    }
  };

  const renderModalContent = () => {
    if (isLoggedIn) {
      if (currentModal === 'setting') {
        return <SettingDialog onClose={closeModal} />;
      }
      if (currentModal === 'create-memo') {
        return <CreateMemoDialog isOpen={true} onClose={closeModal} />;
      }
      if (currentModal === 'edit-memo') {
        return <EditMemoDialog isOpen={true} onClose={closeModal} />;
      }
    }
    switch (currentModal) {
      case 'login':
        return (
          <LoginDialog 
            isOpen={true}
            onClose={closeModal}
            onRegisterClick={() => openModal('register')}
          />
        );
      case 'register':
        return (
          <RegisterDialog
            isOpen={true}
            onClose={closeModal}
            onLoginClick={() => openModal('login')}
          />
        );
      default:
        return null;
    }
  };

  if (!currentModal) return null;

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      title={getModalTitle()}
      noPadding={currentModal === 'setting'}
    >
      {renderModalContent()}
    </Modal>
  );
}; 