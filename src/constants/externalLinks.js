import { Package, Radar, ShieldAlert, Ship } from 'lucide-react';

const LEGACY_PORTAL_BASE = String(
  import.meta.env.VITE_PORTAL_BASE_URL || '',
).trim();
const LEGACY_MARKETING_BASE = String(
  import.meta.env.VITE_MARKETING_BASE_URL || '',
).trim();
const LEGACY_AVANTI_BASE = String(
  import.meta.env.VITE_AVANTI_BASE_URL || '',
).trim();
const LEGACY_SHIPRITE_LTL_URL = String(
  import.meta.env.VITE_SHIPRITE_LTL_URL || '',
).trim();
const LEGACY_CARGO_INSURANCE_URL = String(
  import.meta.env.VITE_CARGO_INSURANCE_URL || '',
).trim();

export const EXTERNAL_LINKS = {
  portalBase: LEGACY_PORTAL_BASE,
  marketingBase: LEGACY_MARKETING_BASE,
  avantiBase: LEGACY_AVANTI_BASE,
  shipriteLtlUrl: LEGACY_SHIPRITE_LTL_URL,
  cargoInsuranceUrl: LEGACY_CARGO_INSURANCE_URL,
  quickTrackBase: `${LEGACY_MARKETING_BASE}/tracking-results?tracking=`,
  locationsBase: `${LEGACY_MARKETING_BASE}/contact/locations`,
  promoSignupUrl: `${LEGACY_MARKETING_BASE}/email-signup`,
  sailingScheduleBase: `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`,
};

