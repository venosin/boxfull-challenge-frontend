'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col, Select, DatePicker, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

const { Title, Text } = Typography;
const { Option } = Select;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    const [messageApi, contextHolder] = message.useMessage();

    // 1. Intercepción del Submit
    const onFinish = (values: any) => {
        setFormData(values);
        setIsModalOpen(true); // Abrir modal en lugar de enviar
    };

    // 2. Confirmación final
    const handleConfirm = async () => {
        setLoading(true);
        setIsModalOpen(false);

        try {
            const values = formData;
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: `${values.whatsappPrefix || '+503'} ${values.whatsapp}`,
                password: values.password,
                birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
                gender: values.gender,
            };

            await api.post('/auth/register', payload);

            messageApi.success('Registro exitoso. Por favor inicia sesión.');
            router.push('/login');
        } catch (error: any) {
            console.error(error);
            messageApi.error(error.response?.data?.message || 'Error al registrarse');
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#585858' }}>
            {contextHolder}
            <Card
                variant="borderless"
                styles={{ body: { padding: 0 } }}
                style={{ width: '100%', maxWidth: 1000, height: 750, overflow: 'hidden', borderRadius: 0 }}
            >
                <Row style={{ height: '100%' }}>
                    <Col xs={24} md={12} style={{ padding: '40px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                            <Link href="/login" style={{ marginRight: 8, color: '#1f1f1f', fontSize: 16 }}>&lt;</Link>
                            <Title level={4} style={{ margin: 0 }}>Cuéntanos de ti</Title>
                        </div>

                        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                            Completa la información de registro
                        </Text>

                        <Form
                            name="register"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                            initialValues={{ whatsappPrefix: '+503' }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Nombre" name="firstName" rules={[{ required: true, message: 'Requerido' }]}>
                                        <Input placeholder="Digita tu nombre" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Apellido" name="lastName" rules={[{ required: true, message: 'Requerido' }]}>
                                        <Input placeholder="Digita tu apellido" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Sexo" name="gender">
                                        <Select placeholder="Seleccionar">
                                            <Option value="M">Masculino</Option>
                                            <Option value="F">Femenino</Option>
                                            <Option value="O">Otro</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Fecha de nacimiento" name="birthDate">
                                        <DatePicker style={{ width: '100%' }} placeholder="Seleccionar" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Correo electrónico" name="email" rules={[{ required: true, message: 'Requerido' }, { type: 'email', message: 'Inválido' }]}>
                                <Input placeholder="Digita correo" />
                            </Form.Item>

                            <Form.Item label="Número de whatsapp" style={{ marginBottom: 0 }}>
                                <Row gutter={8}>
                                    <Col span={6}>
                                        <Form.Item name="whatsappPrefix" noStyle>
                                            <Select>
                                                <Option value="+503">+503</Option>
                                                <Option value="+1">+1</Option>
                                                <Option value="+52">+52</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={18}>
                                        <Form.Item
                                            name="whatsapp"
                                            rules={[
                                                { required: true, message: 'Requerido' },
                                                { pattern: /^\d{8}$/, message: 'Debe tener 8 dígitos' }
                                            ]}
                                        >
                                            <Input placeholder="0000 0000" maxLength={8} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Requerido' }, { min: 6, message: 'Mínimo 6 caracteres' }]}>
                                        <Input.Password placeholder="Digita contraseña" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Repetir contraseña"
                                        name="confirmPassword"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Requerido' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                                                    return Promise.reject(new Error('No coinciden'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder="Digita contraseña" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: 24 }}>
                                <Button type="primary" htmlType="submit" block style={{ fontWeight: 600 }}>
                                    Siguiente
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={0} md={12} style={{ backgroundColor: '#f0f0f0' }}>
                        {/* Placeholder */}
                    </Col>
                </Row>
            </Card>

            {/* Modal estricto con diseño solicitado */}
            <Modal
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                centered
                width={400}
                closeIcon={<span style={{ fontSize: 20 }}>×</span>}
                styles={{ body: { textAlign: 'center', padding: '20px 0' } }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    {/* Círculo de fondo suave */}
                    <div style={{ backgroundColor: '#FFF7E6', borderRadius: '50%', padding: 20 }}>
                        {/* Icono de Advertencia */}
                        <img src="/icons/icon-warning.svg" alt="Warning" style={{ width: 40, height: 40 }} />
                    </div>
                </div>

                <Title level={4} style={{ marginBottom: 8 }}>Confirmar número <strong>de teléfono</strong></Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 30, padding: '0 20px', fontSize: 14 }}>
                    ¿Está seguro de que desea continuar con el número <strong>{formData ? `${formData.whatsappPrefix || '+503'} ${formData.whatsapp}` : ''}</strong>?
                </Text>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <Button size="large" onClick={() => setIsModalOpen(false)} style={{ width: 120, borderRadius: 6 }}>
                        Cancelar
                    </Button>
                    <Button size="large" type="primary" onClick={handleConfirm} loading={loading} style={{ width: 120, borderRadius: 6, backgroundColor: '#2E49CE' }}>
                        Aceptar
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
