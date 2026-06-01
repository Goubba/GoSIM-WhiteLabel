import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { currencyFormatter, formatBytes } from '../utils/utils';

interface SummaryFormProps {
  selectedPackage: any;
  quantity: number;
  days: number;
  location: any;
  loading: boolean;
  onQuantityChange: (val: number) => void;
  onDaysChange: (val: number) => void;
  onFormSubmit: (customerData: any) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({
  selectedPackage,
  quantity,
  days,
  location,
  loading,
  onQuantityChange,
  onDaysChange,
  onFormSubmit,
}) => {
  const { language, currency, t } = useApp();
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'whatsapp' | 'phone'>('email');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [selectedCountryCode, setSelectedCountryCode] = useState('+213');

  const countries = [{ code: '+213', name: 'Algeria' }];

  const getDiscount = (pack: any, daysCount: number): number => {
    if (!pack?.daily_discounts?.length) return 0;
    const applicable = pack.daily_discounts.filter((d: any) => daysCount >= d.day);
    if (applicable.length > 0) {
      return Math.max(...applicable.map((d: any) => d.discount));
    }
    return 0;
  };

  const getDiscountedPrice = (pack: any, daysCount: number): number => {
    if (!pack) return 0;
    const total = pack.price * daysCount;
    const discount = getDiscount(pack, daysCount);
    return total * (1 - discount / 100);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: customer.name,
      email: customer.email,
    };

    if (deliveryMethod === 'phone') {
      payload.phone = selectedCountryCode + customer.phone;
    } else if (deliveryMethod === 'whatsapp') {
      payload.whatsapp = selectedCountryCode + customer.phone;
    }

    onFormSubmit(payload);
  };

  const hasSelectedPackage = selectedPackage && selectedPackage.id;
  const activeDays = selectedPackage?.duration === 1 ? days : 1;
  const singlePrice = getDiscountedPrice(selectedPackage, activeDays);
  const totalPrice = singlePrice * quantity;
  const originalPrice = selectedPackage ? selectedPackage.price * activeDays * quantity : 0;
  const hasDiscountVal = selectedPackage?.duration === 1 && getDiscount(selectedPackage, days) > 0;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 md:p-6">
      <h3 className="hidden md:block text-lg font-bold text-gray-900 mb-5">{t('orders.summary')}</h3>

