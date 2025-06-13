// === frontend/app/page.tsx ===

'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [order, setOrder] = useState({
    CollectionAddress: { Country: 'GBR', Property: '', Postcode: '', Town: '', VatStatus: 'Individual' },
    DeliveryAddress: { Country: 'GBR', Property: '', Postcode: '', Town: '', VatStatus: 'Individual' },
    Parcels: [{ Value: 4.99, Weight: 0.6, Length: 50, Width: 40, Height: 50 }],
    Extras: [],
    IncludedDropShopDistances: false,
    ServiceFilter: { IncludeServiceTags: [], ExcludeServiceTags: [] },
  });

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [label, setLabel] = useState(null);
  const [error, setError] = useState('');

  const apiBase = 'https://goodlife-production-3a0a.up.railway.app';

  const getQuotes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${apiBase}/get-quote`, { order });
      setQuotes(response.data.Services);
      setLoading(false);
    } catch (err) {
      setError('Failed to get quotes.');
      setLoading(false);
    }
  };

  const createLabel = async () => {
    try {
      setLoading(true);
      setError('');

      const labelData = {
        ...order,
        SelectedService: selectedService,
      };

      const response = await axios.post(`${apiBase}/create-label`, { labelData });
      setLabel(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to create label.');
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Parcel2Go Quote & Label Generator</h1>

      {loading && <p className="mb-4">Loading...</p>}

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {!quotes.length && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <input
            className="border p-2 w-full"
            placeholder="Collection Property"
            value={order.CollectionAddress.Property}
            onChange={(e) => setOrder({
              ...order,
              CollectionAddress: { ...order.CollectionAddress, Property: e.target.value },
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Collection Postcode"
            value={order.CollectionAddress.Postcode}
            onChange={(e) => setOrder({
              ...order,
              CollectionAddress: { ...order.CollectionAddress, Postcode: e.target.value },
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Collection Town"
            value={order.CollectionAddress.Town}
            onChange={(e) => setOrder({
              ...order,
              CollectionAddress: { ...order.CollectionAddress, Town: e.target.value },
            })}
          />

          <input
            className="border p-2 w-full"
            placeholder="Delivery Property"
            value={order.DeliveryAddress.Property}
            onChange={(e) => setOrder({
              ...order,
              DeliveryAddress: { ...order.DeliveryAddress, Property: e.target.value },
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Delivery Postcode"
            value={order.DeliveryAddress.Postcode}
            onChange={(e) => setOrder({
              ...order,
              DeliveryAddress: { ...order.DeliveryAddress, Postcode: e.target.value },
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Delivery Town"
            value={order.DeliveryAddress.Town}
            onChange={(e) => setOrder({
              ...order,
              DeliveryAddress: { ...order.DeliveryAddress, Town: e.target.value },
            })}
          />

          <button
            onClick={getQuotes}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Get Quotes
          </button>
        </div>
      )}

      {quotes.length > 0 && !label && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Select a Service</h2>
          {quotes.map((service, index) => (
            <div key={index} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p><strong>{service.ProviderName}</strong></p>
                <p>{service.Description}</p>
                <p>Price: £{service.Price.ExcludingVat.toFixed(2)}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedService(service);
                  createLabel();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}

      {label && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Label Created!</h2>
          <a
            href={label.ShipmentLabels[0].LabelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Download Label
          </a>
        </div>
      )}
    </main>
  );
}