export const NAVBAR_DESKTOP_MENUS = [
  {
    id: 'services',
    label: 'Services',
    sections: [
      {
        id: 'service-types',
        label: 'Service Types',
        links: [
          { href: '/services#airfreight', text: 'Airfreight' },
          { href: '/services#fcl', text: 'FCL Ocean Freight' },
          { href: '/services#lcl', text: 'LCL Consolidation' },
          { href: '/services#cfs', text: 'CFS and Warehouse' },
        ],
      },
      {
        id: 'digital-tools',
        label: 'Digital Tools',
        links: [
          {
            href: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
            text: 'Vanguard ADESSO',
          },
          {
            href: `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`,
            text: 'Sailing Schedule',
          },
          {
            href: `${LEGACY_PORTAL_BASE}/apps/documentation/`,
            text: 'Documentation Portal',
          },
        ],
      },
    ],
    links: [
      { href: '/services', text: 'Overview' },
      { href: '/services#airfreight', text: 'Airfreight' },
      { href: '/services#cfs', text: 'CFS & Warehouse' },
      { href: '/services#customs', text: 'Customs Services' },
      { href: '/services#fcl', text: 'FCL Ocean Freight' },
      { href: '/services#lcl', text: 'LCL Consolidation' },
      { href: '/services#technology', text: 'Technology Solutions' },
    ],
  },
  {
    id: 'company',
    label: 'Our Company',
    sections: [
      {
        id: 'about',
        label: 'About Vanguard Trace',
        links: [
          { href: '/about', text: 'About Us' },
          { href: '/about#leadership', text: 'Leadership Team' },
          { href: '/about#history', text: 'History' },
        ],
      },
      {
        id: 'careers',
        label: 'People and Careers',
        links: [
          { href: '/about#values', text: 'Our Values' },
          { href: '/about#careers', text: 'Careers' },
        ],
      },
    ],
    links: [
      { href: '/about', text: 'About Us' },
      { href: '/about#leadership', text: 'Leadership Team' },
      { href: '/about#history', text: 'History' },
      { href: '/about#values', text: 'Our Values' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    sections: [
      {
        id: 'intel',
        label: 'Market Intelligence',
        links: [
          { href: '/intel#news', text: 'News and Articles' },
          { href: '/intel#gri', text: 'General Rate Increases' },
          { href: '/intel#advisories', text: 'Customer Advisories' },
        ],
      },
      {
        id: 'updates',
        label: 'Operations Updates',
        links: [
          { href: '/intel#market-updates', text: 'Market Updates' },
          { href: '/operations', text: 'Operations Status' },
        ],
      },
    ],
    links: [
      { href: '/intel#news', text: 'News and Articles' },
      { href: '/intel#gri', text: 'General Rate Increases' },
      { href: '/intel#advisories', text: 'Customer Advisories' },
      { href: '/intel#market-updates', text: 'Market Updates' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    sections: [
      {
        id: 'reach-us',
        label: 'Reach Us',
        links: [
          { href: '/contact', text: 'Contact Us' },
          { href: '/contact', text: 'Locations' },
        ],
      },
      {
        id: 'support',
        label: 'Support',
        links: [
          { href: '/settings', text: 'Account Settings' },
          { href: '/traces', text: 'Shipment Traces' },
        ],
      },
    ],
    links: [
      { href: '/contact', text: 'Contact Us' },
      { href: '/contact', text: 'Locations' },
    ],
  },
];

export const NAVBAR_MOBILE_QUICK_TOOLS = [
  {
    href: `${LEGACY_PORTAL_BASE}/apps/track-shipment/`,
    text: 'Track & Trace Tool',
  },
  {
    href: `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`,
    text: 'Sailing Schedule',
  },
  {
    href: `${LEGACY_PORTAL_BASE}/apps/documentation/`,
    text: 'Documentation Portal',
  },
];

export const NAVBAR_MOBILE_TOOL_MENUS = [
  {
    id: 'quotationtools',
    label: 'Quotation Tools',
    links: [
      {
        href: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
        text: 'Vanguard ADESSO',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/ui/#/imo`,
        text: 'IMO 2020 Rate Search',
      },
      { href: `${LEGACY_AVANTI_BASE}/`, text: 'FCL Rate Search' },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/dashboard/?login=Y&mod=1DA358DF153386C0A920220E2670594622ED6024`,
        text: 'vRate Calculator',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/shiprite-on-demand/`,
        text: 'Shiprite on Demand',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/dashboard/?login=Y&mod=FC714E7FC4F7AD193AABB32D588769C2FAE5D448`,
        text: 'Shiprite',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
        text: 'eFulfillment Connect',
      },
    ],
  },
  {
    id: 'shippingtools',
    label: 'Shipping Tools',
    links: [
      {
        href: `${LEGACY_PORTAL_BASE}/apps/ocean-booking/`,
        text: 'Ocean Booking',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/freight-release/`,
        text: 'Freight Release',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`,
        text: 'Sailing Schedule',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/verified-gross-mass/`,
        text: 'Solas VGM',
      },
    ],
  },
  {
    id: 'trackingtools',
    label: 'Tracking Tools',
    links: [
      {
        href: `${LEGACY_PORTAL_BASE}/apps/dashboard/?show-fa-list=Y`,
        text: 'Freight Availability',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/track-shipment/`,
        text: 'Track & Trace',
      },
      {
        href: `${LEGACY_MARKETING_BASE}/tracking-results?tracking=`,
        text: 'Quick Track',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/shipment-status/`,
        text: 'Statusmate',
      },
    ],
  },
  {
    id: 'documentationtools',
    label: 'Documentation Tools',
    links: [
      {
        href: `${LEGACY_PORTAL_BASE}/apps/documentation/`,
        text: 'Documentation Portal',
      },
      { href: `${LEGACY_PORTAL_BASE}/apps/create-sli/`, text: 'Create SLI' },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/print-labels/`,
        text: 'Print Shipping Labels',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/customer-advisory/`,
        text: 'Customer/Agent Advisory',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/extranet/`,
        text: 'Useful Information',
      },
      {
        href: `${LEGACY_PORTAL_BASE}/apps/cargo-release-order/`,
        text: 'Cargo Release Order',
      },
      { href: LEGACY_CARGO_INSURANCE_URL, text: 'Cargo Insurance' },
    ],
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: 'Quotation and Book Tools',
    links: [
      {
        to: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
        label: 'Vanguard ADESSO',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/ocean-booking/`,
        label: 'Ocean Booking',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`,
        label: 'Sailing Schedule',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/dashboard/?login=Y&mod=1DA358DF153386C0A920220E2670594622ED6024`,
        label: 'vRate Calculator',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/dashboard/?login=Y&mod=FC714E7FC4F7AD193AABB32D588769C2FAE5D448`,
        label: 'Shiprite',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/shiprite-on-demand/`,
        label: 'Shiprite on Demand',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/efulfillment-connect/`,
        label: 'eFulfillment Connect',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/measurement-calculator/`,
        label: 'Measurement Calculator',
        external: true,
      },
    ],
  },
  {
    heading: 'Manage Shipment Tools',
    links: [
      {
        to: `${LEGACY_PORTAL_BASE}/apps/freight-availability/`,
        label: 'Freight Availability',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/track-shipment/`,
        label: 'Track & Trace',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/`,
        label: 'IMO 2020 Calculator',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/freight-release/`,
        label: 'Freight Release',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/tracking-results?tracking=`,
        label: 'Quick Track',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/shipment-status/`,
        label: 'Statusmate',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/verified-gross-mass/`,
        label: 'Solas VGM',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/cargo-release-order/`,
        label: 'Cargo Release Order',
        external: true,
      },
    ],
  },
  {
    heading: 'Documentation Tools',
    links: [
      {
        to: `${LEGACY_PORTAL_BASE}/apps/create-sli/`,
        label: 'Create SLI',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/documentation/`,
        label: 'Documentation Portal',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/extranet/`,
        label: 'Useful Information',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/customer-advisory/`,
        label: 'Customer / Agent Advisory',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/print-labels/`,
        label: 'Print Shipping Labels',
        external: true,
      },
    ],
  },
  {
    heading: 'Legal and Documentation',
    links: [
      {
        to: `${LEGACY_MARKETING_BASE}/bill-of-lading-tc`,
        label: 'Bill of Lading Terms',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/fmc-tariff-links`,
        label: 'FMC Tariffs',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/terms-and-conditions`,
        label: 'Website Terms of Use',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/usa-brokerage-terms`,
        label: 'USA Brokerage Terms and Conditions',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/usa-terms-service`,
        label: 'USA Terms and Conditions of Service',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/au-terms-service`,
        label: 'AU Standard Trading Conditions',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/nz-terms-service`,
        label: 'NZ trade terms',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/au-nz-downloadable-resources`,
        label: 'AU/NZ Downloadable Resources',
        external: true,
      },
      {
        to: `${LEGACY_MARKETING_BASE}/whistleblower-hotline`,
        label: 'Whistleblower Hotline',
        external: true,
      },
    ],
  },
  {
    heading: 'Admin and Help',
    links: [
      {
        to: `${LEGACY_MARKETING_BASE}/contact-us`,
        label: 'Contact Us',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/signup/`,
        label: 'Request a Login',
        external: true,
      },
      {
        to: `${LEGACY_PORTAL_BASE}/apps/user/get-password.jsp`,
        label: 'Forgot Password',
        external: true,
      },
    ],
  },
];

export const FOOTER_BOTTOM_LINKS = [
  {
    to: `${LEGACY_MARKETING_BASE}/terms-and-conditions`,
    label: 'Terms of Use',
    external: true,
  },
  {
    to: `${LEGACY_MARKETING_BASE}/cookie-policy`,
    label: 'Cookies Policy',
    external: true,
  },
  {
    to: `${LEGACY_MARKETING_BASE}/privacy-policy`,
    label: 'Privacy Policy',
    external: true,
  },
  {
    to: `${LEGACY_MARKETING_BASE}/whistleblower-hotline`,
    label: 'Whistleblower Hotline',
    external: true,
  },
  {
    to: 'https://www.linkedin.com/company/vanguard-logistics-services',
    label: 'LinkedIn',
    external: true,
  },
];

export const HOME_TOP_TOOLS = [
  {
    title: 'LCL',
    description: 'Vanguard ADESSO LCL quoting and booking.',
    url: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
  },
  {
    title: 'FCL',
    description: 'Avanti full-container quoting tool.',
    url: `${LEGACY_AVANTI_BASE}/`,
  },
  {
    title: 'LTL',
    description: 'Shiprite LTL quoting workflow.',
    url: LEGACY_SHIPRITE_LTL_URL,
  },
];

export const HOME_MANAGE_SHIPMENT_LINKS = [
  {
    title: 'Track & Trace',
    description: 'Detailed shipment visibility dashboard.',
    url: `${LEGACY_PORTAL_BASE}/apps/track-shipment/`,
  },
  {
    title: 'Statusmate',
    description: 'Schedule shipment status reports.',
    url: `${LEGACY_PORTAL_BASE}/apps/shipment-status/`,
  },
];

export const HOME_LOCATION_QUICK_LINK = {
  title: 'See Our Locations',
  description: 'Browse all global offices and regional contacts.',
  url: `${LEGACY_MARKETING_BASE}/locations`,
};

export const HOME_TOOLBOX_TABS = [
  {
    id: 'quotation',
    label: 'Quotation Tools',
    Icon: Package,
    tools: [
      {
        name: 'Vanguard ADESSO',
        desc: 'Quote, book, and manage LCL online with door-to-door visibility.',
        url: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
      },
      {
        name: 'FCL Rate Search',
        desc: 'Full-container search and booking planning.',
        url: `${LEGACY_AVANTI_BASE}/`,
      },
      {
        name: 'IMO 2020 Rate Search',
        desc: 'Compare rate structures with fuel and compliance context.',
        url: `${LEGACY_PORTAL_BASE}/apps/ui/#/imo`,
      },
      {
        name: 'vRate Calculator',
        desc: 'LCL quoting and routing calculator.',
        url: `${LEGACY_PORTAL_BASE}/apps/dashboard/?login=Y&mod=1DA358DF153386C0A920220E2670594622ED6024`,
      },
      {
        name: 'Shiprite on Demand',
        desc: 'On-demand LTL rating and shipment setup.',
        url: `${LEGACY_PORTAL_BASE}/apps/shiprite-on-demand/`,
      },
      {
        name: 'Shiprite',
        desc: 'LTL quoting tool for contract and spot rates.',
        url: `${LEGACY_PORTAL_BASE}/apps/dashboard/?login=Y&mod=FC714E7FC4F7AD193AABB32D588769C2FAE5D448`,
      },
      {
        name: 'eFulfillment Connect',
        desc: 'LCL shipping to eCommerce distribution networks.',
        url: `${LEGACY_PORTAL_BASE}/apps/ui/#/adesso`,
      },
    ],
  },
  {
    id: 'shipping',
    label: 'Shipping Tools',
    Icon: Ship,
    tools: [
      {
        name: 'Ocean Booking',
        desc: 'Place bookings and monitor booking readiness.',
        url: `${LEGACY_PORTAL_BASE}/apps/ocean-booking/`,
      },
      {
        name: 'Sailing Schedule',
        desc: 'Interactive origin-to-destination schedule lookup.',
        url: `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`,
      },
      {
        name: 'Solas VGM',
        desc: 'Submit VGM details with audit-ready confirmations.',
        url: `${LEGACY_PORTAL_BASE}/apps/verified-gross-mass/`,
      },
      {
        name: 'Freight Release',
        desc: 'Approve invoices and release import freight.',
        url: `${LEGACY_PORTAL_BASE}/apps/freight-release/`,
      },
    ],
  },
  {
    id: 'tracking',
    label: 'Tracking Tools',
    Icon: Radar,
    tools: [
      {
        name: 'Freight Availability',
        desc: 'Visibility of import shipment release readiness.',
        url: `${LEGACY_PORTAL_BASE}/apps/dashboard/?show-fa-list=Y`,
      },
      {
        name: 'Track & Trace',
        desc: 'Deep shipment visibility across checkpoints and handoffs.',
        url: `${LEGACY_PORTAL_BASE}/apps/track-shipment/`,
      },
      {
        name: 'Quick Track',
        desc: 'Immediate status checks by booking reference.',
        url: `${LEGACY_MARKETING_BASE}/tracking-results?tracking=`,
      },
      {
        name: 'Statusmate',
        desc: 'Schedule recurring shipment status reports.',
        url: `${LEGACY_PORTAL_BASE}/apps/shipment-status/`,
      },
    ],
  },
  {
    id: 'documentation',
    label: 'Documentation Tools',
    Icon: ShieldAlert,
    tools: [
      {
        name: 'Documentation Portal',
        desc: 'Review, upload, and download shipment documents.',
        url: `${LEGACY_PORTAL_BASE}/apps/documentation/`,
      },
      {
        name: 'Create SLI',
        desc: 'Submit shipping instructions with structured fields.',
        url: `${LEGACY_PORTAL_BASE}/apps/create-sli/`,
      },
      {
        name: 'Cargo Release Order',
        desc: 'Manage import release documentation workflows.',
        url: `${LEGACY_PORTAL_BASE}/apps/cargo-release-order/`,
      },
      {
        name: 'Print Shipping Labels',
        desc: 'Generate shipping labels for operational handoff.',
        url: `${LEGACY_PORTAL_BASE}/apps/print-labels/`,
      },
      {
        name: 'Customer/Agent Advisory',
        desc: 'Review customer and agent advisory updates.',
        url: `${LEGACY_PORTAL_BASE}/apps/customer-advisory/`,
      },
      {
        name: 'Useful Information',
        desc: 'Extranet resources, forms, and references.',
        url: `${LEGACY_PORTAL_BASE}/apps/extranet/`,
      },
      {
        name: 'Cargo Insurance',
        desc: 'Arrange cargo insurance through partner platform.',
        url: LEGACY_CARGO_INSURANCE_URL,
      },
    ],
  },
];

export const HOME_PROMO_IFRAME_URL = `${LEGACY_MARKETING_BASE}/email-signup`;
export const HOME_SAILING_SCHEDULE_BASE_URL = `${LEGACY_PORTAL_BASE}/apps/sailing-schedule/`;
export const HOME_QUICK_TRACK_BASE_URL = `${LEGACY_MARKETING_BASE}/tracking-results?tracking=`;
export const HOME_LOCATION_LOOKUP_BASE_URL = `${LEGACY_MARKETING_BASE}/contact/locations?region=`;