      {hasSelectedPackage ? (
        <form onSubmit={submitOrder} className="md:space-y-2">
          {/* Selected Package Specs */}
          <div className="hidden md:flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl">
            <img src={location?.image} alt={location?.name} className="w-11 h-11 object-cover rounded-full shrink-0" />
            <div className="text-left min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">{location?.name}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                {selectedPackage?.duration === 1
                  ? `${t('plans.duration.unlimitedData')} ${formatBytes(selectedPackage?.volume, language)}`
                  : formatBytes(selectedPackage?.volume, language)}
              </p>
            </div>
          </div>

          {/* Quantity Modifier */}
          <div
            className={`items-center justify-between pt-1 pb-2 md:pt-3 md:pb-6 border-b border-gray-200/50 ${
              step === 1 ? 'flex' : 'hidden md:flex'
            }`}
          >
            <span className="text-sm font-bold text-gray-700">{t('orders.quantity')}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
              >
                <i className="fa-solid fa-minus text-xs" />
              </button>
              <span className="font-black text-base w-6 text-center text-gray-900">{quantity}</span>
              <button
                type="button"
                className="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                onClick={() => onQuantityChange(quantity + 1)}
              >
                <i className="fa-solid fa-plus text-xs" />
              </button>
            </div>
          </div>

          {/* Days Modifier */}
          {selectedPackage?.duration === 1 && (
            <div className={`hidden md:flex items-center justify-between pt-3 pb-6 border-b border-gray-200/50`}>
              <span className="text-sm font-bold text-gray-700">
                {days === 1 ? t('plans.duration.day') : t('orders.days')}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                  onClick={() => days > 1 && onDaysChange(days - 1)}
                >
                  <i className="fa-solid fa-minus text-xs" />
                </button>
                <span className="font-black text-base w-6 text-center text-gray-900">{days}</span>
                <button
                  type="button"
                  className="w-8 h-8 border border-gray-300 rounded-xl flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                  onClick={() => days < 30 && onDaysChange(days + 1)}
                >
                  <i className="fa-solid fa-plus text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* Subtotal */}
          <div className="hidden md:flex items-center justify-between pt-3 pb-6 border-b border-gray-200/50">
            <span className="text-sm font-bold text-gray-700">{t('orders.subTotal')}</span>
            <div className="flex flex-col items-end">
              <span className="font-black text-base text-gray-900">
                {currencyFormatter(totalPrice, currency)}
              </span>
              {hasDiscountVal && (
                <span className="text-xs line-through text-gray-400">
                  {currencyFormatter(originalPrice, currency)}
                </span>
              )}
            </div>
          </div>

          {/* Customer Billing Form */}
          <div className={`pt-3 pb-6 md:border-b border-gray-200/50 space-y-3 ${step === 1 ? 'hidden md:block' : 'block'}`}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 mb-2">{t('orders.billingInformation')}</h4>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="md:hidden inline-flex items-center justify-center text-gray-500 border rounded-xl border-gray-300 bg-white size-8 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">{t('orders.deliveryMethod')}</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={deliveryMethod === 'email'}
                    onChange={() => setDeliveryMethod('email')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>{t('orders.email')}</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={deliveryMethod === 'whatsapp'}
                    onChange={() => setDeliveryMethod('whatsapp')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>{t('orders.whatsapp')}</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={deliveryMethod === 'phone'}
                    onChange={() => setDeliveryMethod('phone')}
                    className="text-primary focus:ring-primary"
                  />
                  <span>{t('orders.sms')}</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1 text-left">
              <label className="block text-xs font-bold text-gray-700">
                {t('orders.fullName')} <span className="text-red-500">*</span>
              </label>
              <input
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                type="text"
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
                placeholder={t('orders.namePlaceholder')}
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1 text-left">
              <label className="block text-xs font-bold text-gray-700">
                {t('orders.emailAddress')} <span className="text-red-500">*</span>
              </label>
              <input
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                type="email"
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
                placeholder={t('orders.emailPlaceholder')}
              />
            </div>

            {/* Phone (conditional) */}
            {(deliveryMethod === 'whatsapp' || deliveryMethod === 'phone') && (
              <div className="flex flex-col gap-1 text-left">
                <label className="block text-xs font-bold text-gray-700">
                  {t('orders.phoneNumber')} <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="w-24 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    type="tel"
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-left"
                    placeholder={t('orders.phonePlaceholder')}
                    pattern="[567][0-9]{8}"
                    maxLength={9}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Total display desktop */}
          <div className="hidden md:flex items-center justify-between pt-3 pb-6">
            <span>{t('orders.total')}</span>
            <div className="flex flex-col items-end">
              <span className="font-black text-lg text-gray-900">
                {currencyFormatter(totalPrice, currency)}
              </span>
              {hasDiscountVal && (
                <span className="text-sm line-through text-gray-400">
                  {currencyFormatter(originalPrice, currency)}
                </span>
              )}
            </div>
          </div>

          {/* Desktop submission button */}
          <button
            type="submit"
            className="btn-primary w-full hidden md:flex items-center justify-center mt-4 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin mr-2" />
            ) : (
              <span>{t('orders.placeOrder')}</span>
            )}
          </button>

          {/* Mobile bottom CTA actions */}
          {step === 1 && (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary w-full md:hidden mt-2 cursor-pointer"
            >
              {t('common.continue')}
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              className="btn-primary w-full md:hidden mt-2 flex items-center justify-center cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin mr-2" />
              ) : (
                <span>
                  {t('orders.placeOrder')} {currencyFormatter(totalPrice, currency)}
                </span>
              )}
            </button>
          )}

          {/* Mobile exclusive app rates caption */}
          <p className="text-[11px] text-gray-400 font-semibold text-center hidden md:block mt-2">
            {t('orders.appExclusiveRates')}
          </p>
        </form>
      ) : (
        <div className="text-center py-10 text-gray-500 text-sm font-medium">
          <i className="fa-light fa-wallet text-3xl text-gray-300 mb-3 block" />
          {t('orders.emptySummaryState')}
        </div>
      )}
    </div>
  );
};
