'use client';

import { useState } from 'react';
import type { BirthData } from '@/core/types';
import { getAllCities, type GeoLocation } from '@/lib/geocoding';

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
}

export default function BirthDataForm({ onSubmit, isLoading }: BirthDataFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const cities = getAllCities();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time || !selectedCity) return;

    onSubmit({
      date,
      time,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      timezone: selectedCity.timezone,
    });
  }

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const city = cities.find(c => c.name === e.target.value);
    setSelectedCity(city ?? null);
  }

  const isValid = date && time && selectedCity;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm text-[var(--muted)] tracking-wide">
          Date of birth
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="time" className="block text-sm text-[var(--muted)] tracking-wide">
          Time of birth
        </label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="city" className="block text-sm text-[var(--muted)] tracking-wide">
          Place of birth
        </label>
        <select
          id="city"
          value={selectedCity?.name ?? ''}
          onChange={handleCityChange}
          className="w-full px-4 py-3 rounded-lg text-sm appearance-none"
          required
        >
          <option value="">Select a city...</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-3 rounded-lg text-sm tracking-wide transition-all duration-300
          disabled:opacity-30 disabled:cursor-not-allowed
          bg-[var(--accent)] text-[var(--background)] hover:opacity-90"
      >
        {isLoading ? 'Calculating...' : 'Reveal your Twins'}
      </button>
    </form>
  );
}
