'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, ConfigProvider, Button } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: React.ReactNode;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [balance, setBalance] = useState<number | null>(null);
    const [userName, setUserName] = useState<string>('Usuario');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

        const fetchBalance = async () => {
            try {
                const response = await api.get('/orders/balance');
                setBalance(response.data.totalSettlement);
            } catch (error) {
                console.error('Error al obtener balance:', error);
            }
        };
        fetchBalance();
    }, []);

    // Helper para estilos activos/inactivos
    const getButtonStyle = (isActive: boolean) => ({
        height: 50,
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: isActive ? '#2E49CE' : 'transparent', // Azul vs Transparente
        color: isActive ? '#fff' : '#333', // Blanco vs Gris Oscuro
        boxShadow: isActive ? '0 4px 14px 0 rgba(46, 73, 206, 0.39)' : 'none',
        border: 'none', // Sin bordes
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Alinear a la izquierda para el menú
        paddingLeft: 24, // Padding consistente
        gap: 12,
        width: '100%',
        marginBottom: 8,
        textAlign: 'left' as const,
    });

    const getIconFilter = (isActive: boolean) => isActive ? 'brightness(0) invert(1)' : 'grayscale(100%) opacity(0.6)';

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Inter, sans-serif'
                }
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <Sider theme="light" width={250} style={{ borderRight: '1px solid #f0f0f0' }}>
                    <div style={{ padding: '24px 24px 40px 24px' }}>
                        <img src="/icons/logo-boxful.svg" alt="Boxful" style={{ height: 32 }} />
                    </div>

                    <div style={{ padding: '0 24px 12px', fontSize: 12, fontWeight: 'bold', color: '#999' }}>MENÚ</div>

                    {/* Elementos de navegación personalizados */}
                    <div style={{ padding: '0 24px' }}>

                        {/* Botón: Crear orden */}
                        <Link href="/create-order">
                            <Button
                                type={pathname === '/create-order' ? 'primary' : 'text'}
                                block
                                size="large"
                                style={{
                                    ...getButtonStyle(pathname === '/create-order'),
                                    justifyContent: 'center', // Centrado específico para este botón si se desea, o left como los demás
                                    // El diseño muestra este botón centrado usualmente, pero si quieres consistencia total:
                                }}
                            >
                                <span style={{ fontSize: 20, lineHeight: 1, marginRight: 4 }}>+</span>
                                Crear orden
                            </Button>
                        </Link>

                        {/* Botón: Historial (Reemplaza al Menu de AntD) */}
                        <Link href="/dashboard">
                            <Button
                                type={pathname === '/dashboard' ? 'primary' : 'text'}
                                block
                                size="large"
                                style={{
                                    ...getButtonStyle(pathname === '/dashboard'),
                                    justifyContent: 'center', // Mantener consistencia con el de arriba
                                    marginTop: 24, // Espacio visual
                                    paddingLeft: 0 // Ajuste si se centra
                                }}
                            >
                                <img
                                    src="/icons/lupa-historial.svg"
                                    alt="History"
                                    style={{
                                        width: 16,
                                        filter: getIconFilter(pathname === '/dashboard'),
                                        marginRight: 8
                                    }}
                                />
                                <span style={{ fontWeight: 700 }}>Historial</span>
                            </Button>
                        </Link>

                    </div>
                </Sider>

                <Layout>
                    <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: 24 }}>
                            {title}
                        </div>

                        <Space size={24}>
                            <div style={{
                                backgroundColor: '#E6F7F5',
                                padding: '8px 16px',
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <img src="/icons/icon-wallet.svg" alt="Wallet" style={{ width: 18 }} />
                                <Text strong style={{ color: '#007B55', fontSize: 14 }}>Monto a liquidar</Text>
                                <Text strong style={{ color: '#007B55', fontSize: 14 }}>
                                    $ {balance !== null ? balance.toFixed(2) : '0.00'}
                                </Text>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Text style={{ fontSize: 14 }}>{userName}</Text>
                            </div>
                        </Space>
                    </Header>

                    <Content style={{ margin: '24px', minHeight: 280 }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
