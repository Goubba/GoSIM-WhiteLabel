import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-desktop-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="hidden md:block bg-gray-900 text-white">
      <div class="max-w-6xl mx-auto px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-2">
            <div class="mb-6">
              <h3 class="text-xl font-bold text-primary mb-4">GoSIM</h3>
              <p class="text-gray-300 text-sm leading-relaxed max-w-md">
                {{ 'footer.companyDescription' | t }}
              </p>
            </div>
            <!-- Social Links -->
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <i class="fab fa-linkedin text-lg"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold text-white mb-4">{{ 'footer.quickLinks' | t }}</h4>
            <ul class="space-y-3">
              <li><a routerLink="/search" class="text-gray-300 hover:text-white text-sm transition-colors">{{ 'footer.allDestinations' | t }}</a></li>
              <li><a routerLink="/esims" class="text-gray-300 hover:text-white text-sm transition-colors">{{ 'footer.globalPlans' | t }}</a></li>
              <li><a routerLink="/guide/installation" class="text-gray-300 hover:text-white text-sm transition-colors">{{ 'footer.installationGuides' | t }}</a></li>
              <li><a routerLink="/support" class="text-gray-300 hover:text-white text-sm transition-colors">{{ 'footer.customerSupport' | t }}</a></li>
              <li><a routerLink="/profile" class="text-gray-300 hover:text-white text-sm transition-colors">{{ 'footer.myAccount' | t }}</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold text-white mb-4">{{ 'footer.contact' | t }}</h4>
            <ul class="space-y-3">
              <li class="flex items-center space-x-3">
                <i class="fas fa-envelope text-gray-400 text-sm"></i>
                <a href="mailto:hello@gosim.co" class="text-gray-300 hover:text-white text-sm transition-colors">
                  hello&#64;gosim.co
                </a>
              </li>
              <li class="flex items-center space-x-3">
                <i class="fas fa-phone text-gray-400 text-sm"></i>
                <a href="tel:+213561335719" class="text-gray-300 hover:text-white text-sm transition-colors">
                  +213 561 33 57 19
                </a>
              </li>
              <li class="flex items-center space-x-3">
                <i class="fas fa-map-marker-alt text-gray-400 text-sm"></i>
                <span class="text-gray-300 text-sm">Hydra, Algiers, Algeria</span>
              </li>
            </ul>
            <!-- Certifications -->
            <div class="mt-6">
              <h5 class="font-semibold text-white mb-3 text-sm">{{ 'footer.certifications' | t }}</h5>
              <div class="flex space-x-2">
                <span class="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  SSL {{ 'footer.secure' | t }}
                </span>
                <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">GDPR</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-700 mt-8 pt-6">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p class="text-gray-400 text-sm">
              &copy; 2024 GoSIM. {{ 'footer.allRightsReserved' | t }}. {{ 'footer.poweredBy' | t }} Goubba.
            </p>
            <div class="flex space-x-6">
              <a href="https://getgosim.com/privacy" target="_blank" class="text-gray-400 hover:text-white text-sm transition-colors">
                {{ 'footer.privacyPolicy' | t }}
              </a>
              <a href="https://getgosim.com/terms" target="_blank" class="text-gray-400 hover:text-white text-sm transition-colors">
                {{ 'footer.termsOfUse' | t }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class DesktopFooterComponent {}
