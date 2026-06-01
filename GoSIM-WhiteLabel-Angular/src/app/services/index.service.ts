import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexService {
  private state = {
    pendingOrderData: null as any,
    guestEsims: [] as any[],
    myEsimsUsageBadgeDismissed: false,
    notificationStatus: {} as any,
    lang: sessionStorage.getItem('lang') || 'fr',
    publicKey: sessionStorage.getItem('publicKey') || null as string | null,
    host: sessionStorage.getItem('host') || null as string | null,
    currency: sessionStorage.getItem('currency') || null as string | null,
    header: sessionStorage.getItem('header') !== null ? sessionStorage.getItem('header') === 'true' : true,
    footer: sessionStorage.getItem('footer') !== null ? sessionStorage.getItem('footer') === 'true' : true,
    color: sessionStorage.getItem('color') || null as string | null,
  };

  get pendingOrderData() { return this.state.pendingOrderData; }
  get guestEsims() { return this.state.guestEsims; }
  get lang() { return this.state.lang; }
  get publicKey() { return this.state.publicKey; }
  get host() { return this.state.host; }
  get currency() { return this.state.currency; }
  get header() { return this.state.header; }
  get footer() { return this.state.footer; }
  get color() { return this.state.color; }

  setPendingOrderData(data: any) { this.state.pendingOrderData = data; }
  setGuestEsims(esims: any[]) { this.state.guestEsims = esims; }
  addGuestEsim(esim: any) { this.state.guestEsims.push(esim); }
  setBadgeDismissed(status: boolean) { this.state.myEsimsUsageBadgeDismissed = status; }
  setNotificationStatus(status: any) { this.state.notificationStatus = status; }

  setLang(lang: string) {
    this.state.lang = lang;
    if (lang) sessionStorage.setItem('lang', lang);
  }

  setPublicKey(key: string) {
    this.state.publicKey = key;
    if (key) sessionStorage.setItem('publicKey', key);
  }

  setHost(host: string) {
    this.state.host = host;
    if (host) sessionStorage.setItem('host', host);
  }

  setCurrency(currency: string) {
    this.state.currency = currency;
    if (currency) sessionStorage.setItem('currency', currency);
  }

  setHeader(status: string | boolean) {
    this.state.header = status === 'true' || status === true;
    sessionStorage.setItem('header', this.state.header.toString());
  }

  setFooter(status: string | boolean) {
    this.state.footer = status === 'true' || status === true;
    sessionStorage.setItem('footer', this.state.footer.toString());
  }

  setColor(color: string | null) {
    this.state.color = color;
    if (color) {
      sessionStorage.setItem('color', color);
      let validColor = color;
      if (/^[0-9A-Fa-f]{6}$/i.test(color)) {
        validColor = '#' + color;
      }
      document.documentElement.style.setProperty('--color-primary', validColor);
    } else {
      sessionStorage.removeItem('color');
      document.documentElement.style.removeProperty('--color-primary');
    }
  }
}
