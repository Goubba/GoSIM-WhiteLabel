import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import http from '../services/http';
import { currencyFormatter } from '../utils/utils';

interface LocationItem {
  code: string;
  name: string;
  cover: string;
  image: string;
  fromPrice?: number;
}

export const Search: React.FC = () => {
  const { language, currency, t } = useApp();
  const [activeTab, setActiveTab] = useState<'countries' | 'regions'>('countries');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [regions, setRegions] = useState<LocationItem[]>([]);
  const [glob, setGlob] = useState<LocationItem[]>([]);

  const debounceTimer = useRef<any | null>(null);

  // Fetch locations from backend
  const fetchLocations = (searchTerm = '') => {
    setLoading(true);
    const url = `/locations${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`;
    
    http.get(url)
      .then(({ data }) => {
        const responseData = data?.data || {};
        setCountries(responseData.countries || []);
        setRegions(responseData.regions || []);
        setGlob(responseData.glob || []);
      })
      .catch((err) => {
        console.error('Failed to load locations:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch locations on mount or when language changes
  useEffect(() => {
    fetchLocations(search);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [language]);

  // Handle Search Input Change with Debounce
  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchLocations(val);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchLocations('');
  };

  const combinedRegions = [...glob, ...regions];
  const activeLocations = activeTab === 'countries' ? countries : combinedRegions;

  return (
    <div className="w-full">
      {/* Search Input Bar */}
      <div className="relative w-full border border-gray-100 rounded-2xl">
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={`border-none rounded-2xl py-3 w-full bg-gray-50 placeholder:text-sm placeholder:text-gray-500 ${
            language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
          }`}
          placeholder={t('home.searchCountry')}
        />
        <div
          className={`absolute inset-y-0 flex items-center justify-center px-4 ${
            language === 'ar' ? 'right-0 rounded-r-lg' : 'left-0 rounded-l-lg'
          }`}
        >
          <i className="fa-solid fa-magnifying-glass text-gray-400" />
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex my-4 rounded-2xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('countries')}
          className={`w-full py-2.5 rounded-2xl font-bold text-center transition-all cursor-pointer ${
            activeTab === 'countries' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('home.countries')}
        </button>
        <button
          onClick={() => setActiveTab('regions')}
          className={`w-full py-2.5 rounded-2xl font-bold text-center transition-all cursor-pointer ${
            activeTab === 'regions' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('home.regions')}
        </button>
      </div>

      <div>
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse">
                <div className="w-full h-42">
                  <div className="h-full w-full rounded-t-2xl bg-gray-200 border border-gray-300" />
                </div>
                <div className="flex gap-2 items-center justify-start p-3">
                  <div className="h-12 w-12 rounded-full bg-gray-300 border border-gray-300 shrink-0" />
                  <div className="flex flex-col gap-2 w-full">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loaded Locations Content */}
        {!loading && (
          <div>
            {/* No Results State */}
            {activeLocations.length === 0 && (
              <div className="text-center pt-16 pb-8 flex flex-col items-center">
                <div className="flex items-center justify-center bg-gray-100 rounded-xl w-32 h-32 relative">
                  <i className="fa-light fa-map-location-dot text-gray-400 text-4xl" />
                  <i className="fa-light fa-slash text-gray-400 text-4xl absolute" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900">{t('home.noResult')}</h3>
                  <p className="text-gray-600 mt-2 max-w-xs mx-auto">{t('home.noResultText')}</p>
                </div>
                <button onClick={handleClearSearch} className="btn-primary w-full max-w-xs mt-8 cursor-pointer">
                  {t('home.noResultButton')}
                </button>
              </div>
            )}

            {/* Grid List */}
            {activeLocations.length > 0 && (
              <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
                {activeLocations.map((location) => (
                  <Link key={location.code} to={`/packages/${location.code}`}>
                    <div className="rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 overflow-hidden shadow-sm h-full flex flex-col">
                      <div className="w-full h-42">
                        <img
                          src={location.cover}
                          alt={location.name}
                          className="h-full w-full object-cover border-b border-gray-200"
                        />
                      </div>
                      <div className="flex gap-2 items-center justify-start font-medium text-sm p-3 text-gray-700 mt-auto">
                        <img
                          src={location.image}
                          alt={location.name}
                          className="size-10 sm:size-12 rounded-full object-cover border border-gray-300 shrink-0"
                        />
                        <div className="text-left rtl:text-right overflow-hidden">
                          <p className="font-bold text-gray-900 truncate">{location.name}</p>
                          {location.fromPrice !== undefined && (
                            <span className="text-xs sm:text-sm text-gray-500 block truncate">
                              {t('home.startingAt')} {currencyFormatter(location.fromPrice, currency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
