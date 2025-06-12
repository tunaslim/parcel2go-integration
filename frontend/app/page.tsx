'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [formData, setFormData] = useState({
    CollectionAddress: {
      Country: 'GBR',
      Property: '',
      Postcode: '',
      Town: '',
      VatStatus: 'Individual',
    },
    DeliveryAddress: {
      Country: 'GBR',
      Property: '',
      Postcode: '',
      Town: '',
      VatStatus: 'Individual',
    },
    parcel: {
      Value: '',
      Weight: '',
      Length: '',
      Width: '',
      Height: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [labelUrl, setLabelUrl] = useState('');

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section as keyof typeof prevData],
        [field]: value,
      },
    }));
  };

  const handleParcelChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      parcel: {
        ...prevData.parcel,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLabelUrl('');

    // Prepare request body
    const order = {
      CollectionAddress: { ...formData.CollectionAddress },
      DeliveryAddress: { ...formData.DeliveryAddress },
      Parcels: [
        {
          Value: parseFloat(formData.parcel.Value),
          Weight: parseFloat(formData.parcel.Weight),
          Length: parseFloat(formData.parcel.Length),
          Width: parseFloat(formData.parcel.Width),
          Height: parseFloat(formData.parcel.Height),
        },
      ],
      Extras: [
        {
          Type: 'ExtendedBaseCover',
          Values: {
            ExampleKey: 'ExampleValue',
          },
        },
      ],
      IncludedDropShopDistances: false,
      ServiceFilter: {
        IncludeServiceTags: [],
        ExcludeServiceTags: [],
      },
    };

    try {
      // Step 1: Get Quote
      const quoteResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/get-quote`, { order });
      console.log('Quote response:', quoteResponse.data);

      // Step 2: Create Label
      const labelResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-label`, { order });
      console.log('Label response:', labelResponse.data);

      const url = labelResponse.data.labelUrl || labelResponse.data.labelPdfUrl;

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
      <h1 className="text-2xl font-bold mb-4">Parcel2Go Quote & Label Form</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* Collection Address */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Collection Address</legend>
          {['Property', 'Postcode', 'Town'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={formData.CollectionAddress[field as keyof typeof formData.CollectionAddress]}
              onChange={(e) => handleInputChange('CollectionAddress', field, e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
          ))}
        </fieldset>

        {/* Delivery Address */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Delivery Address</legend>
          {['Property', 'Postcode', 'Town'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={formData.DeliveryAddress[field as keyof typeof formData.DeliveryAddress]}
              onChange={(e) => handleInputChange('DeliveryAddress', field, e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
          ))}
        </fieldset>

        {/* Parcel Details */}
        <fieldset className="border p-4 rounded">
          <legend className="font-semibold mb-2">Parcel Details</legend>
          {['Value', 'Weight', 'Length', 'Width', 'Height'].map((field) => (
            <input
              key={field}
              type="number"
              step="any"
              placeholder={field}
              value={formData.parcel[field as keyof typeof formData.parcel]}
              onChange={(e) => handleParcelChange(field, e.target.value)}
              className="w-full mb-2 p-2 border rounded"
              required
            />
          ))}
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Get Quote & Create Label'}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 text-red-600">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Label Download */}
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
