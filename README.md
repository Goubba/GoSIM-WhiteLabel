# GoSIM White Label — Full Documentation

> **Version:** 1.1.0 · **Last updated:** June 1, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start & Iframe Integration](#quick-start--iframe-integration)
3. [Architecture & Key Security](#architecture--key-security)
4. [Framework Availability](#framework-availability)
5. [Frontend Frameworks](#frontend-frameworks)
   - [Tech Stack](#tech-stack)
   - [Project Structure](#project-structure)
   - [Environment Variables](#environment-variables)
   - [URL Query Parameters (White-Label Config)](#url-query-parameters-white-label-config)
   - [Routing](#routing)
   - [State Management (Pinia)](#state-management-pinia)
   - [HTTP Client (Axios)](#http-client-axios)
   - [Internationalization (i18n)](#internationalization-i18n)
   - [Utility Functions](#utility-functions)
   - [Views](#views)
   - [Components](#components)
6. [Backend Proxy](#backend-proxy)
   - [Purpose](#purpose)
   - [Setup](#proxy-setup)
   - [Endpoints](#endpoints)
   - [Customization](#customization)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)

---

## Overview

**GoSIM White Label** is a fully embeddable, white-label eSIM storefront. Partners embed it on their own websites or apps to sell travel eSIM packages powered by the GoSIM platform.

The white-label storefront is implemented in three modern, state-of-the-art frontend frameworks to fit any tech stack:

- 🟢 **Vue.js** (`GoSIM-WhiteLabel-Vuejs`) — Built using Vue 3, Vite, Pinia, and Tailwind CSS.
- 🔵 **React.js** (`GoSIM-WhiteLabel-Reactjs`) — Built using React 19, TypeScript, Vite, and Tailwind CSS v4.
- 🔴 **Angular** (`GoSIM-WhiteLabel-Angular`) — Built using Angular 18, TypeScript, and Tailwind CSS.

---

## Quick Start & Iframe Integration

To use the white-label storefront inside an **iframe** on your website, you can use the direct hosted embed URL:

```html
<iframe
  src="https://iframe.gosim.co?api-key=your_api_key&language=fr&currency=dzd"
  width="100%"
  height="700px"
  frameborder="0"
>
</iframe>
```

### URL Configuration Parameters:

- `api-key`: Your GoSIM partner public API key (used in direct mode).
- `language`: The default locale to display (`en` for English, `fr` for French, `ar` for Arabic with full RTL support).
- `currency`: The display currency (`dzd` for Algerian Dinars, `usd` for US Dollars).
- `color`: Custom primary branding hex color (e.g. `color=FF5733`).
- `header`: Show or hide the top header navigation bar (`true` or `false`).
- `footer`: Show or hide the desktop footer section (`true` or `false`).

---

## Architecture & Key Security

To protect your partner API key and avoid exposing it on the client browser, you can deploy a server-side proxy (available in both **Node.js** and **Laravel** templates).

The proxy serves as a secure gateway that intercepts your frontend requests, injects your secret API key on the server, and forwards/redirects the request directly to the secure GoSIM server.

```
┌──────────────────────────────────────────────────────────────┐
│                     Partner Website / App                     │
│               (embeds the storefront via iframe)             │
│                                                              │
│  URL params: ?host=https://my-proxy.com&color=FF5733         │
└────────────────────────┬─────────────────────────────────────┘
                         │ (Bypasses exposing api-key in URL)
              ┌──────────▼──────────┐
              │  Frontend SPA       │
              │  (Vue, React, Ang)  │
              └──────────┬──────────┘
                         │ (Redirects calls to your proxy)
              ┌──────────▼──────────┐
              │  Secure Proxy Server│
              │  (Node.js / Laravel)│
              │  • Injects api-key  │
              └──────────┬──────────┘
                         │ (Sends authenticated call)
              ┌──────────▼──────────┐
              │   GoSIM Vendor API  │
              │   /api/v1/vendor    │
              └─────────────────────┘
```

### Implementing Proxy Secure Mode in Iframe:

1. Deploy the proxy backend on your server (e.g., `https://api.yourdomain.com`).
2. Simply replace the `api-key` query parameter with the `host` query parameter pointing to your proxy server:

```html
<iframe
  src="https://iframe.gosim.co?host=https://api.yourdomain.com&language=fr&currency=dzd"
  width="100%"
  height="700px"
  frameborder="0"
>
</iframe>
```

---

## Framework Availability

The storefront source code is structured as follows inside the repository:

### 1. [Vue 3 Storefront](file:///home/lordkarim/Documents/GitHub/GoSIM-WhiteLabel/GoSIM-WhiteLabel-Vuejs)

- **Directory**: `GoSIM-WhiteLabel-Vuejs`
- **Run Development**: `npm run dev`
- **Build Production**: `npm run build`

### 2. [React 19 Storefront](file:///home/lordkarim/Documents/GitHub/GoSIM-WhiteLabel/GoSIM-WhiteLabel-Reactjs)

- **Directory**: `GoSIM-WhiteLabel-Reactjs`
- **Run Development**: `npm run dev`
- **Build Production**: `npm run build`

### 3. [Angular 18 Storefront](file:///home/lordkarim/Documents/GitHub/GoSIM-WhiteLabel/GoSIM-WhiteLabel-Angular)

- **Directory**: `GoSIM-WhiteLabel-Angular`
- **Run Development**: `npm run start`
- **Build Production**: `npm run build`

---

## Frontend Frameworks

The white-label frontend storefront is available in three distinct, fully optimized framework implementations:

---

### 🟢 Vue.js Storefront (`GoSIM-WhiteLabel-Vuejs`)

#### Tech Stack
* **Vue 3** (`^3.5`) & **Vite** (`^6.2`) — Core SPA renderer & rapid dev bundler.
* **Tailwind CSS** (`^4.1`) — Modern custom primary color overrides.
* **Pinia** (`^3.0`) & **Vue Router** (`^4.5`) — Core state store & route history navigation.
* **Axios** (`^1.10`) — Handles direct API keys or backend proxy headers.
* **vue-i18n** (`^11.1`) — Trilingual locales (EN, FR, AR) with full RTL page support.

#### Structure
```
GoSIM-WhiteLabel-Vuejs/
├── index.html                   # Vue entry document
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Tailwind v4 plugin compilation config
├── src/
│   ├── main.js                  # Bootstraps stores, router, locales
│   ├── App.vue                  # Decouples query params & builds layout structure
│   ├── axios.js                 # Axios instance with request/response interceptors
│   ├── router/index.js          # Routes: /search, /packages/:code, /status/:id
│   ├── stores/index.js          # Pinia store config with sessionStorage sync
│   ├── utils/index.js           # Currency, bytes, and dates formatting logic
│   ├── locales/                 # Trilingual dictionary assets (en.js, fr.js, ar.js)
│   ├── views/                   # SearchView, PackagesListView, StatusView
│   └── components/              # SummaryForm checkout forms & dynamic headers
```

---

### 🔵 React.js Storefront (`GoSIM-WhiteLabel-Reactjs`)

#### Tech Stack
* **React 19** & **TypeScript** — Strictly-typed reactive UI framework.
* **Vite** (`^6.2`) & **Tailwind CSS v4** — High-performance bundling and dynamic primary branding HSL injections.
* **React Router Dom** (`^7.2`) — Route paths matching the Vue routing layout.
* **Axios** (`^1.10`) — Configured client interceptor injecting keys or proxies synchronously.
* **qrcode.react** (`^4.2`) — High-fidelity SVG QR codes for eSIM status pages.

#### Structure
```
GoSIM-WhiteLabel-Reactjs/
├── index.html                   # React HTML bundle page (GoSIM title, favicon.ico)
├── package.json                 # Core scripts (dev, build, preview)
├── vite.config.ts               # Vite bundler options
├── src/
│   ├── main.tsx                 # Bootstraps React Router & AppProvider
│   ├── App.tsx                  # Standard layout structure with Header/Footer links
│   ├── context/
│   │   └── AppContext.tsx       # Synchronous URL parameter sync + dot-notation i18n
│   ├── services/
│   │   └── http.ts              # Axios instance intercepting sessionStorage API keys
│   ├── utils/
│   │   └── utils.ts             # Shared DZD/USD currency and bytes calculators
│   ├── locales/                 # Parity translations (en.ts, fr.ts, ar.ts)
│   ├── views/                   # Search.tsx, PackagesList.tsx, Status.tsx
│   └── components/              # SummaryForm.tsx checkout modules & headers
```

---

### 🔴 Angular Storefront (`GoSIM-WhiteLabel-Angular`)

#### Tech Stack
* **Angular 18** & **TypeScript** — Enterprise-ready component framework.
* **Tailwind CSS** (`^3.4`) — Pre-compiled layout styling.
* **RxJS** — Reactive streams handling client state and HTTP interceptors.
* **Angular Router** — Modular routing tables.

#### Structure
```
GoSIM-WhiteLabel-Angular/
├── public/                      # Static branding logos, favicons, cover banners
├── src/
│   ├── index.html               # Main base index
│   ├── main.ts                  # Bootstraps Angular modules
│   └── app/
│       ├── app.routes.ts        # App route directions
│       ├── app.component.ts     # Main bootstrap container
│       ├── services/
│       │   ├── app.service.ts   # Central trilingual translator and state sync
│       │   ├── http.service.ts  # Axios client wrapper for HTTP calls
│       │   └── utils.service.ts # Parity currency and bytes formats
│       ├── views/               # SearchComponent, PackagesListComponent, StatusComponent
│       └── components/          # Header, Footer, DefaultPageHeader layouts
```

### Environment Variables

File: `.env`

| Variable          | Example                                       | Description                                                               |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `VITE_BASE_URL`   | `https://business.getgosim.com/api/v1/vendor` | Default API base URL for Axios                                            |
| `VITE_PUBLIC_KEY` | `DY7aBP1o4Hz2ri...`                           | Fallback API key (used when no `api-key` URL param or store value exists) |

For the Node proxy, add to `.env`:

| Variable  | Example           | Description                                   |
| --------- | ----------------- | --------------------------------------------- |
| `API_KEY` | `your_secret_key` | The API key injected server-side by the proxy |
| `PORT`    | `3000`            | Port the proxy listens on                     |

### URL Query Parameters (White-Label Config)

Partners customize the storefront by appending query parameters to the embed URL. These are parsed in `App.vue`'s `mounted()` hook and persisted to `sessionStorage` via the Pinia store.

| Parameter  | Type                 | Default     | Description                                                   |
| ---------- | -------------------- | ----------- | ------------------------------------------------------------- |
| `api-key`  | `string`             | from `.env` | Vendor public API key (direct mode)                           |
| `host`     | `string`             | —           | Proxy server URL (proxy mode); replaces Axios `baseURL`       |
| `language` | `ar` \| `en` \| `fr` | `fr`        | UI language. Arabic triggers RTL layout                       |
| `currency` | `string`             | `dzd`       | Currency code for price display (e.g. `usd`, `eur`)           |
| `header`   | `true` \| `false`    | `true`      | Show/hide the top navigation header                           |
| `footer`   | `true` \| `false`    | `true`      | Show/hide the desktop footer                                  |
| `color`    | `hex string`         | —           | Override the primary brand color (e.g. `FF5733` or `#FF5733`) |

**Example embed URL:**

```
https://gosim.example.com/search?api-key=abc123&language=en&currency=usd&header=false&color=3B82F6
```

**Persistence:** All values are saved to `sessionStorage` so they survive page navigations within the same tab but don't leak across tabs or sessions.

### Routing

Defined in `src/router/index.js`. Uses HTML5 History mode.

| Path              | Name       | View                   | Description                                  |
| ----------------- | ---------- | ---------------------- | -------------------------------------------- |
| `/`               | —          | Redirects to `/search` | —                                            |
| `/search`         | `search`   | `SearchView.vue`       | Browse countries and regions                 |
| `/packages/:code` | `packages` | `PackagesListView.vue` | View & select eSIM packages for a location   |
| `/status/:id`     | `status`   | `StatusView.vue`       | Payment result, order details, eSIM QR codes |

### State Management (Pinia)

Store: `src/stores/index.js` — `useIndexStore`

| State Property     | Type             | Persistence      | Description                                               |
| ------------------ | ---------------- | ---------------- | --------------------------------------------------------- |
| `pendingOrderData` | `Object \| null` | Memory only      | Temporarily holds location + package data during checkout |
| `guestEsims`       | `Array`          | Memory only      | Guest eSIM list                                           |
| `lang`             | `string`         | `sessionStorage` | Current language code                                     |
| `publicKey`        | `string \| null` | `sessionStorage` | API key for direct mode                                   |
| `host`             | `string \| null` | `sessionStorage` | Proxy host URL                                            |
| `currency`         | `string \| null` | `sessionStorage` | Active currency code                                      |
| `header`           | `boolean`        | `sessionStorage` | Header visibility toggle                                  |
| `footer`           | `boolean`        | `sessionStorage` | Footer visibility toggle                                  |
| `color`            | `string \| null` | `sessionStorage` | Custom primary color override                             |

The `setColor()` action validates hex input and applies it to `--color-primary` CSS custom property on `document.documentElement`.

### HTTP Client (Axios)

File: `src/axios.js`

Creates a single Axios instance with a **request interceptor** that:

1. Reads the Pinia store on every request
2. If `publicKey` exists → sets `api-key` header
3. If `host` exists → overrides `config.baseURL` to route requests to the proxy

```
Request Flow:
  Component → axiosClient.get/post() → Interceptor → API or Proxy
```

### Internationalization (i18n)

- **Default locale:** `fr` (French)
- **Supported:** `fr`, `en`, `ar`
- **RTL:** When Arabic is selected, `dir="rtl"` is set on `<html>` and the `arabic-lang` class is added to `<body>`
- Translation files are plain JS objects in `src/locales/`

### Utility Functions

File: `src/utils/index.js` — Installed as a Vue plugin.

| Function                     | Global Access                 | Description                                                              |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `currencyFormatter(val)`     | `this.$currencyFormatter`     | Formats a number with the active currency (e.g. `1,500 DZD`)             |
| `formatBytes(bytes, locale)` | `this.$formatBytes`           | Converts bytes to human-readable `MB` / `GB` with Arabic numeral support |
| `dateFormatterWithTime(val)` | `this.$dateFormatterWithTime` | Formats date with time (`fr-fr` locale)                                  |
| `dateFormatterShort(val)`    | `this.$dateFormatterShort`    | Formats date only (`fr-fr` locale)                                       |

Also exposes `appStoreMock` as `this.appStore` in all components via a global mixin, providing a lightweight preferences layer.

### Views

#### 1. SearchView (`/search`)

The landing page. Allows users to search for countries and regions that offer eSIM packages.

- **Search input** with 300ms debounce
- **Tabs:** Countries / Regions
- **Location grid** with cover images, flags, and starting prices
- Clicking a location navigates to `/packages/:code`
- **API call:** `GET /locations?search=<query>`
- **Loading state:** Skeleton grid with animated placeholders

#### 2. PackagesListView (`/packages/:code`)

Displays available eSIM packages for a selected country/region.

- **Location banner** with flag, name, and operator network badges
- **Feature badges:** Speed, network quality, coverage
- **Plan type tabs:** Unlimited (duration=1) / Fixed plans
- **Package cards** with radio-style selection, volume, duration, pricing
- **Discount system:** `daily_discounts` array on packages provides tiered discounts based on number of days
- **Mobile days adjuster:** Inline ± controls on the selected package card (mobile only)
- **Desktop sidebar:** Sticky `SummaryForm` component
- **Mobile bottom sheet:** Fixed `SummaryForm` at bottom of viewport
- **API call:** `POST /packages` with `{ code, currency }`

#### 3. StatusView (`/status/:id`)

Post-payment confirmation/failure screen.

- **Success state:** Green gradient header with checkmark, order number, total amount, and for each eSIM: QR code, activation code, ICCID, data volume
- **Failure state:** Red gradient header with X mark and error message
- **Status determination:** Checks `payment.status === 'success'` from API, falls back to `?status=success` query param
- **API call:** `GET /order/payment/:paymentId`

### Components

#### SummaryForm

The checkout form component, used in both desktop sidebar and mobile bottom sheet.

| Feature                   | Details                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Quantity modifier**     | ± buttons, emits `update:quantity`                                                                       |
| **Days modifier**         | ± buttons (1–30), only for unlimited plans, emits `update:days`                                          |
| **Subtotal display**      | Shows discounted price with original price struck through                                                |
| **Delivery method**       | Radio group: Email / WhatsApp / SMS                                                                      |
| **Customer fields**       | Name (always), Email (always, required), Phone (shown for WhatsApp/SMS)                                  |
| **Country code selector** | Dropdown for phone country code (default: +213 Algeria)                                                  |
| **Phone validation**      | `pattern="[567][0-9]{8}"`, `maxlength="9"` — Algerian phone format                                       |
| **Mobile step flow**      | Step 1: quantity view → Step 2: billing form                                                             |
| **Submit payload**        | `{ name, email, phone?, whatsapp? }` — phone/whatsapp values are prefixed with the selected country code |

#### DefaultPageHeader

Mobile-only sticky header with back navigation and currency selection modal.

- Supports DZD and USD currencies
- Swipe-modal for currency picker

#### DesktopFooter

Desktop-only footer with company info, quick links, contact details, social media icons, SSL/GDPR badges, and legal links.

---

## Backend Proxy

### Purpose

The proxy server (`node_proxy.js`) allows partners to keep their GoSIM API key secret. Instead of exposing the key in the browser, the frontend sends requests to the proxy, which injects the key server-side and forwards everything to the GoSIM Vendor API.

### Proxy Setup

```bash
# Install dependencies (from project root or standalone)
npm install express axios cors dotenv

# Create .env
echo 'GOSIM_API_KEY=your_secret_key_here' > .env
echo 'PORT=3000' >> .env

# Run
node node_proxy.js
```

Then set the frontend to use proxy mode:

```
https://your-storefront.com/search?host=https://your-proxy.com
```

### Endpoints

Each endpoint is defined as its own Express route so developers can independently customize request/response handling.

#### 1. `GET /locations`

Search for available eSIM locations.

| Query Param | Type     | Required | Description              |
| ----------- | -------- | -------- | ------------------------ |
| `search`    | `string` | No       | Filter locations by name |

**Response:**

```json
{
  "data": {
    "countries": [
      {
        "code": "DZ",
        "name": "Algeria",
        "image": "https://...",
        "cover": "https://...",
        "fromPrice": 500
      }
    ],
    "regions": [...],
    "glob": [...]
  }
}
```

#### 2. `POST /packages`

Get eSIM packages for a specific location.

**Request body:**

```json
{
  "code": "DZ",
  "currency": "dzd"
}
```

**Response:**

```json
{
  "data": {
    "location": {
      "name": "Algeria",
      "image": "https://...",
      "code": "DZ"
    },
    "packages": [
      {
        "id": 123,
        "volume": 1073741824,
        "duration": 7,
        "price": 1500,
        "daily_discounts": [{ "day": 7, "discount": 10 }],
        "locationNetworkList": [
          {
            "operatorList": [{ "operatorName": "Mobilis", "networkType": "4G" }]
          }
        ]
      }
    ]
  }
}
```

#### 3. `POST /order/initiate/unauth/external`

Create a new eSIM order for an unauthenticated (guest) user.

**Request body:**

```json
{
  "package": 123,
  "quantity": 1,
  "days": 7,
  "payment_method": 5,
  "promo_codes": [],
  "currency": "DZD",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+213551234567",
  "country": "DZ",
  "country_phone_code": "+213",
  "delivery": {
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+213551234567"
  }
}
```

The `delivery` object contains only `name` + `email` + one of `phone` or `whatsapp`, depending on user's chosen delivery method.

**Response:**

```json
{
  "data": {
    "data": {
      "payment": {
        "id": "pay_abc123"
      }
    }
  }
}
```

#### 4. `GET /order/payment/:paymentId`

Check payment/order status and retrieve eSIM details.

**Response:**

```json
{
  "data": {
    "status": "success",
    "amount": 1500,
    "extra": { "currency": "DZD" },
    "order": {
      "batch_id": "ORD-2026-001",
      "esims": [
        {
          "id": 1,
          "iccid": "8999...",
          "ac": "LPA:1$...",
          "packageName": "Algeria 1GB 7 Days",
          "totalVolume": 1073741824
        }
      ]
    }
  }
}
```

### Customization

Each route handler is isolated. To customize a response:

```javascript
// Example: Add a custom field to the packages response
app.post("/packages", async (req, res) => {
  // Modify request body before forwarding
  req.body.currency = req.body.currency || "dzd";

  // Forward to GoSIM
  try {
    const targetUrl = `${TARGET_BASE_URL}/packages`;
    const headers = { "api-key": process.env.GOSIM_API_KEY };
    const response = await axios.post(targetUrl, req.body, { headers });

    // Modify response before sending to frontend
    const data = response.data;
    data.data.packages = data.data.packages.map((pkg) => ({
      ...pkg,
      custom_label: "Partner Special",
    }));

    res.status(200).send(data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.response?.data);
  }
});
```

---

## Deployment

### Frontend

```bash
# Development
npm run dev          # Starts Vite dev server with HMR

# Production build
npm run build        # Outputs to ./dist/
npm run preview      # Preview production build locally

# Custom deployment
npm run deploy       # Builds + deploys with gdeploy (Docker + Nginx)
```

### Node Proxy

```bash
# Production
PORT=3000 GOSIM_API_KEY=xxx node node_proxy.js

# With process manager
pm2 start node_proxy.js --name gosim-proxy
```

---

## Summary

| Layer        | File(s)                                    | What it does                                         |
| ------------ | ------------------------------------------ | ---------------------------------------------------- |
| **Entry**    | `index.html`, `main.js`                    | Bootstraps Vue app with all plugins                  |
| **Config**   | `App.vue`                                  | Parses URL params, applies white-label settings      |
| **Auth**     | `axios.js`                                 | Injects API key or swaps base URL                    |
| **State**    | `stores/index.js`                          | Central config store with sessionStorage persistence |
| **Search**   | `SearchView.vue`                           | Country/region browsing                              |
| **Packages** | `PackagesListView.vue` + `SummaryForm.vue` | Package selection + checkout form                    |
| **Status**   | `StatusView.vue`                           | Payment confirmation + eSIM QR delivery              |
| **Proxy**    | `node_proxy.js`                            | Secure API key injection middleware                  |
| **i18n**     | `locales/fr.js`, `en.js`, `ar.js`          | Full trilingual support with RTL                     |
