import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import http from '../services/http';
import { formatBytes } from '../utils/utils';
import { QRCodeSVG } from 'qrcode.react';

interface EsimItem {
  id: number;
  packageName?: string;
  ac?: string;
  iccid?: string;
  totalVolume?: number;
}

interface PaymentDetails {
  status: string;
  amount: number;
  extra?: {
    currency?: string;
  };
  order?: {
    batch_id: string;
    esims?: EsimItem[];
  };
}

export const Status: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { language, t } = useApp();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (!id || id === 'undefined' || id === 'success') {
      setLoading(false);
      return;
    }

    http
      .get(`/order/payment/${id}`)
      .then(({ data }) => {
        setPayment(data?.data || data);
      })
      .catch((err) => {
        console.error('Failed to fetch payment details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const isSuccess = payment ? payment.status === 'success' : searchParams.get('status') === 'success';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-12">
      {/* Status Header Banner */}
      <div
        className={`p-10 md:p-16 text-center relative overflow-hidden rounded-3xl ${
          isSuccess
            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-red-500 via-red-500 to-orange-500'
        }`}
      >
        {/* Decorative Glassmorphism Circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay" />

        <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-[3px] border-white/40 shadow-inner">
          {isSuccess ? (
            <i className="fa-solid fa-check text-5xl md:text-6xl text-white" />
          ) : (
            <i className="fa-solid fa-xmark text-5xl md:text-6xl text-white" />
          )}
        </div>

        <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          {isSuccess ? t('success.title') : t('failure.title')}
        </h1>
        <p className="relative z-10 text-lg md:text-xl text-white/90 font-medium">
          {isSuccess ? t('success.subtitle') : t('failure.subtitle')}
        </p>
      </div>

      {/* Details Section */}
      <div className="mt-6 text-center bg-white space-y-6">
        <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed max-w-lg mx-auto font-medium px-6">
          {isSuccess ? t('success.message') : t('failure.message')}
        </p>

        {/* Order Billing Details Summary */}
        {payment && payment.order && (
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 max-w-sm mx-auto text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">{t('orders.orderNumber')}:</span>
              <span className="text-sm font-bold text-gray-900">{payment.order.batch_id}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200/50 pt-3">
              <span className="text-sm text-gray-500 font-medium">{t('orders.totalAmount')}:</span>
              <span className="text-sm font-bold text-gray-900">
                {payment.amount} {payment.extra?.currency || 'DZD'}
              </span>
            </div>
          </div>
        )}

        {/* Loaded eSIMs Profile Information */}
        {isSuccess && payment?.order?.esims && payment.order.esims.length > 0 && (
          <div className="space-y-6 text-left">
            {payment.order.esims.map((esim) => (
              <div key={esim.id} className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-6 border-b border-gray-200 pb-4">
                  {esim.packageName || 'eSIM'}
                </h3>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* QR Code activation */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                    {esim.ac ? (
                      <QRCodeSVG value={esim.ac} size={180} level="M" />
                    ) : (
                      <div className="w-[180px] h-[180px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                        -
                      </div>
                    )}
                  </div>

                  {/* Manual details */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 text-left">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                        {t('scan.activationCode')}
                      </p>
                      <p className="text-sm font-mono font-semibold text-gray-900 break-all select-all">
                        {esim.ac || 'N/A'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 text-left">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ICCID</p>
                        <p className="text-sm font-semibold text-gray-900 break-all select-all">
                          {esim.iccid || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 text-left">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          {t('plans.data')}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {esim.totalVolume ? formatBytes(esim.totalVolume, language) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4">
          <Link to="/search" className="btn-primary inline-flex cursor-pointer">
            {t('failure.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};
