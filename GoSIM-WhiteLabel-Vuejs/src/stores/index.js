import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', {
  state: () => ({
    pendingOrderData: null,
    guestEsims: [],
    myEsimsUsageBadgeDismissed: false,
    notificationStatus: {},
    lang: sessionStorage.getItem('lang') || 'fr',
    publicKey: sessionStorage.getItem('publicKey') || null,
    host: sessionStorage.getItem('host') || null,
    currency: sessionStorage.getItem('currency') || null,
    header: sessionStorage.getItem('header') !== null ? sessionStorage.getItem('header') === 'true' : true,
    footer: sessionStorage.getItem('footer') !== null ? sessionStorage.getItem('footer') === 'true' : true,
    color: sessionStorage.getItem('color') || null
  }),
  actions: {
    setPendingOrderData(data) {
      this.pendingOrderData = data
    },
    setGuestEsims(esims) {
      this.guestEsims = esims
    },
    addGuestEsim(esim) {
      this.guestEsims.push(esim)
    },
    setBadgeDismissed(status) {
      this.myEsimsUsageBadgeDismissed = status
    },
    setNotificationStatus(status) {
      this.notificationStatus = status
    },
    setLang(lang) {
      this.lang = lang
      if (lang) sessionStorage.setItem('lang', lang)
    },
    setPublicKey(key) {
      this.publicKey = key
      if (key) sessionStorage.setItem('publicKey', key)
    },
    setHost(host) {
      this.host = host
      if (host) sessionStorage.setItem('host', host)
    },
    setCurrency(currency) {
      this.currency = currency
      if (currency) sessionStorage.setItem('currency', currency)
    },
    setHeader(status) {
      this.header = status === 'true' || status === true
      sessionStorage.setItem('header', this.header.toString())
    },
    setFooter(status) {
      this.footer = status === 'true' || status === true
      sessionStorage.setItem('footer', this.footer.toString())
    },
    setColor(color) {
      this.color = color
      if (color) {
        sessionStorage.setItem('color', color)
        let validColor = color
        if (/^[0-9A-Fa-f]{6}$/i.test(color)) {
          validColor = '#' + color
        }
        document.documentElement.style.setProperty('--color-primary', validColor)
      } else {
        sessionStorage.removeItem('color')
        document.documentElement.style.removeProperty('--color-primary')
      }
    }
  }
})
