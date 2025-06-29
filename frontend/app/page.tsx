'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [order, setOrder] = useState({
    CollectionAddress: { Country: '', Property: '', Postcode: '', Town: '', VatStatus: 'Individual' },
    DeliveryAddress: { Country: '', Property: '', Postcode: '', Town: '', VatStatus: 'Individual' },
    Parcels: [{ Value: '', Weight: '', Length: '', Width: '', Height: '' }],
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

      const parsedOrder = {
        ...order,
        Parcels: order.Parcels.map(parcel => ({
          Value: parseFloat(parcel.Value) || 0,
          Weight: parseFloat(parcel.Weight) || 0,
          Length: parseFloat(parcel.Length) || 0,
          Width: parseFloat(parcel.Width) || 0,
          Height: parseFloat(parcel.Height) || 0,
        })),
      };

      const response = await axios.post(`${apiBase}/get-quote`, { order: parsedOrder });
      setQuotes(response.data.Quotes);
      setLoading(false);
    } catch (err) {
      setError('Failed to get quotes.');
      setQuotes([]);
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

      {(!quotes || quotes.length === 0) && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold">Order Details</h2>

          {/* Collection Address */}
          <h3 className="font-semibold">Sender Address</h3>
          <input
            className="border p-2 w-full"
            placeholder="Country (e.g., GBR)"
            value={order.CollectionAddress.Country}
            onChange={(e) => setOrder({
              ...order,
              CollectionAddress: { ...order.CollectionAddress, Country: e.target.value },
            })}
          />
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

          {/* Delivery Address */}
          <h3 className="font-semibold mt-4">Delivery Address</h3>
          <input
            className="border p-2 w-full"
            placeholder="Country (e.g., GBR)"
            value={order.DeliveryAddress.Country}
            onChange={(e) => setOrder({
              ...order,
              DeliveryAddress: { ...order.DeliveryAddress, Country: e.target.value },
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

          {/* Parcel Details */}
          <h3 className="font-semibold mt-4">Parcel Details</h3>
          <input
            className="border p-2 w-full"
            placeholder="Parcel Value"
            type="number"
            value={order.Parcels[0].Value}
            onChange={(e) => setOrder({
              ...order,
              Parcels: [{ ...order.Parcels[0], Value: e.target.value }],
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Parcel Weight (kg)"
            type="number"
            value={order.Parcels[0].Weight}
            onChange={(e) => setOrder({
              ...order,
              Parcels: [{ ...order.Parcels[0], Weight: e.target.value }],
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Parcel Length (cm)"
            type="number"
            value={order.Parcels[0].Length}
            onChange={(e) => setOrder({
              ...order,
              Parcels: [{ ...order.Parcels[0], Length: e.target.value }],
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Parcel Width (cm)"
            type="number"
            value={order.Parcels[0].Width}
            onChange={(e) => setOrder({
              ...order,
              Parcels: [{ ...order.Parcels[0], Width: e.target.value }],
            })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Parcel Height (cm)"
            type="number"
            value={order.Parcels[0].Height}
            onChange={(e) => setOrder({
              ...order,
              Parcels: [{ ...order.Parcels[0], Height: e.target.value }],
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

{quotes?.length > 0 && !label && (
  <table className="w-full border-collapse">
  <tbody>
    {quotes
      .slice()
      .sort((a, b) => a.TotalPrice - b.TotalPrice)
      .reduce((rows, quote, index) => {
        if (index % 3 === 0) rows.push([]);
        rows[rows.length - 1].push(quote);
        return rows;
      }, [])
      .map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((quote, colIndex) => {
            const service = quote.Service;
            return (
              <td key={colIndex} className="border p-4 align-top">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center space-x-4">
                    <img src={service.Links.ImageSmall} alt={service.Name} className="w-16 h-16 object-contain" />
                    <div>
                      <p className="font-bold">{service.CourierName} - {service.Name}</p>
                      <p>Price (excl. VAT): £{quote.TotalPriceExVat.toFixed(2)}</p>
                      <p className="font-bold text-green-600">Total Price: £{quote.TotalPrice.toFixed(2)}</p>
                      <p className="text-gray-600 text-sm mt-2">Estimated Delivery: {new Date(quote.EstimatedDeliveryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedService(quote);
                      createLabel();
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Select
                  </button>
                </div>
              </td>
            );
          })}
        </tr>
      ))}
  </tbody>
</table>
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
