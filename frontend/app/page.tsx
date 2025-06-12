'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [labelUrl, setLabelUrl] = useState('');

  const order = {
    CollectionAddress: {
      Country: 'GBR',
      Property: '123',
      Postcode: 'AA1 1AA',
      Town: 'Example',
      VatStatus: 'Individual'
    },
    DeliveryAddress: {
      Country: 'GBR',
      Property: '123',
      Postcode: 'AA1 1AA',
      Town: 'Example',
      VatStatus: 'Individual'
    },
    Parcels: [
      {
        Value: 4.99,
        Weight: 0.6,
        Length: 50,
        Width: 40,
        Height: 50
      }
    ],
    Extras: [
      {
        Type: 'ExtendedBaseCover',
        Values: {
          ExampleKey: 'ExampleValue'
        }
      }
    ],
    IncludedDropShopDistances: false,
    ServiceFilter: {
      IncludeServiceTags: [],
      ExcludeServiceTags: []
    }
  };

  const handleGetQuoteAndLabel = async () => {
    setLoading(true);
    setError('');
    setLabelUrl('');

    try {
      // Step 1: Get Quote
      const quoteResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/get-quote`, { order });
      console.log('Quote response:', quoteResponse.data);

      // Step 2: Create Label
      const labelResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-label`, { order });
      console.log('Label response:', labelResponse.data);

      // Example: Assuming the label URL is returned in labelResponse.data.labelUrl
      // Replace with the correct key based on Parcel2Go API response
      const url = labelResponse.data.labelUrl || labelResponse.data.labelPdfUrl; // Adjust as needed

      if (url) {
        setLabelUrl(url);
      } else {
        throw new Error('Label URL not found in response.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Parcel2Go Quote & Label</h1>

      <button
        onClick={handleGetQuoteAndLabel}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Get Quote & Create Label'}
      </button>

      {error && (
        <div className="mt-4 text-red-600">
          <p>Error: {error}</p>
        </div>
      )}

      {labelUrl && (
        <div className="mt-4">
          <a
            href={labelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            Download Label
          </a>
        </div>
      )}
    </div>
  );
}
