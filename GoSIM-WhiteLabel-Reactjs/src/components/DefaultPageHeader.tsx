import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface DefaultPageHeaderProps {
  title: string;
  showArrow?: boolean;
  backRoute?: string | null;
  customBackAction?: (() => void) | null;
  classes?: string;
  showCurrency?: boolean;
  currencyCode?: string;
  currencySymbol?: string;
  onCurrencyChanged?: (code: string) => void;
}

export const DefaultPageHeader: React.FC<DefaultPageHeaderProps> = ({
  title,
  showArrow = true,
  backRoute = null,
  customBackAction = null,
  classes = 'flex items-center gap-3',
  showCurrency = false,
  currencyCode = '',
  currencySymbol = '',
  onCurrencyChanged,
}) => {
  const navigate = useNavigate();
  const { language, currency, setCurrency, t } = useApp();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const availableCurrencies = [
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'دج', image: '/assets/dzd.png' },
    { code: 'USD', name: 'US Dollar', symbol: '$', image: '/assets/usd.png' },
  ];

  const goBack = () => {
    if (customBackAction) {
      customBackAction();
    } else if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  const handleSelectCurrency = (code: string) => {
    setCurrency(code.toLowerCase());
    if (onCurrencyChanged) {
      onCurrencyChanged(code);
    }
    setShowCurrencyModal(false);
  };

  return (
    <>
      <div className="md:hidden sticky top-0 inset-x-0 bg-white z-50 px-2 max-w-lg mx-auto">
        <div className={`${classes} pb-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {showArrow && (
              <button onClick={goBack} className="cursor-pointer">
                <i
                  className={`fa-solid fa-angle-left text-2xl text-black ${
                    language === 'ar' ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-1">
            {showCurrency && currencyCode && currencySymbol && (
              <button
                onClick={() => setShowCurrencyModal(true)}
                className="text-gray-500 text-xs font-bold bg-gray-100 rounded-full px-2 py-2 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {currencySymbol} - {currencyCode} <i className="fa-solid fa-chevron-down text-[10px] ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCurrencyModal(false)}
          />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto z-10" style={{ minHeight: '40vh' }}>
            <div className="flex flex-col gap-4 py-6 px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-extrabold">{t('common.selectCurrency')}</h2>
                <button
                  onClick={() => setShowCurrencyModal(false)}
                  className={`cursor-pointer absolute md:static top-4 ${
                    language === 'ar' ? 'left-4' : 'right-4'
                  }`}
                >
                  <i className="fa-solid fa-circle-xmark text-black text-3xl" />
                </button>
              </div>
              <div className="space-y-3">
                {availableCurrencies.map((curr) => {
                  const isSelected = currency.toUpperCase() === curr.code;
                  return (
                    <button
                      key={curr.code}
                      onClick={() => handleSelectCurrency(curr.code)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-red-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          <img src={curr.image} alt={curr.name} className="w-8 h-8 object-contain" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-lg text-gray-900">{curr.name}</p>
                          <p className="text-base text-gray-500">{curr.code}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
