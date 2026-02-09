'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Row, Col, DatePicker, Select, Switch, ConfigProvider, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '@/lib/axios';
import { svLocations } from '@/utils/consts';
import SuccessModal from '@/components/SuccessModal';

const { Title, Text } = Typography;
const { Option } = Select;

interface PackageType {
    id: number;
    length: number;
    height: number;
    width: number;
    weight: number;
    content: string;
}

export default function CreateOrderPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isCodEnabled, setIsCodEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const [departments] = useState(Object.keys(svLocations));
    const [municipalities, setMunicipalities] = useState<string[]>([]);

    const [packages, setPackages] = useState<PackageType[]>([]);

    const [newPackage, setNewPackage] = useState({
        length: '',
        height: '',
        width: '',
        weight: '',
        content: ''
    });

    const handleDepartmentChange = (value: string) => {
        setMunicipalities(svLocations[value] || []);
        form.setFieldsValue({ recipientMunicipality: undefined });
    };

    const handleStep1Submit = async () => {
        try {
            const values = await form.validateFields();
            setFormData({ ...formData, ...values });
            setStep(1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleFinalSubmit = async () => {
        if (packages.length === 0) {
            messageApi.error('Debes agregar al menos un paquete');
            return;
        }

        setLoading(true);
        try {
            // Limpiar número de teléfono: eliminar no- dígitos
            const rawPhone = formData.recipientPhone || '';
            const cleanPhone = rawPhone.replace(/\D/g, '');
            const formattedPhone = `+503 ${cleanPhone}`;

            // Asegurar que expectedCodAmount sea número
            const safeParseFloat = (val: string | number) => {
                const num = parseFloat(String(val));
                return isNaN(num) ? 0 : num;
            };

            const payload = {
                ...formData,
                recipientPhone: formattedPhone,
                scheduledDate: formData.scheduledDate ? formData.scheduledDate.toISOString() : new Date().toISOString(),
                isCOD: isCodEnabled,
                expectedCodAmount: isCodEnabled ? safeParseFloat(formData.expectedCodAmount) : 0,
                // Paquetes ya son números desde el estado
                packages: packages.map(p => ({
                    length: p.length,
                    height: p.height,
                    width: p.width,
                    weight: p.weight,
                    content: p.content
                }))
            };

            console.log('Payload:', payload);

            await api.post('/orders', payload);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Create order error:', error);
            // Mostrar error más específico si está disponible
            const errorMsg = error.response?.data?.message;
            if (Array.isArray(errorMsg)) {
                messageApi.error(`Error: ${errorMsg.join(', ')}`);
            } else {
                messageApi.error(errorMsg || 'Error al crear la orden. Verifica los datos.');
            }
        } finally {
            setLoading(false);
        }
    };

    const PageTitle = (
        <span>
            Crear un <span style={{ fontWeight: 700 }}>envío</span>
        </span>
    );

    const handleAddPackage = () => {
        if (!newPackage.length || !newPackage.height || !newPackage.width || !newPackage.weight || !newPackage.content) {
            messageApi.warning('Completa todos los campos del paquete');
            return;
        }

        // Conversión explícita a números
        const pkg: PackageType = {
            id: Date.now(),
            length: Number(newPackage.length),
            height: Number(newPackage.height),
            width: Number(newPackage.width),
            weight: Number(newPackage.weight),
            content: newPackage.content
        };

        setPackages([...packages, pkg]);
        setNewPackage({ length: '', height: '', width: '', weight: '', content: '' });
    };

    const removePackage = (id: number) => {
        setPackages(packages.filter(p => p.id !== id));
    };

    const updateNewPackage = (field: string, value: string) => {
        setNewPackage(prev => ({ ...prev, [field]: value }));
    };

    const CalendarIcon = () => <img src="/icons/calendar.svg" alt="calendar" style={{ width: 16 }} />;

    return (
        <DashboardLayout title={PageTitle}>
            {contextHolder}

            {step === 0 && (
                <>
                    <Card variant="borderless" style={{ marginBottom: 24 }}>
                        {/* ... Title/Text ... */}

                        <div style={{ marginTop: 30 }}>
                            {/* ... Title ... */}

                            <Form form={form} layout="vertical" initialValues={{ isCOD: false }}>
                                {/* ... previous rows ... */}
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item label="Dirección de recolección" name="pickupAddress" rules={[{ required: true, message: 'Requerido' }]}>
                                            <Input placeholder="Dirección completa" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Fecha programada" name="scheduledDate" rules={[{ required: true, message: 'Requerido' }]}>
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                suffixIcon={<CalendarIcon />}
                                                placeholder="Seleccionar fecha"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item label="Nombres" name="recipientName" rules={[{ required: true, message: 'Requerido' }]}>
                                            <Input placeholder="Nombres" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Apellidos" name="recipientLastName" rules={[{ required: true, message: 'Requerido' }]}>
                                            <Input placeholder="Apellidos" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Correo electrónico" name="recipientEmail" rules={[{ required: true, message: 'Requerido' }, { type: 'email', message: 'Inválido' }]}>
                                            <Input placeholder="ejemplo@correo.com" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item label="Teléfono" name="recipientPhone" rules={[
                                            { required: true, message: 'Requerido' },
                                            { pattern: /^\d{8}$/, message: 'Debe tener 8 dígitos' }
                                        ]}>
                                            {/* Corrección: Usar Space.Compact para estilo sufijo/prefijo sin el obsoleto addonBefore */}
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Input style={{ width: '30%', textAlign: 'center', backgroundColor: '#fafafa', color: '#000' }} value="+503" disabled />
                                                <Input style={{ width: '70%' }} placeholder="7777 7777" maxLength={8} onChange={(e) => {
                                                    // Permitir solo números
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    form.setFieldsValue({ recipientPhone: val });
                                                }} />
                                            </Space.Compact>
                                        </Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item label="Dirección del destinatario" name="recipientAddress" rules={[{ required: true, message: 'Requerido' }]}>
                                            <Input placeholder="Dirección completa" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* ... rest of form ... */}
                                <Row gutter={24}>
                                    <Col span={8}>
                                        <Form.Item label="Departamento" name="recipientDepartment" rules={[{ required: true, message: 'Requerido' }]}>
                                            <Select placeholder="Seleccionar" onChange={handleDepartmentChange}>
                                                {departments.map(dep => (
                                                    <Option key={dep} value={dep}>{dep}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Municipio" name="recipientMunicipality" rules={[{ required: true, message: 'Requerido' }]}>
                                            <Select placeholder="Seleccionar" disabled={!municipalities.length}>
                                                {municipalities.map(mun => (
                                                    <Option key={mun} value={mun}>{mun}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Punto de referencia" name="referencePoint">
                                            <Input placeholder="Cerca de..." />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Indicaciones" name="instructions">
                                    <Input placeholder="Llamar antes de entregar" />
                                </Form.Item>

                                <div style={{ backgroundColor: '#FFF5F5', padding: 20, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text strong>Pago contra entrega (PCE)</Text>
                                        <div style={{ fontSize: 12, color: '#666' }}>Tu cliente paga el <strong>monto que indiques</strong> al momento de la entrega</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {isCodEnabled && (
                                            <Form.Item
                                                name="expectedCodAmount"
                                                noStyle
                                                rules={[{ required: isCodEnabled, message: 'Requerido' }]}
                                            >
                                                <Input prefix="$" placeholder="00.00" style={{ width: 120 }} />
                                            </Form.Item>
                                        )}

                                        <ConfigProvider
                                            theme={{
                                                token: {
                                                    colorPrimary: '#73BD28',
                                                }
                                            }}
                                        >
                                            <Switch
                                                checked={isCodEnabled}
                                                onChange={setIsCodEnabled}
                                            />
                                        </ConfigProvider>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', marginTop: 24 }}>
                                    <Button type="primary" onClick={handleStep1Submit} size="large" style={{ width: 150, backgroundColor: '#2E49CE' }}>
                                        Siguiente &rarr;
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </>
            )}

            {step === 1 && (
                <>
                    {/* ... Step 2 content stays same, just ensure Card variant is used ... */}
                    <Card variant="borderless">
                        <Title level={4} style={{ marginTop: 0 }}>Crea una orden</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                            Dale una ventaja competitiva a tu negocio con entregas <strong>el mismo día</strong> (Área Metropolitana) y <strong>el día siguiente</strong> a nivel nacional.
                        </Text>

                        <div style={{ marginTop: 30 }}>
                            <Title level={5} style={{ marginTop: 0, marginBottom: 24 }}>Agrega tus productos</Title>

                            {/* ... Inputs ... */}
                            <div style={{
                                backgroundColor: '#FAFAFA',
                                padding: 16,
                                borderRadius: 8,
                                marginBottom: 24,
                                border: '1px solid #f0f0f0'
                            }}>
                                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                    <div style={{ backgroundColor: '#F4F6F8', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, width: 60 }}>
                                        <img src="/icons/icon-cube.svg" alt="Package" style={{ width: 30, opacity: 0.5 }} />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <div style={{ fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Largo</div>
                                                <Input suffix="cm" value={newPackage.length} onChange={(e) => updateNewPackage('length', e.target.value)} />
                                            </Col>
                                            <Col span={6}>
                                                <div style={{ fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Alto</div>
                                                <Input suffix="cm" value={newPackage.height} onChange={(e) => updateNewPackage('height', e.target.value)} />
                                            </Col>
                                            <Col span={6}>
                                                <div style={{ fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Ancho</div>
                                                <Input suffix="cm" value={newPackage.width} onChange={(e) => updateNewPackage('width', e.target.value)} />
                                            </Col>
                                            <Col span={6}>
                                                <div style={{ fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Peso en libras</div>
                                                <Input suffix="lb" value={newPackage.weight} onChange={(e) => updateNewPackage('weight', e.target.value)} />
                                            </Col>
                                        </Row>
                                        <div style={{ marginTop: 12 }}>
                                            <div style={{ fontSize: 12, marginBottom: 4, fontWeight: 600 }}>Contenido</div>
                                            <Input placeholder="Descripción del contenido" value={newPackage.content} onChange={(e) => updateNewPackage('content', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginTop: 16 }}>
                                    <Button onClick={handleAddPackage} style={{ fontWeight: 600 }}>
                                        Agregar <PlusOutlined />
                                    </Button>
                                </div>
                            </div>

                            {/* ... List ... */}
                            {packages.map((pkg, index) => (
                                <div key={pkg.id} style={{
                                    border: '1px solid #73BD28',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    flexWrap: 'wrap',
                                    backgroundColor: '#fff'
                                }}>
                                    <div style={{ backgroundColor: '#F4F6F8', padding: 8, borderRadius: 4 }}>
                                        <img src="/icons/icon-cube.svg" alt="Package" style={{ width: 20 }} />
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, marginBottom: 4 }}>Largo</div>
                                            <Input suffix="cm" value={pkg.length} readOnly style={{ backgroundColor: '#fff', cursor: 'default' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, marginBottom: 4 }}>Alto</div>
                                            <Input suffix="cm" value={pkg.height} readOnly style={{ backgroundColor: '#fff', cursor: 'default' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, marginBottom: 4 }}>Ancho</div>
                                            <Input suffix="cm" value={pkg.width} readOnly style={{ backgroundColor: '#fff', cursor: 'default' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 12, marginBottom: 4 }}>Peso en libras</div>
                                            <Input suffix="lb" value={pkg.weight} readOnly style={{ backgroundColor: '#fff', cursor: 'default' }} />
                                        </div>
                                    </div>

                                    <div style={{ flex: 2 }}>
                                        <div style={{ fontSize: 12, marginBottom: 4 }}>Contenido</div>
                                        <Input placeholder="Descripción del contenido" value={pkg.content} readOnly style={{ backgroundColor: '#fff', cursor: 'default' }} />
                                    </div>

                                    <Button
                                        type="text"
                                        danger
                                        icon={<img src="/icons/icon-trash.svg" alt="Delete" style={{ width: 16 }} />}
                                        onClick={() => removePackage(pkg.id)}
                                    />
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
                                <Button size="large" onClick={() => setStep(0)}>
                                    &larr; Regresar
                                </Button>
                                <Button type="primary" size="large" onClick={handleFinalSubmit} loading={loading} style={{ width: 150, backgroundColor: '#2E49CE' }}>
                                    Enviar &rarr;
                                </Button>
                            </div>
                        </div>
                    </Card>
                </>
            )}

            <SuccessModal
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onCreateAnother={() => window.location.reload()}
                onGoHome={() => router.push('/dashboard')}
            />
        </DashboardLayout>
    );
}
