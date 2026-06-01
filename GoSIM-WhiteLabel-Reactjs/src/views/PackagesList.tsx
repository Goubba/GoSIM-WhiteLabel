import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import http from '../services/http';
import { formatBytes, currencyFormatter } from '../utils/utils';
import { SummaryForm } from './SummaryForm';
import Swal from 'sweetalert2';

interface PackageItem {
  id: number;
  price: number;
  duration: number;
  volume: number;
  daily_discounts?: Array<{ day: number; discount: number }>;
  locationNetworkList?: Array<{
    operatorList: Array<{ operatorName: string; networkType: string }>;
  }>;
}

interface LocationDetails {
  name: string;
  image: string;
  cover: string;
}

export const PackagesList: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { language, currency, t } = useApp();

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [type, setType] = useState<'unlimited' | 'fixed'>('unlimited');
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);

  // Fetch packages for the given location code
  const getPackages = () => {
    setLoading(true);
    http
      .post('/packages', {
        code,
        currency: currency.toLowerCase(),
      })
      .then(({ data }) => {
        const pkgs = data?.data?.packages || [];
        const loc = data?.data?.location || null;
        setPackages(pkgs);
        setLocation(loc);

        const hasUnlimited = pkgs.some((p: PackageItem) => p.duration === 1);
        const initialType = hasUnlimited ? 'unlimited' : 'fixed';
        setType(initialType);

        const filtered = pkgs.filter((p: PackageItem) =>
          initialType === 'unlimited' ? p.duration === 1 : p.duration > 1
        );
        setSelectedPackage(filtered.length > 0 ? filtered[0] : null);
      })
      .catch((err) => {
        console.error('Error fetching packages:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getPackages();
  }, [code, currency]);

  // Adjust package tab change
  const handleTypeChange = (newType: 'unlimited' | 'fixed') => {
    setType(newType);
    const filtered = packages.filter((p) =>
      newType === 'unlimited' ? p.duration === 1 : p.duration > 1
    );
    setSelectedPackage(filtered.length > 0 ? filtered[0] : null);
  };

  const decreaseDays = () => {
    if (days > 1) setDays(days - 1);
  };

  const increaseDays = () => {
    if (days < 30) setDays(days + 1);
  };

  const unlimitedPackages = packages.filter((pkg) => pkg.duration === 1);
  const fixedPackages = packages.filter((pkg) => pkg.duration > 1);
  const networks = packages?.[0]?.locationNetworkList || [];

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

  // Submit order handler
  const handleCheckoutSubmit = (customerDetails: any) => {
    if (!selectedPackage) return;
    setPaymentLoading(true);

    try {
      // Store pending order details
      sessionStorage.setItem(
        'pending_order_data',
        JSON.stringify({
          location,
          packageData: selectedPackage,
        })
      );

      const orderData = {
        package: selectedPackage.id,
        quantity: quantity,
        days: selectedPackage.duration === 1 ? days : null,
        payment_method: 5,
        promo_codes: [],
        currency: currency.toUpperCase(),
        email: customerDetails.email,
        name: customerDetails.name,
        phone: customerDetails.phone || customerDetails.whatsapp,
        country: 'DZ',
        country_phone_code: '+213',
        delivery: customerDetails,
      };

      http
        .post('/order/initiate/unauth/external', orderData)
        .then((response) => {
          const paymentId =
            response.data?.data?.data?.payment?.id ||
            response.data?.data?.payment?.id ||
            response.data?.payment?.id ||
            'success';
          navigate(`/status/${paymentId}?status=success`);
        })
        .catch((error) => {
          console.error('Payment initiation error:', error);
          Swal.fire({
            icon: 'error',
            title: t('fail.operationFailed'),
            text: t('fail.tryAgainLater'),
          });
        })
        .finally(() => {
          setPaymentLoading(false);
        });
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: t('fail.operationFailed'),
        text: t('fail.tryAgainLater'),
      });
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const activePacksList = type === 'unlimited' ? unlimitedPackages : fixedPackages;

  return (
    <div className="space-y-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32 md:pb-4 text-left">
      {/* Left Column: Plan selection cards */}
      <div className="lg:col-span-2 space-y-4 min-w-0">
        {/* Navigation Home Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 font-medium">
          <i className="fa-solid fa-arrow-left text-xs" />
          <span>{t('navigation.home')}</span>
        </Link>

        {/* Location header info */}
        {location && (
          <div className="space-y-2">
            <div className="flex items-center gap-5 bg-gray-50/50 border border-gray-100 rounded-3xl p-6">
              <img src={location.image} alt={location.name} className="w-16 h-16 object-cover rounded-full border border-white shrink-0 shadow-sm" />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black text-gray-900 truncate">{location.name}</h1>
                <div className="flex gap-2 overflow-x-auto w-full mt-1.5 pb-1 no-scrollbar">
                  {networks.map((network: any, nIdx: number) => (
                    <React.Fragment key={nIdx}>
                      {network.operatorList?.map((operator: any, oIdx: number) => (
                        <span
                          key={oIdx}
                          className="bg-gray-100 py-1 px-3 border border-gray-200/60 rounded-full text-xs font-semibold text-gray-600 shrink-0 whitespace-nowrap"
                        >
                          {operator.operatorName} {operator.networkType}
                        </span>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Specs Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <i className="fa-light fa-gauge-max text-lg" />
                </div>
                <p className="text-xs font-semibold text-gray-700">{t('plans.planDetailTwo')}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <i className="fa-light fa-signal-stream text-lg" />
                </div>
                <p className="text-xs font-semibold text-gray-700">{t('plans.planDetailThree')}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <i className="fa-light fa-globe text-lg" />
                </div>
                <p className="text-xs font-semibold text-gray-700">{t('plans.supportedNetwork')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plans list */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('plans.plansTitle')}</h3>
          <p className="text-sm text-gray-600">{t('plans.plansText')}</p>

          {/* Type tabs duration selector */}
          <div className="flex my-4 rounded-2xl bg-gray-100 p-1">
            {unlimitedPackages.length > 0 && (
              <button
                onClick={() => handleTypeChange('unlimited')}
                className={`w-full py-2 rounded-2xl font-bold text-center transition-all cursor-pointer ${
                  type === 'unlimited' ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
                }`}
              >
                {t('plans.duration.unlimited')}
              </button>
            )}
            {fixedPackages.length > 0 && (
              <button
                onClick={() => handleTypeChange('fixed')}
                className={`w-full py-2 rounded-2xl font-bold text-center transition-all cursor-pointer ${
                  type === 'fixed' ? 'bg-primary text-white shadow-sm' : 'text-gray-600'
                }`}
              >
                {t('plans.fixedPlans')}
              </button>
            )}
          </div>

          {/* Cards listing */}
          <div className="grid gap-4">
            {activePacksList.map((pack) => {
              const isSelected = selectedPackage?.id === pack.id;
              const hasDiscountVal = isSelected && pack.duration === 1 && getDiscount(pack, days) > 0;
              const formattedVolume = formatBytes(pack.volume, language);
              
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPackage(pack)}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 group hover:border-primary select-none ${
                    isSelected ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {/* Check indicator circle */}
                      <div
                        className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <i className="fa-solid fa-check text-[10px]" />}
                      </div>
                      <div>
                        <h4
                          className={`font-bold text-lg text-gray-900 group-hover:text-primary ${
                            isSelected ? 'text-primary' : ''
                          }`}
                        >
                          {pack.duration === 1
                            ? `${formattedVolume} ${t('plans.duration.unlimitedData')}`
                            : formattedVolume}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {pack.duration === 1
                            ? t('plans.duration.perDay')
                            : t('plans.duration.days', { count: pack.duration.toString() })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="font-black text-xl text-gray-900">
                        {isSelected && pack.duration === 1
                          ? currencyFormatter(getDiscountedPrice(pack, days), currency)
                          : currencyFormatter(pack.price, currency)}
                      </span>
                      {hasDiscountVal && (
                        <span className="text-sm text-gray-400 line-through mt-0.5">
                          {currencyFormatter(pack.price * days, currency)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile inline days selection indicator */}
                  {isSelected && pack.duration === 1 && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="md:hidden flex justify-between items-center pb-0 border-t-[0.5px] pt-4 mt-4 border-primary"
                    >
                      <button
                        type="button"
                        onClick={decreaseDays}
                        disabled={days === 1}
                        className="py-1 px-6 cursor-pointer disabled:opacity-50"
                      >
                        <i className="fa-solid fa-minus text-lg" />
                      </button>
                      <span className="font-bold text-gray-900">
                        {days} {days === 1 ? t('plans.duration.day') : t('orders.days')}
                      </span>
                      <button
                        type="button"
                        onClick={increaseDays}
                        disabled={days === 30}
                        className="py-1 px-6 cursor-pointer disabled:opacity-50"
                      >
                        <i className="fa-solid fa-plus text-lg" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Desktop Summary Checkout Form */}
      <div className="w-full lg:sticky lg:top-24 self-start hidden md:block">
        <SummaryForm
          selectedPackage={selectedPackage}
          quantity={quantity}
          days={days}
          location={location}
          loading={paymentLoading}
          onQuantityChange={setQuantity}
          onDaysChange={setDays}
          onFormSubmit={handleCheckoutSubmit}
        />
      </div>

      {/* Mobile Floating Bottom Checkout Form */}
      <div className="fixed bottom-0 inset-x-0 md:hidden z-50">
        <SummaryForm
          selectedPackage={selectedPackage}
          quantity={quantity}
          days={days}
          location={location}
          loading={paymentLoading}
          onQuantityChange={setQuantity}
          onDaysChange={setDays}
          onFormSubmit={handleCheckoutSubmit}
        />
      </div>
    </div>
  );
};
