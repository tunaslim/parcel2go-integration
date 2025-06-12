// =========================
// Frontend: Next.js + React
// =========================

// File: /frontend/app/page.tsx

'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [formData, setFormData] = useState({
        senderName: '', senderAddress: '', senderCity: '', senderPostcode: '',
        recipientName: '', recipientAddress: '', recipientCity: '', recipientPostcode: '',
        weight: '', serviceCode: ''
    });
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const getQuote = async () => {
        setLoading(true);
        setError('');
        setQuotes([]);
        setSuccessMessage('');

        try {
            const res = await axios.post(`${apiUrl}/get-quote`, {
                sender: {
                    address1: formData.senderAddress,
                    city: formData.senderCity,
                    postcode: formData.senderPostcode,
                    country: 'GB'
                },
                recipient: {
                    address1: formData.recipientAddress,
                    city: formData.recipientCity,
                    postcode: formData.recipientPostcode,
                    country: 'GB'
                },
                parcels: [{
                    weight: parseFloat(formData.weight),
                    weight_unit: 'kg', length: 30, width: 20, height: 10,
                    dimensions_unit: 'cm'
                }]
            });

            setQuotes(res.data.quotes);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch quote.');
        } finally {
            setLoading(false);
        }
    };

    const createLabel = async (serviceCode: string) => {
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${apiUrl}/create-label`, {
                sender: {
                    name: formData.senderName,
                    address1: formData.senderAddress,
                    city: formData.senderCity,
                    postcode: formData.senderPostcode,
                    country: 'GB'
                },
                recipient: {
                    name: formData.recipientName,
                    address1: formData.recipientAddress,
                    city: formData.recipientCity,
                    postcode: formData.recipientPostcode,
                    country: 'GB'
                },
                parcels: [{
                    weight: parseFloat(formData.weight),
                    weight_unit: 'kg', length: 30, width: 20, height: 10,
                    dimensions_unit: 'cm'
                }],
                service_code: serviceCode
            });

            const labelUrl = res.data.label_url;
            const trackingNumber = res.data.tracking_number;
            await downloadLabel(labelUrl, `Label-${trackingNumber}.pdf`);
            setSuccessMessage(`Label created successfully! Tracking Number: ${trackingNumber}`);
            setQuotes([]);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Label creation failed.');
        } finally {
            setLoading(false);
        }
    };

    const downloadLabel = async (url: string, filename: string) => {
        try {
            const response = await axios.get(url, { responseType: 'blob' });
            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error('Error downloading the label:', err);
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Parcel2Go Shipping</h1>

            {loading && <p className="text-blue-600 mb-4">Loading...</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

            <div className="space-y-4 mb-6">
                {/* Form Inputs */}
                {['senderName', 'senderAddress', 'senderCity', 'senderPostcode', 'recipientName', 'recipientAddress', 'recipientCity', 'recipientPostcode', 'weight'].map((field) => (
                    <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={field.replace(/([A-Z])/g, ' $1')}
                        value={(formData as any)[field]}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                ))}
                <button onClick={getQuote} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Get Quotes
                </button>
            </div>

            {/* Display Quotes */}
            {quotes.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-2">Available Quotes:</h2>
                    {quotes.map((quote, index) => (
                        <div key={index} className="p-4 bg-gray-100 rounded">
                            <p><strong>Carrier:</strong> {quote.carrier_name}</p>
                            <p><strong>Service:</strong> {quote.service_name}</p>
                            <p><strong>Price:</strong> £{quote.total_price}</p>
                            <p><strong>ETA:</strong> {quote.estimated_delivery_date}</p>
                            <button onClick={() => createLabel(quote.service_code)} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Select This Service
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
