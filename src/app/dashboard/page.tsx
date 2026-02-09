'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Table, DatePicker, Button, Tag, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '@/lib/axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface OrderType {
    key: string;
    id: string;
    recipientName: string;
    recipientLastName: string;
    recipientDepartment: string;
    recipientMunicipality: string;
    packagesCount: number;
    status: string;
    createdAt: string;
    collectedAmount: number;
    settlementAmount: number | null;
}

export default function DashboardPage() {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const columns: ColumnsType<OrderType> = [
        {
            title: 'No. de orden',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span style={{ fontWeight: 600 }}>{text.substring(0, 8)}</span>,
            width: 120,
        },
        {
            title: 'Destinatario',
            dataIndex: 'recipientName',
            key: 'recipient',
            render: (_, record) => `${record.recipientName} ${record.recipientLastName}`,
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'DELIVERED' ? 'success' : 'processing'} style={{ border: 'none', fontWeight: 500 }}>
                    {status === 'DELIVERED' ? 'Entregado' : (status === 'PENDING' ? 'Pendiente' : status)}
                </Tag>
            ),
        },
        {
            title: 'Fecha',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Liquidación',
            dataIndex: 'settlementAmount',
            key: 'settlementAmount',
            align: 'right',
            render: (amount) => {
                if (amount === null || amount === undefined) {
                    return <span style={{ color: '#999' }}>Pendiente</span>;
                }
                const color = amount >= 0 ? '#00A854' : '#FF4D4F';
                return (
                    <span style={{ color, fontWeight: 600 }}>
                        {currencyFormatter.format(amount)}
                    </span>
                );
            }
        },
        {
            title: 'Paquetes',
            dataIndex: 'packagesCount',
            key: 'packagesCount',
            align: 'right',
            render: (count) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                        backgroundColor: '#F0FFF4',
                        color: '#00A854',
                        padding: '2px 10px',
                        borderRadius: 4,
                        fontSize: 14,
                        fontWeight: 600,
                        display: 'inline-block',
                        minWidth: 30,
                        textAlign: 'center'
                    }}>
                        {count}
                    </div>
                </div>
            ),
        },
    ];

    const fetchOrders = async (startDate?: string, endDate?: string) => {
        setLoading(true);
        try {
            let url = '/orders';
            if (startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }

            const response = await api.get(url);
            const data = response.data.map((order: any) => ({
                key: order.id,
                id: order.id,
                recipientName: order.recipientName,
                recipientLastName: order.recipientLastName,
                recipientDepartment: order.recipientDepartment,
                recipientMunicipality: order.recipientMunicipality,
                packagesCount: Array.isArray(order.packages) ? order.packages.length : 0,
                status: order.status,
                createdAt: order.createdAt,
                collectedAmount: order.collectedAmount,
                settlementAmount: order.settlementAmount
            }));
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = () => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            const start = dateRange[0].toISOString();
            const end = dateRange[1].toISOString();
            fetchOrders(start, end);
        } else {
            fetchOrders();
        }
    };

    const handleDownloadCsv = () => {
        const headers = ['ID', 'Destinatario', 'Estado', 'Fecha', 'Total Cobrado', 'Liquidación'];
        const rows = orders.map(order => [
            order.id,
            `${order.recipientName} ${order.recipientLastName}`,
            order.status,
            dayjs(order.createdAt).format('DD/MM/YYYY'),
            order.collectedAmount ? order.collectedAmount.toFixed(2) : '0.00',
            order.settlementAmount !== null ? order.settlementAmount.toFixed(2) : 'Pendiente'
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'ordenes_boxful.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const CalendarIcon = () => <img src="/icons/calendar.svg" alt="calendar" style={{ width: 16 }} />;

    // Título con lógica simple de negrita
    const PageTitle = (
        <span>
            Mis <span style={{ fontWeight: 700 }}>envíos</span>
        </span>
    );

    return (
        <DashboardLayout title={PageTitle}>
            <Card variant="borderless">
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                    <RangePicker
                        style={{ width: 300 }}
                        placeholder={['Fecha inicio', 'Fecha fin']}
                        suffixIcon={<CalendarIcon />}
                        separator="-"
                        onChange={(dates) => setDateRange(dates as any)}
                    />

                    <Button
                        type="primary"
                        onClick={handleSearch}
                        style={{ backgroundColor: '#2E49CE', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        Buscar
                        <img src="/icons/lupa-historial.svg" alt="Search" style={{ width: 14, filter: 'brightness(0) invert(1)' }} />
                    </Button>

                    <Button onClick={handleDownloadCsv}>
                        Descargar órdenes
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    rowSelection={{ type: 'checkbox' }}
                />
            </Card>
        </DashboardLayout>
    );
}
