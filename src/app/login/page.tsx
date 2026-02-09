'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

const { Title, Text } = Typography;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', values);
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            if (user && user.firstName) {
                localStorage.setItem('userName', user.firstName);
            }

            messageApi.success('Bienvenido de nuevo');
            router.push('/dashboard');
        } catch (error: any) {
            console.error(error);
            messageApi.error(error.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#585858' }}>
            {contextHolder}
            <Card
                variant="borderless"
                styles={{ body: { padding: 0 } }}
                style={{ width: '100%', maxWidth: 900, height: 600, overflow: 'hidden', borderRadius: 0 }}
            >
                <Row style={{ height: '100%' }}>
                    {/* Columna Izquierda: Formulario */}
                    <Col xs={24} md={12} style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ marginBottom: 40 }}>
                            <img src="/icons/logo-boxful.svg" alt="Boxful" style={{ maxHeight: 40 }} />
                        </div>

                        <Title level={3} style={{ marginBottom: 8 }}>Bienvenido de nuevo</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
                            Inicia sesión para continuar
                        </Text>

                        <Form
                            name="login"
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Correo electrónico"
                                name="email"
                                rules={[{ required: true, message: 'Por favor ingresa tu correo' }, { type: 'email', message: 'Correo inválido' }]}
                            >
                                <Input placeholder="ejemplo@correo.com" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Contraseña"
                                name="password"
                                rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                            >
                                <Input.Password placeholder="Contraseña" size="large" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ fontWeight: 600 }}>
                                    Iniciar sesión
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center' }}>
                                <Text>¿No tienes una cuenta? <Link href="/register" style={{ fontWeight: 600 }}>Regístrate</Link></Text>
                            </div>
                        </Form>
                    </Col>

                    {/* Columna Derecha: Placeholder/Imagen */}
                    <Col xs={0} md={12} style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Puedes agregar una imagen aquí más tarde */}
                    </Col>
                </Row>
            </Card>
        </div>
    );
}
