import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { showFooter, t } = useApp();

  if (!showFooter) return null;

  return (
    <footer className="hidden md:block bg-gray-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary mb-4">GoSIM</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                {t('footer.companyDescription')}
              </p>
            </div>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.allDestinations')}
                </Link>
              </li>
              <li>
                <Link to="/esims" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.globalPlans')}
                </Link>
              </li>
              <li>
                <Link to="/guide/installation" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.installationGuides')}
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.customerSupport')}
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white text-sm transition-colors">
                  {t('footer.myAccount')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <i className="fas fa-envelope text-gray-400 text-sm"></i>
                <a href="mailto:hello@gosim.co" className="text-gray-300 hover:text-white text-sm transition-colors">
                  hello@gosim.co
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-phone text-gray-400 text-sm"></i>
                <a href="tel:+213561335719" className="text-gray-300 hover:text-white text-sm transition-colors">
                  +213 561 33 57 19
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-gray-400 text-sm"></i>
                <span className="text-gray-300 text-sm">Hydra, Algiers, Algeria</span>
              </li>
            </ul>
            {/* Certifications */}
            <div className="mt-6">
              <h5 className="font-semibold text-white mb-3 text-sm">{t('footer.certifications')}</h5>
              <div className="flex space-x-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  SSL {t('footer.secure')}
                </span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">GDPR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; 2024 GoSIM. {t('footer.allRightsReserved')}. {t('footer.poweredBy')} Goubba.
            </p>
            <div className="flex space-x-6">
              <a href="https://getgosim.com/privacy" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.privacyPolicy')}
              </a>
              <a href="https://getgosim.com/terms" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.termsOfUse')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
