import React from 'react';
import { Modal, Button, Typography } from 'antd';

const { Title, Text } = Typography;

interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
    onCreateAnother: () => void;
    onGoHome: () => void;
}

export default function SuccessModal({ open, onClose, onCreateAnother, onGoHome }: SuccessModalProps) {
    return (
        <Modal
            open={open}
            footer={null}
            closable={true}
            onCancel={onClose}
            centered
            width={500}
        >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <div style={{ backgroundColor: '#E6FFFA', borderRadius: '50%', padding: 30 }}>
                        <img src="/icons/icon-success.svg" alt="Success" style={{ width: 60, height: 60 }} />
                    </div>
                </div>

                <Title level={3} style={{ marginBottom: 8 }}>Orden <strong>enviada</strong></Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                    La orden ha sido creada y enviada, puedes
                </Text>

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40 }}>
                    <Button size="large" style={{ width: 160 }} onClick={onGoHome}>
                        Ir a inicio
                    </Button>
                    <Button type="primary" size="large" style={{ width: 160, backgroundColor: '#2E49CE' }} onClick={onCreateAnother}>
                        Crear otra
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
