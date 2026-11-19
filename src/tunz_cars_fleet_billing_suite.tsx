import React, { useState, useEffect, useMemo } from 'react';
import {
  Car, Calendar, FileText, CreditCard, Fuel, Wrench, ShieldCheck,
  Plus, Edit2, Trash2, CheckCircle, Clock, AlertTriangle, Printer,
  Download, Search, Lock, Unlock, Phone, Mail, MapPin, DollarSign,
  TrendingUp, Users, ArrowRight, X, Check, Building2, Eye, Send,
  Sparkles, Package, Laptop, ShoppingBag, Layers, Briefcase, Upload, Image as ImageIcon, Copy, Navigation, ExternalLink, Settings, Sliders
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore, collection, doc, setDoc, deleteDoc,
  onSnapshot, query
} from 'firebase/firestore';

// Pre-configured with live Tunz-Cars-PNG Firebase credentials
const YOUR_FIREBASE_CONFIG_HERE = {
  apiKey: "AIzaSyC0wEzGuwJ7D7Kg6pI8kYuZ4S6zBkX_gdo",
  authDomain: "tunz-cars-png.firebaseapp.com",
  projectId: "tunz-cars-png",
  storageBucket: "tunz-cars-png.firebasestorage.app",
  messagingSenderId: "733661606615",
  appId: "1:733661606615:web:6d8fc8d47d477f565557692"
};

// Default Fallback Logos (also editable live in Admin Settings!)
const DEFAULT_TA_LOGO = '/ta-logo.png';
const DEFAULT_TC_LOGO = '/tc-logo.jpg';

// Papua New Guinea 4 Regions & Current Towns
const PNG_REGIONS_AND_TOWNS = {
  'New Guinea Islands (NGI)': [
    'Kavieng',
    'Kokopo',
    'Rabaul',
    'Kimbe',
    'Lorengau',
    'Buka',
    'Arawa',
    'Namatanai'
  ],
  'Southern': [
    'Port Moresby',
    'Alotau',
    'Popondetta',
    'Kerema',
    'Daru',
    'Kiunga'
  ],
  'Momase': [
    'Lae',
    'Madang',
    'Wewak',
    'Vanimo',
    'Aitape',
    'Bulolo',
    'Wau',
    'Finschhafen'
  ],
  'Highlands': [
    'Mount Hagen',
    'Goroka',
    'Mendi',
    'Wabag',
    'Kundiawa',
    'Tari',
    'Minj',
    'Banz',
    'Kainantu'
  ]
};

const DEFAULT_SETTINGS = {
  companyName: 'Tunz Accessories',
  tagline: 'Papua New Guinea Commercial Enterprise',
  heroDescription: 'Select a division below to access vehicle hire, chauffeur & parcel delivery services, organic coconut oil products, IT & custom merchandise, or our online payment portal.',
  phoneDisplay: '+675 7962 5068',
  whatsappNumber: '67579625068', // Digits only for wa.me links
  email: 'tuneabel@gmail.com',
  ipaNumber: '6-136546287',
  tinNumber: '501982530',
  bankName: 'Bank South Pacific (BSP) — Kavieng',
  accountName: 'Barrie Tunz Jr Abel',
  accountNumber: '1001252316',
  adminPin: '2026',
  taLogoUrl: DEFAULT_TA_LOGO,
  tcLogoUrl: DEFAULT_TC_LOGO
};

const INITIAL_FLEET = [
  {
    id: 'TC-VEH-01',
    name: '2013 Subaru XV AWD',
    plate: 'KVG-412',
    category: 'SUV / AWD',
    seats: '5 Seats • Auto • AWD',
    region: 'New Guinea Islands (NGI)',
    town: 'Kavieng',
    dailyRate: 250,
    status: 'Available',
    odometer: 149250,
    nextServiceKm: 152000,
    regoExpiry: '2027-04-30',
    mvilExpiry: '2027-04-30',
    highlights: 'All-Wheel Drive, High Ground Clearance, Cold A/C — Ideal for Kavieng & Boluminski Highway'
  },
  {
    id: 'TC-VEH-02',
    name: '2012 Nissan Bluebird Sylphy',
    plate: 'KVG-789',
    category: 'Executive Sedan',
    seats: '5 Seats • Auto • 2WD',
    region: 'New Guinea Islands (NGI)',
    town: 'Kavieng',
    dailyRate: 220,
    status: 'Available',
    odometer: 118500,
    nextServiceKm: 120000,
    regoExpiry: '2027-03-15',
    mvilExpiry: '2027-03-15',
    highlights: 'Fuel-Efficient Executive Sedan, Smooth Ride — Ideal for Kavieng Town & Airport Transfers'
  },
  {
    id: 'TC-VEH-03',
    name: '1996 Isuzu Bighorn Station Wagon',
    plate: 'KVG-195',
    category: '4WD Station Wagon',
    seats: '7 Seats • Auto • 4WD',
    region: 'New Guinea Islands (NGI)',
    town: 'Kavieng',
    dailyRate: 250,
    status: 'Available',
    odometer: 214000,
    nextServiceKm: 218000,
    regoExpiry: '2027-02-28',
    mvilExpiry: '2027-02-28',
    highlights: 'Heavy-Duty 4x4, 7-Seater Capacity — Built for Rural Outreach & Rough Provincial Roads'
  }
];

const INITIAL_CAR_SERVICES = [
  {
    id: 'TC-SRV-01',
    title: 'Vehicle Hire (Self-Drive)',
    pricingMode: 'per_day', // 'per_day' | 'flat_trip'
    rate: 0, // Added on top of vehicle daily rate
    badge: 'Daily Rate',
    description: 'Daily self-drive rental across town & highway (Vehicle daily rate applies)',
    requiresLicense: true,
    active: true
  },
  {
    id: 'TC-SRV-02',
    title: 'Chauffeur Service',
    pricingMode: 'per_day',
    rate: 50, // +K50/day on top of vehicle daily rate
    badge: 'Driver Included',
    description: 'Dedicated professional PNG driver (+K50/day chauffeur allowance)',
    requiresLicense: false,
    active: true
  },
  {
    id: 'TC-SRV-03',
    title: 'Parcel Pick up & Delivery',
    pricingMode: 'flat_trip',
    rate: 65, // Flat trip rate
    badge: 'Point-to-Point',
    description: 'Same-day courier & cargo drop-off across town & nearby centres',
    requiresLicense: false,
    active: true
  }
];

const INITIAL_CATALOG = [
  {
    id: 'TA-ORG-01',
    division: 'Tunz Organics',
    itemType: 'Product',
    name: 'Cold-Process Virgin Coconut Oil Soap (110g)',
    unit: 'Per Bar / 24-Bar Eco-Resort Box',
    unitPrice: 15,
    stock: 180,
    status: 'In Stock',
    description: 'Handcrafted cold-process organic coconut oil soap formulated for eco-resorts, lodges, and retail.'
  },
  {
    id: 'TA-ORG-02',
    division: 'Tunz Organics',
    itemType: 'Product',
    name: 'Eco-Resort Hospitality Amenity Pack (50 Bars)',
    unit: 'Wholesale Carton',
    unitPrice: 650,
    stock: 25,
    status: 'In Stock',
    description: 'Custom-stamped organic coconut oil guest bars tailored for boutique resorts in New Ireland & PNG.'
  },
  {
    id: 'TA-TECH-01',
    division: 'Tech & Merch',
    itemType: 'Product',
    name: 'Enterprise Refurbished Laptop Package (Dell Latitude / HP)',
    unit: 'Per Unit (Configured)',
    unitPrice: 2450,
    stock: 8,
    status: 'In Stock',
    description: 'Business-grade Core i5/i7 laptops pre-configured with Office & institutional software for schools & offices.'
  },
  {
    id: 'TA-TECH-02',
    division: 'Tech & Merch',
    itemType: 'Product',
    name: 'Custom Branded Corporate Polo & Event Apparel',
    unit: 'Minimum 20 Units (Per Shirt)',
    unitPrice: 65,
    stock: 250,
    status: 'Made to Order',
    description: 'Custom embroidered and sublimated uniforms, event shirts, and promotional merchandise across PNG.'
  },
  {
    id: 'TA-TECH-03',
    division: 'Tech & Merch',
    itemType: 'Service',
    name: 'Custom Graphic Design, Branding & IT Setup Service',
    unit: 'Per Project / Package',
    unitPrice: 350,
    stock: 99,
    status: 'Available',
    description: 'Logo creation, institutional banner/poster design, Canvas/LMS setup, and laptop diagnostics.'
  }
];

const INITIAL_DOCS = [
  {
    id: 'TA-QT-2026-001',
    division: 'Tunz Cars',
    type: 'Quotation',
    status: 'Sent',
    date: '2026-11-19',
    clientName: 'Kavieng General Hospital',
    clientContact: '+675 984 2040',
    itemSummary: '2013 Subaru XV AWD (KVG-412)',
    startDate: '2026-11-23',
    endDate: '2026-11-27',
    qty: 5,
    unitLabel: 'Days',
    unitRate: 250,
    totalAmount: 1250,
    paidAmount: 0,
    notes: 'Official clinical outreach & hospital logistics transport (10% GST Inclusive)'
  }
];

const formatPGK = (val) => `K ${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const numberToWordsPGK = (amount) => {
  const num = Math.floor(Number(amount || 0));
  const toea = Math.round((Number(amount || 0) - num) * 100);
  if (num === 0) return `Zero Kina and ${toea} Toea Only`;
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const convertLessThanThousand = (n) => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
  };
  let words = '';
  if (num >= 1000) words += convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand ';
  words += convertLessThanThousand(num % 1000);
  return `${words.trim()} Kina${toea > 0 ? ` and ${toea} Toea` : ''} Only`;
};

const compressImageFile = (file, maxW = 900) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png', 0.85));
    };
    img.onerror = reject;
    img.src = ev.target.result;
  };
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

function TunzAccessoriesSuite() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('public');
  const [publicTab, setPublicTab] = useState('cars');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [settingsSavedBanner, setSettingsSavedBanner] = useState(false);

  // Live Cloud-Synced State (Fully Editable Inside Admin!)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [vehicles, setVehicles] = useState(INITIAL_FLEET);
  const [carServices, setCarServices] = useState(INITIAL_CAR_SERVICES);
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [inquiries, setInquiries] = useState([]);
  const [documents, setDocuments] = useState(INITIAL_DOCS);
  const [payments, setPayments] = useState([]);
  const [paymentSubmissions, setPaymentSubmissions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Admin Navigation & Modals
  const [adminTab, setAdminTab] = useState('overview');
  const [vehModal, setVehModal] = useState({ open: false, data: null });
  const [srvModal, setSrvModal] = useState({ open: false, data: null });
  const [catModal, setCatModal] = useState({ open: false, data: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [docModal, setDocModal] = useState({ open: false, data: null });
  const [previewDoc, setPreviewDoc] = useState(null);
  const [payModal, setPayModal] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const [proofViewer, setProofViewer] = useState(null);

  // Public Car Booking Filters & Form
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterTown, setFilterTown] = useState('All');
  const [gpsStatus, setGpsStatus] = useState('');

  const [carForm, setCarForm] = useState({
    vehicleId: 'TC-VEH-01',
    serviceId: 'TC-SRV-01',
    clientName: '',
    organization: '',
    phone: '',
    licenseNo: '',
    startDate: '2026-11-21',
    endDate: '2026-11-23',
    pickupAddress: 'Kavieng Airport (KVG), New Ireland Province',
    dropoffAddress: 'Kavieng Town Center',
    googleMapsLink: '',
    serviceNotes: ''
  });

  const [orderForm, setOrderForm] = useState({
    itemId: 'TA-ORG-01',
    quantity: 10,
    clientName: '',
    organization: '',
    phone: '',
    deliveryLocation: 'Port Moresby / Kavieng',
    notes: ''
  });

  const [clientPayForm, setClientPayForm] = useState({
    division: 'Tunz Cars',
    bookingOrDocRef: '',
    payerName: '',
    phone: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().slice(0, 10),
    method: 'BSP Mobile / Internet Banking',
    bankReference: '',
    receiptImage: '',
    receiptFileName: ''
  });
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch((err) => console.error('Auth error:', err));
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const base = ['artifacts', APP_ID, 'public', 'data'];

    const u0 = onSnapshot(doc(db, ...base, 'config', 'site_settings'), (snap) => {
      if (snap.exists()) {
        setSettings(prev => ({ ...prev, ...snap.data() }));
      }
    }, () => {});
    const u1 = onSnapshot(query(collection(db, ...base, 'vehicles')), (s) => {
      if (!s.empty) setVehicles(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u1b = onSnapshot(query(collection(db, ...base, 'car_services')), (s) => {
      if (!s.empty) setCarServices(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u2 = onSnapshot(query(collection(db, ...base, 'catalog')), (s) => {
      if (!s.empty) setCatalog(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u3 = onSnapshot(query(collection(db, ...base, 'inquiries')), (s) => {
      setInquiries(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u4 = onSnapshot(query(collection(db, ...base, 'documents')), (s) => {
      if (!s.empty) setDocuments(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u5 = onSnapshot(query(collection(db, ...base, 'payments')), (s) => {
      setPayments(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u6 = onSnapshot(query(collection(db, ...base, 'expenses')), (s) => {
      setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});
    const u7 = onSnapshot(query(collection(db, ...base, 'payment_submissions')), (s) => {
      setPaymentSubmissions(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {});

    return () => { u0(); u1(); u1b(); u2(); u3(); u4(); u5(); u6(); u7(); };
  }, [user]);

  const saveCloud = async (col, id, payload) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', col, id), payload, { merge: true });
    } catch (e) { console.error(e); }
  };

  const deleteCloud = async (col, id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', col, id));
    } catch (e) { console.error(e); }
  };

  const calcDays = (s, e) => {
    if (!s || !e) return 1;
    const diff = Math.ceil((new Date(e) - new Date(s)) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  // Active Car Services & Selected Service
  const activeCarServices = useMemo(() => carServices.filter(s => s.active !== false), [carServices]);
  const selectedCarService = useMemo(
    () => activeCarServices.find(s => s.id === carForm.serviceId) || activeCarServices[0] || INITIAL_CAR_SERVICES[0],
    [activeCarServices, carForm.serviceId]
  );

  // Filtered Public Fleet by PNG Region & Town
  const publicVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (v.status === 'Inactive') return false;
      const vRegion = v.region || 'New Guinea Islands (NGI)';
      const vTown = v.town || 'Kavieng';
      if (filterRegion !== 'All' && vRegion !== filterRegion) return false;
      if (filterTown !== 'All' && vTown !== filterTown) return false;
      return true;
    });
  }, [vehicles, filterRegion, filterTown]);

  const selectedVehicle = useMemo(
    () => publicVehicles.find(v => v.id === carForm.vehicleId) || publicVehicles[0],
    [publicVehicles, carForm.vehicleId]
  );

  useEffect(() => {
    if (selectedVehicle?.town) {
      setCarForm(prev => ({
        ...prev,
        pickupAddress: `${selectedVehicle.town} Airport / Town Center, ${selectedVehicle.region || 'PNG'}`
      }));
    }
  }, [selectedVehicle?.id]);

  const isFlatTripService = selectedCarService?.pricingMode === 'flat_trip';
  const rentalDays = isFlatTripService ? 1 : calcDays(carForm.startDate, carForm.endDate);
  const serviceExtraCost = isFlatTripService
    ? Number(selectedCarService?.rate || 65)
    : Number(selectedCarService?.rate || 0) * rentalDays;
  const baseCarCost = isFlatTripService ? 0 : (selectedVehicle?.dailyRate || 250) * rentalDays;
  const rentalTotal = baseCarCost + serviceExtraCost;

  // Google Maps Embed & Direct Pin URL
  const mapQueryLocation = useMemo(() => {
    const q = carForm.pickupAddress?.trim() || `${selectedVehicle?.town || 'Kavieng'}, Papua New Guinea`;
    return encodeURIComponent(q.includes('Papua New Guinea') ? q : `${q}, Papua New Guinea`);
  }, [carForm.pickupAddress, selectedVehicle]);

  const googleMapsDirectionsUrl = useMemo(() => {
    const orig = encodeURIComponent(carForm.pickupAddress || `${selectedVehicle?.town || 'Kavieng'}, PNG`);
    const dest = encodeURIComponent(carForm.dropoffAddress || '');
    return dest
      ? `https://www.google.com/maps/dir/?api=1&origin=${orig}&destination=${dest}`
      : `https://www.google.com/maps/search/?api=1&query=${orig}`;
  }, [carForm.pickupAddress, carForm.dropoffAddress, selectedVehicle]);

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS not supported on this browser.');
      return;
    }
    setGpsStatus('Locating GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const pinUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        setCarForm(prev => ({
          ...prev,
          pickupAddress: `${lat}, ${lng} (${selectedVehicle?.town || 'PNG'})`,
          googleMapsLink: pinUrl
        }));
        setGpsStatus('Live GPS pin captured ✓');
      },
      () => setGpsStatus('Location permission denied. Type address or paste Google Maps link.')
    );
  };

  const filteredCatalog = useMemo(
    () => catalog.filter(c => publicTab === 'organics' ? c.division === 'Tunz Organics' : c.division === 'Tech & Merch'),
    [catalog, publicTab]
  );
  const selectedProduct = useMemo(
    () => filteredCatalog.find(c => c.id === orderForm.itemId) || filteredCatalog[0],
    [filteredCatalog, orderForm.itemId]
  );
  const orderTotal = (selectedProduct?.unitPrice || 0) * Number(orderForm.quantity || 1);

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    const id = `TC-BK-2026-${String(inquiries.length + 101).padStart(3, '0')}`;
    const mapNote = carForm.googleMapsLink ? ` • Map Pin: ${carForm.googleMapsLink}` : '';
    const extraInfo = `${selectedCarService.title} • Pickup: ${carForm.pickupAddress} → Dropoff: ${carForm.dropoffAddress}${
      carForm.serviceNotes ? ` • Note: ${carForm.serviceNotes}` : ''
    }${carForm.licenseNo ? ` • Lic: ${carForm.licenseNo}` : ''}${mapNote}`;

    const record = {
      id,
      division: 'Tunz Cars',
      serviceType: selectedCarService.title,
      clientName: carForm.clientName,
      organization: carForm.organization,
      phone: carForm.phone,
      itemSummary: `${selectedCarService.title}: ${selectedVehicle.name} (${selectedVehicle.plate} • ${selectedVehicle.town || 'Kavieng'})`,
      startDate: carForm.startDate,
      endDate: isFlatTripService ? carForm.startDate : carForm.endDate,
      qty: rentalDays,
      unitRate: isFlatTripService
        ? Number(selectedCarService.rate || 65)
        : Number(selectedVehicle.dailyRate || 250) + Number(selectedCarService.rate || 0),
      totalAmount: rentalTotal,
      pickupAddress: carForm.pickupAddress,
      dropoffAddress: carForm.dropoffAddress,
      googleMapsLink: carForm.googleMapsLink || googleMapsDirectionsUrl,
      details: extraInfo,
      status: 'Pending Approval',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setInquiries(prev => [record, ...prev]);
    await saveCloud('inquiries', id, record);
    setSubmitSuccess(record);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const prefix = selectedProduct.division === 'Tunz Organics' ? 'TO-ORD' : 'TA-REQ';
    const id = `${prefix}-2026-${String(inquiries.length + 101).padStart(3, '0')}`;
    const record = {
      id,
      division: selectedProduct.division,
      clientName: orderForm.clientName,
      organization: orderForm.organization,
      phone: orderForm.phone,
      itemSummary: `${selectedProduct.name}${selectedProduct.itemType ? ` [${selectedProduct.itemType}]` : ''}`,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      qty: Number(orderForm.quantity || 1),
      unitRate: selectedProduct.unitPrice,
      totalAmount: orderTotal,
      details: `Delivery: ${orderForm.deliveryLocation}${orderForm.notes ? ` • ${orderForm.notes}` : ''}`,
      status: 'Pending Approval',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setInquiries(prev => [record, ...prev]);
    await saveCloud('inquiries', id, record);
    setSubmitSuccess(record);
  };

  const handleProofFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const compressed = await compressImageFile(file, 900);
      setClientPayForm(prev => ({
        ...prev,
        receiptImage: compressed,
        receiptFileName: file.name
      }));
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleClientPaymentSubmit = async (e) => {
    e.preventDefault();
    const id = `TA-PROOF-${String(paymentSubmissions.length + 101).padStart(3, '0')}`;
    const amt = Number(clientPayForm.amountPaid || 0);
    const record = {
      id,
      division: clientPayForm.division,
      bookingOrDocRef: clientPayForm.bookingOrDocRef.trim().toUpperCase(),
      payerName: clientPayForm.payerName,
      phone: clientPayForm.phone,
      amountPaid: amt,
      paymentDate: clientPayForm.paymentDate,
      method: clientPayForm.method,
      bankReference: clientPayForm.bankReference,
      receiptImage: clientPayForm.receiptImage,
      receiptFileName: clientPayForm.receiptFileName,
      status: 'Pending Verification',
      submittedAt: new Date().toISOString().slice(0, 10)
    };
    setPaymentSubmissions(prev => [record, ...prev]);
    await saveCloud('payment_submissions', id, record);
    setSubmitSuccess({
      id,
      isPaymentProof: true,
      division: record.division,
      itemSummary: `Payment Proof (${record.method}) — Ref: ${record.bankReference}`,
      qty: 1,
      unitRate: amt,
      totalAmount: amt,
      details: `Linked Ref: ${record.bookingOrDocRef || 'General Payment'} • Payer: ${record.payerName}`
    });
  };

  const verifyPaymentSubmission = async (sub) => {
    const updatedSub = { ...sub, status: 'Verified & Receipted' };
    setPaymentSubmissions(prev => prev.map(s => s.id === sub.id ? updatedSub : s));
    await saveCloud('payment_submissions', sub.id, updatedSub);

    const matchedDoc = documents.find(
      d => d.id.toUpperCase() === (sub.bookingOrDocRef || '').toUpperCase()
    );

    const payId = `TA-PAY-${String(payments.length + 1).padStart(3, '0')}`;
    const payRec = {
      id: payId,
      docId: matchedDoc ? matchedDoc.id : (sub.bookingOrDocRef || sub.id),
      date: sub.paymentDate,
      amount: Number(sub.amountPaid || 0),
      method: sub.method,
      reference: `${sub.bankReference} (Verified from ${sub.payerName})`,
      receiptImage: sub.receiptImage || ''
    };
    setPayments(prev => [payRec, ...prev]);
    await saveCloud('payments', payId, payRec);

    if (matchedDoc) {
      const newPaid = Number(matchedDoc.paidAmount || 0) + Number(sub.amountPaid || 0);
      const full = newPaid >= matchedDoc.totalAmount;
      const updatedDoc = {
        ...matchedDoc,
        paidAmount: newPaid,
        type: full ? 'Official Receipt' : matchedDoc.type,
        status: full ? 'Paid in Full' : 'Part Paid'
      };
      setDocuments(prev => prev.map(d => d.id === matchedDoc.id ? updatedDoc : d));
      await saveCloud('documents', matchedDoc.id, updatedDoc);
    }
    setAdminTab('payments');
  };

  const handlePinUnlock = (e) => {
    e.preventDefault();
    if (pinInput === (settings.adminPin || '2026')) {
      setMode('admin');
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid PIN. Check Owner PIN.');
    }
  };

  const approveInquiry = async (inq) => {
    const updated = { ...inq, status: 'Approved & Invoiced' };
    setInquiries(prev => prev.map(x => x.id === inq.id ? updated : x));
    await saveCloud('inquiries', inq.id, updated);

    const piId = `TA-PI-2026-${String(documents.length + 1).padStart(3, '0')}`;
    const newDoc = {
      id: piId,
      division: inq.division,
      type: 'Proforma Invoice',
      status: 'Unpaid',
      date: new Date().toISOString().slice(0, 10),
      clientName: inq.organization ? `${inq.organization} (${inq.clientName})` : inq.clientName,
      clientContact: inq.phone,
      itemSummary: inq.itemSummary,
      startDate: inq.startDate,
      endDate: inq.endDate,
      qty: inq.qty,
      unitLabel: inq.division === 'Tunz Cars' ? (inq.qty === 1 ? 'Trip/Day' : 'Days') : 'Units',
      unitRate: inq.unitRate,
      totalAmount: inq.totalAmount,
      paidAmount: 0,
      notes: `${inq.details} • Ref: ${inq.id}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    await saveCloud('documents', piId, newDoc);
    setAdminTab('billing');
  };

  const declineInquiry = async (inq) => {
    const updated = { ...inq, status: 'Declined / Cancelled' };
    setInquiries(prev => prev.map(x => x.id === inq.id ? updated : x));
    await saveCloud('inquiries', inq.id, updated);
  };

  const declinePaymentSubmission = async (sub) => {
    const updated = { ...sub, status: 'Declined' };
    setPaymentSubmissions(prev => prev.map(s => s.id === sub.id ? updated : s));
    await saveCloud('payment_submissions', sub.id, updated);
  };

  // Save Site & WhatsApp Settings Live
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const cleanedWa = String(settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const updated = { ...settings, whatsappNumber: cleanedWa || '67579625068' };
    setSettings(updated);
    await saveCloud('config', 'site_settings', updated);
    setSettingsSavedBanner(true);
    setTimeout(() => setSettingsSavedBanner(false), 3000);
  };

  const saveVehicle = async (v) => {
    const isNew = !v.id;
    const id = v.id || `TC-VEH-${String(vehicles.length + 1).padStart(2, '0')}`;
    const rec = {
      ...v,
      id,
      region: v.region || 'New Guinea Islands (NGI)',
      town: v.town || 'Kavieng',
      dailyRate: Number(v.dailyRate || 250),
      odometer: Number(v.odometer || 0),
      nextServiceKm: Number(v.nextServiceKm || 5000)
    };
    setVehicles(prev => isNew ? [...prev, rec] : prev.map(x => x.id === id ? rec : x));
    await saveCloud('vehicles', id, rec);
    setVehModal({ open: false, data: null });
  };

  const saveCarService = async (srv) => {
    const isNew = !srv.id;
    const id = srv.id || `TC-SRV-${String(carServices.length + 1).padStart(2, '0')}`;
    const rec = { ...srv, id, rate: Number(srv.rate || 0), active: srv.active !== false };
    setCarServices(prev => isNew ? [...prev, rec] : prev.map(x => x.id === id ? rec : x));
    await saveCloud('car_services', id, rec);
    setSrvModal({ open: false, data: null });
  };

  const saveCatalogItem = async (item) => {
    const isNew = !item.id;
    const id = item.id || `TA-SKU-${String(catalog.length + 1).padStart(2, '0')}`;
    const rec = {
      ...item,
      id,
      itemType: item.itemType || 'Product',
      unitPrice: Number(item.unitPrice || 0),
      stock: Number(item.stock || 0)
    };
    setCatalog(prev => isNew ? [...prev, rec] : prev.map(x => x.id === id ? rec : x));
    await saveCloud('catalog', id, rec);
    setCatModal({ open: false, data: null });
  };

  const saveDocument = async (d) => {
    const isNew = !d.id;
    const prefix = d.type === 'Quotation' ? 'TA-QT' : d.type === 'Proforma Invoice' ? 'TA-PI' : 'TA-RCT';
    const id = d.id || `${prefix}-2026-${String(documents.length + 1).padStart(3, '0')}`;
    const qty = d.division === 'Tunz Cars' ? calcDays(d.startDate, d.endDate) : Number(d.qty || 1);
    const totalAmount = qty * Number(d.unitRate || 0);
    const rec = {
      ...d,
      id,
      qty,
      unitRate: Number(d.unitRate || 0),
      totalAmount,
      paidAmount: d.type === 'Official Receipt' ? totalAmount : Number(d.paidAmount || 0)
    };
    setDocuments(prev => isNew ? [rec, ...prev] : prev.map(x => x.id === id ? rec : x));
    await saveCloud('documents', id, rec);
    setDocModal({ open: false, data: null });
  };

  const logPayment = async (p) => {
    const id = `TA-PAY-${String(payments.length + 1).padStart(3, '0')}`;
    const amt = Number(p.amount || 0);
    const rec = { id, ...p, amount: amt };
    setPayments(prev => [rec, ...prev]);
    await saveCloud('payments', id, rec);

    if (p.docId) {
      const target = documents.find(x => x.id === p.docId);
      if (target) {
        const newPaid = Number(target.paidAmount || 0) + amt;
        const full = newPaid >= target.totalAmount;
        const updated = {
          ...target,
          paidAmount: newPaid,
          type: full ? 'Official Receipt' : target.type,
          status: full ? 'Paid in Full' : 'Part Paid'
        };
        setDocuments(prev => prev.map(x => x.id === target.id ? updated : x));
        await saveCloud('documents', target.id, updated);
      }
    }
    setPayModal(false);
  };

  const logExpense = async (ex) => {
    const id = `TA-EXP-${String(expenses.length + 1).padStart(3, '0')}`;
    const rec = { id, ...ex, amount: Number(ex.amount || 0) };
    setExpenses(prev => [rec, ...prev]);
    await saveCloud('expenses', id, rec);
    setExpModal(false);
  };

  const metrics = useMemo(() => {
    const collected = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
    const billed = documents.filter(d => d.type !== 'Quotation').reduce((s, d) => s + Number(d.totalAmount || 0), 0);
    const gst = collected - collected / 1.1;
    const exp = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    return { collected, receivables: Math.max(0, billed - collected), gst, exp, net: collected - exp };
  }, [payments, documents, expenses]);

  const exportCSV = (filename, rows) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).filter(k => k !== 'receiptImage');
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const pendingProofsCount = paymentSubmissions.filter(s => s.status === 'Pending Verification').length;
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'Pending Approval').length;
  const waNumber = String(settings.whatsappNumber || '67579625068').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* GROUP HEADER */}
      <header className="bg-[#162238] text-white border-b-4 border-[#9A7B3E] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="bg-white rounded-xl p-1.5 shadow-md flex items-center justify-center shrink-0">
              <img
                src={settings.taLogoUrl || DEFAULT_TA_LOGO}
                alt="Tunz Accessories Logo"
                className="h-11 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-wide uppercase">{settings.companyName || 'TUNZ ACCESSORIES'}</h1>
                <span className="text-[10px] uppercase tracking-widest bg-[#9A7B3E]/20 text-[#E5C98B] border border-[#9A7B3E]/40 px-2 py-0.5 rounded">
                  Group Holding • PNG
                </span>
              </div>
              <p className="text-xs text-slate-300">
                IPA Reg #: {settings.ipaNumber} • IRC TIN: {settings.tinNumber} • WhatsApp: {settings.phoneDisplay}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setMode('public'); setSubmitSuccess(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                mode === 'public' ? 'bg-[#9A7B3E] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Client Storefront & Payments
            </button>
            {mode === 'admin' ? (
              <button
                onClick={() => setMode('public')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#9E2A2B] text-white flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" /> Lock Admin
              </button>
            ) : (
              <button
                onClick={() => setShowPinModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 border border-slate-600"
              >
                <Lock className="w-3.5 h-3.5 text-[#E5C98B]" /> Owner Admin
              </button>
            )}
          </div>
        </div>
      </header>

      {/* PUBLIC CLIENT PORTAL */}
      {mode === 'public' && (
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* LANDING HERO WITH ONLY TUNZ ACCESSORIES AS MAIN TITLE */}
          <div className="bg-gradient-to-r from-[#162238] via-[#1f304f] to-[#162238] text-white rounded-2xl p-6 md:p-8 mb-6 shadow-lg border border-[#9A7B3E]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#E5C98B] mb-1.5">
                {settings.tagline}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {settings.companyName}
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                {settings.heroDescription}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/40 px-2.5 py-1 rounded-lg hover:bg-emerald-600/30 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp: {settings.phoneDisplay}
                </a>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#E5C98B]" /> {settings.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#E5C98B]" /> NGI • Southern • Momase • Highlands</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-[#9A7B3E] shrink-0">
              <img
                src={settings.taLogoUrl || DEFAULT_TA_LOGO}
                alt="Tunz Accessories Official Brand"
                className="h-24 md:h-28 w-auto object-contain"
              />
            </div>
          </div>

          {/* 4-Card Division Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <button
              onClick={() => { setPublicTab('cars'); setSubmitSuccess(null); }}
              className={`p-3.5 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                publicTab === 'cars' ? 'bg-white border-[#9A7B3E] shadow-md' : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <img
                src={settings.tcLogoUrl || DEFAULT_TC_LOGO}
                alt="Tunz Cars Logo"
                className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-100 p-0.5 shrink-0"
              />
              <div>
                <div className="text-[10px] font-bold uppercase text-[#9A7B3E]">Subsidiary 01</div>
                <div className="font-extrabold text-sm text-slate-900">Tunz Cars</div>
                <div className="text-[11px] text-slate-500">Hire, Chauffeur & Parcels</div>
              </div>
            </button>

            <button
              onClick={() => {
                setPublicTab('organics');
                setSubmitSuccess(null);
                const firstOrg = catalog.find(c => c.division === 'Tunz Organics');
                if (firstOrg) setOrderForm(f => ({ ...f, itemId: firstOrg.id, quantity: 10 }));
              }}
              className={`p-3.5 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                publicTab === 'organics' ? 'bg-white border-[#9A7B3E] shadow-md' : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-800 text-emerald-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-emerald-700">Subsidiary 02</div>
                <div className="font-extrabold text-sm text-slate-900">Tunz Organics</div>
                <div className="text-[11px] text-slate-500">Coconut Oil Products</div>
              </div>
            </button>

            <button
              onClick={() => {
                setPublicTab('tech');
                setSubmitSuccess(null);
                const firstTech = catalog.find(c => c.division === 'Tech & Merch');
                if (firstTech) setOrderForm(f => ({ ...f, itemId: firstTech.id, quantity: 1 }));
              }}
              className={`p-3.5 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                publicTab === 'tech' ? 'bg-white border-[#9A7B3E] shadow-md' : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-[#9E2A2B] text-white flex items-center justify-center shrink-0">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-[#9E2A2B]">Division 03</div>
                <div className="font-extrabold text-sm text-slate-900">Tech & Merch</div>
                <div className="text-[11px] text-slate-500">Products & Services</div>
              </div>
            </button>

            <button
              onClick={() => { setPublicTab('pay'); setSubmitSuccess(null); }}
              className={`p-3.5 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                publicTab === 'pay' ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20' : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-emerald-700">Customer Billing</div>
                <div className="font-extrabold text-sm text-slate-900">Payment Portal</div>
                <div className="text-[11px] text-slate-500">Pay & Upload Receipt</div>
              </div>
            </button>
          </div>

          {submitSuccess ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-8 max-w-2xl mx-auto text-center shadow-lg">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A7B3E]">{submitSuccess.division}</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {submitSuccess.isPaymentProof ? 'Payment Proof Uploaded!' : 'Request Submitted Successfully!'}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Tracking Reference: <span className="font-mono font-bold text-[#162238]">{submitSuccess.id}</span>
              </p>
              <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-1.5 mb-6 border border-slate-200">
                <p><strong>Summary:</strong> {submitSuccess.itemSummary}</p>
                {!submitSuccess.isPaymentProof && (
                  <p><strong>Quantity / Duration:</strong> {submitSuccess.qty} × {formatPGK(submitSuccess.unitRate)}</p>
                )}
                <p><strong>Details:</strong> {submitSuccess.details}</p>
                {submitSuccess.googleMapsLink && (
                  <p>
                    <strong>Google Maps Route:</strong>{' '}
                    <a href={submitSuccess.googleMapsLink} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">
                      Open Location Pin / Route
                    </a>
                  </p>
                )}
                <p><strong>Amount (PGK):</strong> <span className="font-bold text-[#9E2A2B]">{formatPGK(submitSuccess.totalAmount)}</span></p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {!submitSuccess.isPaymentProof && (
                  <button
                    onClick={() => {
                      setClientPayForm(p => ({
                        ...p,
                        division: submitSuccess.division,
                        bookingOrDocRef: submitSuccess.id,
                        amountPaid: submitSuccess.totalAmount
                      }));
                      setPublicTab('pay');
                      setSubmitSuccess(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#162238] hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-[#E5C98B]" /> Pay Now & Upload Receipt
                  </button>
                )}
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                    submitSuccess.isPaymentProof
                      ? `Hello ${settings.companyName}, I uploaded payment proof ${submitSuccess.id} for ${formatPGK(submitSuccess.totalAmount)}. ${submitSuccess.details}`
                      : `Hello ${settings.companyName} (${submitSuccess.division}), I submitted request ${submitSuccess.id} for ${submitSuccess.itemSummary} (Total: ${formatPGK(submitSuccess.totalAmount)}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Notify via WhatsApp
                </a>
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm"
                >
                  Back to Portal
                </button>
              </div>
            </div>
          ) : publicTab === 'pay' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="bg-[#162238] text-white rounded-2xl p-6 shadow-md border-t-4 border-[#9A7B3E]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5C98B]">Official Settlement Account</span>
                  <h3 className="text-xl font-extrabold mt-1 mb-4">Bank Transfer Details</h3>
                  <div className="space-y-3 text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <div>
                      <p className="text-[11px] text-slate-400">Bank & Branch</p>
                      <p className="font-bold">{settings.bankName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Account Name</p>
                      <p className="font-bold">{settings.accountName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Account Number</p>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="font-mono text-lg font-extrabold text-[#E5C98B]">{settings.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(settings.accountNumber);
                            setCopiedAcc(true);
                            setTimeout(() => setCopiedAcc(false), 2000);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> {copiedAcc ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">IRC TIN / IPA Registration</p>
                      <p className="text-xs font-mono">TIN: {settings.tinNumber} • IPA: {settings.ipaNumber}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                    Use your <strong>Booking ID</strong> or <strong>Invoice #</strong> as your bank transfer narration, then upload your payment receipt on the right.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-xs space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Accepted Payment Methods</h4>
                  <p className="text-slate-600">• <strong>BSP Mobile / Internet Banking:</strong> Instant transfer to Account {settings.accountNumber}.</p>
                  <p className="text-slate-600">• <strong>Over-the-Counter Bank Deposit:</strong> Upload photo of stamped deposit slip.</p>
                  <p className="text-slate-600">• <strong>Institutional / Hospital LPO:</strong> Upload signed LPO or remittance advice.</p>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-extrabold text-[#162238] mb-1">Submit Payment Reference & Receipt Slip</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Once verified by our accounts team, your Proforma Invoice automatically upgrades to an Official GST Tax Receipt.
                </p>

                <form onSubmit={handleClientPaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subsidiary / Division *</label>
                      <select
                        value={clientPayForm.division}
                        onChange={e => setClientPayForm({ ...clientPayForm, division: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                      >
                        <option>Tunz Cars</option>
                        <option>Tunz Organics</option>
                        <option>Tech & Merch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Booking ID or Invoice #</label>
                      <input
                        type="text"
                        placeholder="e.g., TC-BK-2026-101 or TA-PI-2026-001"
                        value={clientPayForm.bookingOrDocRef}
                        onChange={e => setClientPayForm({ ...clientPayForm, bookingOrDocRef: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Payer / Organization Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name or Institution"
                        value={clientPayForm.payerName}
                        onChange={e => setClientPayForm({ ...clientPayForm, payerName: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="+675 7XXX XXXX"
                        value={clientPayForm.phone}
                        onChange={e => setClientPayForm({ ...clientPayForm, phone: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Paid (PGK) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g., 500.00"
                        value={clientPayForm.amountPaid}
                        onChange={e => setClientPayForm({ ...clientPayForm, amountPaid: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Date *</label>
                      <input
                        type="date"
                        required
                        value={clientPayForm.paymentDate}
                        onChange={e => setClientPayForm({ ...clientPayForm, paymentDate: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                      <select
                        value={clientPayForm.method}
                        onChange={e => setClientPayForm({ ...clientPayForm, method: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
                      >
                        <option>BSP Mobile / Internet Banking</option>
                        <option>BSP Branch Cash Deposit</option>
                        <option>Interbank Transfer (Kina / Westpac / ANZ)</option>
                        <option>Government / Hospital LPO</option>
                        <option>Cash / EFTPOS at Pickup</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Transaction Reference / Receipt Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter BSP Ref #, Receipt #, or LPO Number"
                      value={clientPayForm.bankReference}
                      onChange={e => setClientPayForm({ ...clientPayForm, bankReference: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Screenshot or Photo of Payment Receipt (Optional)</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#9A7B3E] rounded-xl p-5 cursor-pointer bg-slate-50/70 transition">
                      <Upload className="w-6 h-6 text-[#9A7B3E] mb-1.5" />
                      <span className="text-xs font-bold text-slate-700">
                        {uploadingProof
                          ? 'Compressing receipt image...'
                          : clientPayForm.receiptFileName
                          ? `Attached: ${clientPayForm.receiptFileName}`
                          : 'Click to select screenshot or deposit slip photo (JPG/PNG)'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">Automatically compressed for instant cloud verification</span>
                      <input type="file" accept="image/*" onChange={handleProofFileChange} className="hidden" />
                    </label>
                    {clientPayForm.receiptImage && (
                      <div className="mt-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                        <img src={clientPayForm.receiptImage} alt="Receipt preview" className="w-14 h-14 object-cover rounded border" />
                        <div className="text-xs flex-1">
                          <p className="font-bold text-emerald-800">Receipt slip ready to submit</p>
                          <p className="text-emerald-700">{clientPayForm.receiptFileName}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setClientPayForm(p => ({ ...p, receiptImage: '', receiptFileName: '' }))}
                          className="text-xs text-red-600 font-bold px-2"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingProof}
                    className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition"
                  >
                    Submit Payment Confirmation
                  </button>
                </form>
              </div>
            </div>
          ) : publicTab === 'cars' ? (
            /* TUNZ CARS PUBLIC PORTAL: DYNAMIC SERVICES + PNG REGION/TOWN + GOOGLE MAPS */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={settings.tcLogoUrl || DEFAULT_TC_LOGO}
                    alt="Tunz Cars Official Logo"
                    className="h-16 w-16 rounded-xl object-contain border border-slate-200 p-1 bg-white shadow-sm"
                  />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#9A7B3E]">A Subsidiary of {settings.companyName}</span>
                    <h3 className="text-xl font-extrabold text-[#162238]">Tunz Cars — Fleet Hire & Transport Services</h3>
                    <p className="text-xs text-slate-500">Filter by PNG Region & Town, select your service mode, and pin your exact location via Google Maps.</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Service Mode Selector (Managed by Admin!) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeCarServices.map((srv) => {
                  const active = selectedCarService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setCarForm(prev => ({ ...prev, serviceId: srv.id }))}
                      className={`p-4 rounded-xl border-2 text-left transition ${
                        active ? 'bg-[#162238] text-white border-[#9A7B3E] shadow-md' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${active ? 'bg-[#9A7B3E] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {srv.badge || (srv.pricingMode === 'flat_trip' ? `Flat ${formatPGK(srv.rate)}` : srv.rate > 0 ? `+${formatPGK(srv.rate)}/day` : 'Daily Rate')}
                        </span>
                        {active && <span className="text-xs font-bold text-[#E5C98B]">Active ✓</span>}
                      </div>
                      <div className="font-extrabold text-sm mt-1">{srv.title}</div>
                      <div className={`text-xs mt-0.5 ${active ? 'text-slate-300' : 'text-slate-500'}`}>{srv.description}</div>
                    </button>
                  );
                })}
              </div>

              {/* PNG Region & Town Filter Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#162238]">
                  <MapPin className="w-4 h-4 text-[#9E2A2B]" /> Filter Fleet by PNG Location:
                </div>
                <select
                  value={filterRegion}
                  onChange={(e) => { setFilterRegion(e.target.value); setFilterTown('All'); }}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold bg-slate-50"
                >
                  <option value="All">All 4 PNG Regions</option>
                  {Object.keys(PNG_REGIONS_AND_TOWNS).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <select
                  value={filterTown}
                  onChange={(e) => setFilterTown(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold bg-slate-50"
                >
                  <option value="All">All Towns</option>
                  {(filterRegion === 'All'
                    ? Object.values(PNG_REGIONS_AND_TOWNS).flat()
                    : PNG_REGIONS_AND_TOWNS[filterRegion] || []
                  ).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Fleet Cards + Google Maps */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#162238]">1. Select Fleet Vehicle ({publicVehicles.length} Available)</h3>
                    {publicVehicles.length === 0 ? (
                      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                        No fleet vehicles listed in this town yet. Switch filter to "All 4 PNG Regions" or WhatsApp us at {settings.phoneDisplay}.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {publicVehicles.map((v) => {
                          const isSelected = selectedVehicle?.id === v.id;
                          const isAvail = v.status === 'Available';
                          return (
                            <div
                              key={v.id}
                              onClick={() => isAvail && setCarForm({ ...carForm, vehicleId: v.id })}
                              className={`rounded-xl border-2 p-5 transition cursor-pointer bg-white ${
                                isSelected ? 'border-[#9A7B3E] ring-2 ring-[#9A7B3E]/20 shadow-md' : isAvail ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 opacity-60 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#9A7B3E]">
                                  {v.town || 'Kavieng'} • {v.category}
                                </span>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isAvail ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {v.status}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-900">{v.name}</h4>
                              <p className="text-xs text-slate-500 mb-2">{v.seats} • Plate: {v.plate}</p>
                              <p className="text-[11px] font-semibold text-slate-600 mb-3 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#9E2A2B]" /> {v.region || 'New Guinea Islands (NGI)'} ({v.town || 'Kavieng'})
                              </p>
                              <p className="text-xs text-slate-600 mb-4">{v.highlights}</p>
                              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                                <div>
                                  <span className="text-xl font-extrabold text-[#162238]">{formatPGK(v.dailyRate)}</span>
                                  <span className="text-xs text-slate-500"> / day (GST Incl.)</span>
                                </div>
                                {isSelected && <span className="text-xs font-bold text-[#9A7B3E]">Selected ✓</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* GOOGLE MAPS INTERACTIVE LOCATION & ROUTE PREVIEW */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-[#162238] text-sm flex items-center gap-1.5">
                          <Navigation className="w-4 h-4 text-[#9E2A2B]" /> Google Maps Precise Pickup & Route Preview
                        </h4>
                        <p className="text-xs text-slate-500">Verify your pickup landmark or capture your live GPS pin before booking.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleUseCurrentGPS}
                          className="px-3 py-1.5 rounded-lg bg-[#162238] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#E5C98B]" /> Use My GPS Pin
                        </button>
                        <a
                          href={googleMapsDirectionsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1 text-slate-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
                        </a>
                      </div>
                    </div>
                    {gpsStatus && <p className="text-xs font-semibold text-emerald-700">{gpsStatus}</p>}
                    <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <iframe
                        title="Tunz Cars Google Maps Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={`https://maps.google.com/maps?q=${mapQueryLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Service Reservation Form */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
                  <h3 className="text-lg font-bold text-[#162238] mb-1">2. {selectedCarService?.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">Base Location: {selectedVehicle?.town || 'Kavieng'}, {selectedVehicle?.region || 'NGI'}</p>
                  <form onSubmit={handleCarSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          {isFlatTripService ? 'Service / Pickup Date *' : 'Start Date *'}
                        </label>
                        <input type="date" required value={carForm.startDate} onChange={e => setCarForm({ ...carForm, startDate: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      {!isFlatTripService && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Return Date *</label>
                          <input type="date" required min={carForm.startDate} value={carForm.endDate} onChange={e => setCarForm({ ...carForm, endDate: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                      <input type="text" required placeholder="e.g., Dr. John Kila" value={carForm.clientName} onChange={e => setCarForm({ ...carForm, clientName: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Organization / Hospital / Business</label>
                      <input type="text" placeholder="e.g., Kavieng General Hospital" value={carForm.organization} onChange={e => setCarForm({ ...carForm, organization: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Phone / WhatsApp *</label>
                        <input type="text" required placeholder="+675 7XXX XXXX" value={carForm.phone} onChange={e => setCarForm({ ...carForm, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                      </div>
                      {selectedCarService?.requiresLicense && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Driver Licence # *</label>
                          <input type="text" required placeholder="PNG Licence" value={carForm.licenseNo} onChange={e => setCarForm({ ...carForm, licenseNo: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Precise Pickup Landmark / Street *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Kavieng Airport Terminal / Waterfront"
                        value={carForm.pickupAddress}
                        onChange={e => setCarForm({ ...carForm, pickupAddress: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isFlatTripService ? 'Drop-off Destination *' : 'Destination / Drop-off Point'}
                      </label>
                      <input
                        type="text"
                        required={isFlatTripService}
                        placeholder="e.g., Kavieng General Hospital / Nusa Jetty"
                        value={carForm.dropoffAddress}
                        onChange={e => setCarForm({ ...carForm, dropoffAddress: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Google Maps Pin Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="Paste Google Maps share link or click Use My GPS Pin"
                        value={carForm.googleMapsLink}
                        onChange={e => setCarForm({ ...carForm, googleMapsLink: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isFlatTripService ? 'Parcel Description & Recipient *' : 'Additional Service Notes (Optional)'}
                      </label>
                      <input
                        type="text"
                        required={isFlatTripService}
                        placeholder={isFlatTripService ? 'e.g., 2x Cartons Medical Supplies — Attn: Nurse Mary' : 'Flight arrival time or special instructions'}
                        value={carForm.serviceNotes}
                        onChange={e => setCarForm({ ...carForm, serviceNotes: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1 text-xs">
                      {!isFlatTripService && (
                        <div className="flex justify-between text-slate-600">
                          <span>{selectedVehicle?.name} × {rentalDays} day(s)</span>
                          <span>{formatPGK(baseCarCost)}</span>
                        </div>
                      )}
                      {serviceExtraCost > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>{selectedCarService?.title} {isFlatTripService ? '(Flat Trip)' : `(${rentalDays}d)`}</span>
                          <span>{formatPGK(serviceExtraCost)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-extrabold text-sm text-[#162238] pt-1.5 border-t border-slate-200">
                        <span>Estimated Total (GST Incl.)</span>
                        <span>{formatPGK(rentalTotal)}</span>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl bg-[#9E2A2B] hover:bg-[#822021] text-white font-bold text-sm shadow transition">
                      Submit {selectedCarService?.title}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* TUNZ ORGANICS & TECH/MERCH PUBLIC STOREFRONT (PRODUCTS & SERVICES) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-[#162238]">
                  1. Select {publicTab === 'organics' ? 'Tunz Organics Products & Packages' : 'Tech & Merch Products and Services'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCatalog.map((item) => {
                    const isSelected = selectedProduct?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setOrderForm({ ...orderForm, itemId: item.id })}
                        className={`rounded-xl border-2 p-5 transition cursor-pointer bg-white ${
                          isSelected ? 'border-[#9A7B3E] ring-2 ring-[#9A7B3E]/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#9A7B3E]">
                            {item.division} • {item.itemType || 'Product'}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {item.status} {item.itemType === 'Service' ? '' : `(${item.stock})`}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-slate-500 mb-3">{item.unit}</p>
                        <p className="text-xs text-slate-600 mb-4">{item.description}</p>
                        <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-xl font-extrabold text-[#162238]">{formatPGK(item.unitPrice)}</span>
                            <span className="text-xs text-slate-500"> / unit (GST Incl.)</span>
                          </div>
                          {isSelected && <span className="text-xs font-bold text-[#9A7B3E]">Selected ✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-[#162238] mb-4">2. Order / Service Request</h3>
                <form onSubmit={handleProductSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity *</label>
                    <input type="number" min="1" required value={orderForm.quantity} onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Name *</label>
                    <input type="text" required placeholder="Full Name" value={orderForm.clientName} onChange={e => setOrderForm({ ...orderForm, clientName: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Resort / School / Business Name</label>
                    <input type="text" placeholder="e.g., Nusa Island Retreat / PAU" value={orderForm.organization} onChange={e => setOrderForm({ ...orderForm, organization: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone / WhatsApp *</label>
                      <input type="text" required placeholder="+675 ..." value={orderForm.phone} onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Province</label>
                      <input type="text" value={orderForm.deliveryLocation} onChange={e => setOrderForm({ ...orderForm, deliveryLocation: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Specs / Branding Notes</label>
                    <input type="text" placeholder="e.g., Custom logo stamp, shirt sizes, specs" value={orderForm.notes} onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{selectedProduct?.name} × {orderForm.quantity}</span>
                      <span>{formatPGK(orderTotal)}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm text-[#162238] pt-1.5 border-t border-slate-200">
                      <span>Estimated Total (GST Incl.)</span>
                      <span>{formatPGK(orderTotal)}</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#162238] hover:bg-slate-800 text-white font-bold text-sm shadow transition">
                    Submit Order / Quote Request
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      )}

      {/* OWNER ADMIN COMMAND CENTER */}
      {mode === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
            {[
              { id: 'overview', label: 'Group Overview', icon: TrendingUp },
              { id: 'requests', label: `Client Requests (${pendingInquiriesCount})`, icon: Calendar },
              { id: 'proofs', label: `Payment Proofs (${pendingProofsCount})`, icon: Upload },
              { id: 'cars', label: 'Tunz Cars Fleet & Services', icon: Car },
              { id: 'catalog', label: 'Organics & Tech Catalog', icon: Package },
              { id: 'billing', label: 'Quotes & Invoices', icon: FileText },
              { id: 'payments', label: 'BSP Ledger', icon: CreditCard },
              { id: 'expenses', label: 'Expenses', icon: Fuel },
              { id: 'settings', label: 'Site & WhatsApp Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    adminTab === tab.id ? 'bg-[#162238] text-white shadow' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {adminTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Group Collected Revenue</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatPGK(metrics.collected)}</p>
                  <p className="text-xs text-slate-400 mt-1">10% IRC GST: {formatPGK(metrics.gst)}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Unpaid Receivables</p>
                  <p className="text-2xl font-extrabold text-amber-600 mt-1">{formatPGK(metrics.receivables)}</p>
                  <p className="text-xs text-slate-400 mt-1">Pending Proofs: {pendingProofsCount}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Group Operating Costs</p>
                  <p className="text-2xl font-extrabold text-[#9E2A2B] mt-1">{formatPGK(metrics.exp)}</p>
                  <p className="text-xs text-slate-400 mt-1">Fuel, Service, Raw Materials</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Net Group Cashflow</p>
                  <p className="text-2xl font-extrabold text-[#162238] mt-1">{formatPGK(metrics.net)}</p>
                  <p className="text-xs text-slate-400 mt-1">Acc: {settings.accountNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <img src={settings.tcLogoUrl || DEFAULT_TC_LOGO} alt="Tunz Cars" className="w-10 h-10 rounded-lg object-contain border" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7B3E]">Subsidiary 01</span>
                        <h3 className="font-bold text-slate-900">Tunz Cars — Live PNG Fleet</h3>
                      </div>
                    </div>
                    <button onClick={() => setVehModal({ open: true, data: null })} className="px-3 py-1.5 rounded-lg bg-[#162238] text-white text-xs font-bold flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Vehicle
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {vehicles.map(v => (
                      <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                        <div>
                          <div className="font-bold text-sm">{v.name} <span className="text-xs font-mono text-slate-500">({v.plate})</span></div>
                          <div className="text-xs text-slate-500">
                            <span className="font-semibold text-[#9A7B3E]">{v.town || 'Kavieng'} ({v.region || 'NGI'})</span> • {formatPGK(v.dailyRate)}/day
                          </div>
                        </div>
                        <select
                          value={v.status}
                          onChange={(e) => saveVehicle({ ...v, status: e.target.value })}
                          className="text-xs font-bold border border-slate-300 rounded px-2 py-1 bg-white"
                        >
                          <option>Available</option>
                          <option>On Hire</option>
                          <option>Maintenance</option>
                          <option>Inactive</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <img src={settings.taLogoUrl || DEFAULT_TA_LOGO} alt="Tunz Accessories" className="w-10 h-10 rounded-lg object-contain border p-0.5" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Subsidiaries 02 & 03</span>
                        <h3 className="font-bold text-slate-900">Tunz Organics & Tech/Merch Catalog</h3>
                      </div>
                    </div>
                    <button onClick={() => setCatModal({ open: true, data: null })} className="px-3 py-1.5 rounded-lg bg-[#9A7B3E] text-white text-xs font-bold flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Product/Service
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {catalog.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9A7B3E]">{c.division} • {c.itemType || 'Product'}</span>
                          <div className="font-bold text-sm">{c.name}</div>
                          <div className="text-xs text-slate-500">{formatPGK(c.unitPrice)} • {c.itemType === 'Service' ? c.status : `Stock: ${c.stock}`}</div>
                        </div>
                        <button onClick={() => setCatModal({ open: true, data: c })} className="px-2.5 py-1 rounded bg-white border border-slate-300 text-xs font-bold">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'requests' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Incoming Bookings, Chauffeurs, Parcels & Wholesale Orders</h3>
              {inquiries.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No client requests submitted yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                      <tr>
                        <th className="p-3">Ref / Division</th>
                        <th className="p-3">Client / Organization</th>
                        <th className="p-3">Service / Location</th>
                        <th className="p-3">Total (GST Incl.)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {inquiries.map(inq => (
                        <tr key={inq.id}>
                          <td className="p-3">
                            <div className="font-mono text-xs font-bold">{inq.id}</div>
                            <span className="text-[11px] font-bold text-[#9A7B3E]">{inq.division}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold">{inq.clientName}</div>
                            <div className="text-xs text-slate-500">{inq.organization} • {inq.phone}</div>
                          </td>
                          <td className="p-3 text-xs">
                            <div className="font-bold">{inq.itemSummary} (×{inq.qty})</div>
                            <div className="text-slate-500">{inq.details}</div>
                            {inq.googleMapsLink && (
                              <a href={inq.googleMapsLink} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> View Map Pin
                              </a>
                            )}
                          </td>
                          <td className="p-3 font-extrabold">{formatPGK(inq.totalAmount)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              inq.status === 'Approved & Invoiced'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inq.status === 'Declined / Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>{inq.status}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {inq.status === 'Pending Approval' && (
                                <>
                                  <button onClick={() => approveInquiry(inq)} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                                    Approve & Invoice
                                  </button>
                                  <button onClick={() => declineInquiry(inq)} className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                                    Decline
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setDeleteConfirm({ col: 'inquiries', id: inq.id, name: `${inq.id} (${inq.clientName})` })}
                                title="Delete Request"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {adminTab === 'proofs' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="font-bold text-slate-900">Customer Uploaded Payment Proofs & Bank References</h3>
                <p className="text-xs text-slate-500">Verify bank transfer references & receipt slips to post into the ledger and upgrade invoices to Official Receipts.</p>
              </div>
              {paymentSubmissions.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No customer payment proofs uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                      <tr>
                        <th className="p-3">Proof ID / Division</th>
                        <th className="p-3">Payer & Linked Ref</th>
                        <th className="p-3">Bank Ref / Method</th>
                        <th className="p-3">Amount (PGK)</th>
                        <th className="p-3">Slip</th>
                        <th className="p-3">Status / Verify</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paymentSubmissions.map(sub => (
                        <tr key={sub.id}>
                          <td className="p-3">
                            <div className="font-mono text-xs font-bold">{sub.id}</div>
                            <span className="text-[11px] font-bold text-[#9A7B3E]">{sub.division} • {sub.paymentDate}</span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold">{sub.payerName}</div>
                            <div className="text-xs text-slate-500">{sub.phone} • Ref: <span className="font-mono">{sub.bookingOrDocRef || 'N/A'}</span></div>
                          </td>
                          <td className="p-3 text-xs">
                            <div className="font-mono font-bold text-[#162238]">{sub.bankReference}</div>
                            <div className="text-slate-500">{sub.method}</div>
                          </td>
                          <td className="p-3 font-extrabold text-emerald-700">{formatPGK(sub.amountPaid)}</td>
                          <td className="p-3">
                            {sub.receiptImage ? (
                              <button
                                onClick={() => setProofViewer(sub)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Slip
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">No Image</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {sub.status === 'Pending Verification' ? (
                                <>
                                  <button
                                    onClick={() => verifyPaymentSubmission(sub)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                  >
                                    Verify & Issue Receipt
                                  </button>
                                  <button
                                    onClick={() => declinePaymentSubmission(sub)}
                                    className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                                  >
                                    Decline
                                  </button>
                                </>
                              ) : (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  sub.status === 'Declined' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {sub.status}
                                </span>
                              )}
                              <button
                                onClick={() => setDeleteConfirm({ col: 'payment_submissions', id: sub.id, name: `${sub.id} (${sub.payerName})` })}
                                title="Delete Proof"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. TUNZ CARS FLEET & ADDITIONAL SERVICES CRUD */}
          {adminTab === 'cars' && (
            <div className="space-y-6">
              {/* Fleet Registry */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <img src={settings.tcLogoUrl || DEFAULT_TC_LOGO} alt="Tunz Cars" className="w-11 h-11 rounded-lg object-contain border" />
                    <div>
                      <h3 className="font-bold text-slate-900">Tunz Cars — PNG Fleet Registry, Regions & Rates</h3>
                      <p className="text-xs text-slate-500">Assign vehicles across NGI, Southern, Momase & Highlands towns and adjust daily PGK rates.</p>
                    </div>
                  </div>
                  <button onClick={() => setVehModal({ open: true, data: null })} className="px-4 py-2 rounded-lg bg-[#162238] text-white text-xs font-bold flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Vehicle
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                      <tr>
                        <th className="p-3">ID / Plate</th>
                        <th className="p-3">Vehicle</th>
                        <th className="p-3">PNG Region & Town</th>
                        <th className="p-3">Daily Rate</th>
                        <th className="p-3">Odometer / Service</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {vehicles.map(v => (
                        <tr key={v.id}>
                          <td className="p-3 font-mono text-xs font-bold">{v.id} ({v.plate})</td>
                          <td className="p-3">
                            <div className="font-bold">{v.name}</div>
                            <div className="text-xs text-slate-500">{v.seats}</div>
                          </td>
                          <td className="p-3 text-xs">
                            <div className="font-bold text-[#9A7B3E]">{v.town || 'Kavieng'}</div>
                            <div className="text-slate-500">{v.region || 'New Guinea Islands (NGI)'}</div>
                          </td>
                          <td className="p-3 font-extrabold text-[#162238]">{formatPGK(v.dailyRate)}</td>
                          <td className="p-3 text-xs">{Number(v.odometer).toLocaleString()} / {Number(v.nextServiceKm).toLocaleString()} km</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100">{v.status}</span></td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => setVehModal({ open: true, data: v })} className="p-1.5 rounded bg-blue-50 text-blue-700"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm({ col: 'vehicles', id: v.id, name: v.name })} className="p-1.5 rounded bg-red-50 text-red-700"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Tunz Cars Additional Services Manager */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Tunz Cars — Additional Service Modes (Hire, Chauffeurs, Parcels, Airport Transfers)</h3>
                    <p className="text-xs text-slate-500">Add, edit, or toggle transport service options that customers see on the booking page.</p>
                  </div>
                  <button onClick={() => setSrvModal({ open: true, data: null })} className="px-4 py-2 rounded-lg bg-[#9A7B3E] text-white text-xs font-bold flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Transport Service
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                      <tr>
                        <th className="p-3">Service Title</th>
                        <th className="p-3">Pricing Rule</th>
                        <th className="p-3">Rate / Surcharge</th>
                        <th className="p-3">Licence Required</th>
                        <th className="p-3 text-right">Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {carServices.map(s => (
                        <tr key={s.id}>
                          <td className="p-3">
                            <div className="font-bold">{s.title}</div>
                            <div className="text-xs text-slate-500">{s.description}</div>
                          </td>
                          <td className="p-3 text-xs font-semibold">
                            {s.pricingMode === 'flat_trip' ? 'Flat Trip Rate' : 'Vehicle Daily Rate + Surcharge'}
                          </td>
                          <td className="p-3 font-extrabold text-[#162238]">
                            {s.pricingMode === 'flat_trip' ? `${formatPGK(s.rate)} / trip` : `+${formatPGK(s.rate)} / day`}
                          </td>
                          <td className="p-3 text-xs">{s.requiresLicense ? 'Yes (Self-Drive)' : 'No'}</td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => setSrvModal({ open: true, data: s })} className="p-1.5 rounded bg-blue-50 text-blue-700"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm({ col: 'car_services', id: s.id, name: s.title })} className="p-1.5 rounded bg-red-50 text-red-700"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. ORGANICS & TECH CATALOG (PRODUCTS & SERVICES CRUD) */}
          {adminTab === 'catalog' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Tunz Organics & Tech/Merch — Products & Services Manager</h3>
                  <p className="text-xs text-slate-500">Add, edit, or delete physical products and services under Tunz Organics or Tech & Merch.</p>
                </div>
                <button onClick={() => setCatModal({ open: true, data: null })} className="px-4 py-2 rounded-lg bg-[#9A7B3E] text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Product or Service
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">SKU / Division</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Product / Service Name</th>
                      <th className="p-3">Unit Price (PGK)</th>
                      <th className="p-3">Stock / Status</th>
                      <th className="p-3 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {catalog.map(c => (
                      <tr key={c.id}>
                        <td className="p-3">
                          <div className="font-mono text-xs font-bold">{c.id}</div>
                          <span className="text-[11px] font-bold text-[#9A7B3E]">{c.division}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            c.itemType === 'Service' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {c.itemType || 'Product'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{c.name}</div>
                          <div className="text-xs text-slate-500">{c.unit}</div>
                        </td>
                        <td className="p-3 font-extrabold">{formatPGK(c.unitPrice)}</td>
                        <td className="p-3 text-xs font-bold">{c.itemType === 'Service' ? c.status : `${c.stock} (${c.status})`}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setCatModal({ open: true, data: c })} className="p-1.5 rounded bg-blue-50 text-blue-700"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm({ col: 'catalog', id: c.id, name: c.name })} className="p-1.5 rounded bg-red-50 text-red-700"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'billing' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Group Quotations, Proforma Invoices & Official Receipts</h3>
                  <p className="text-xs text-slate-500">Automatically branded with Tunz Cars or Tunz Accessories logo based on division</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportCSV('Tunz_Accessories_Billing.csv', documents)} className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button onClick={() => setDocModal({ open: true, data: null })} className="px-4 py-2 rounded-lg bg-[#9E2A2B] text-white text-xs font-bold flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> New Quote / Invoice
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-3">Doc # / Division</th>
                      <th className="p-3">Client</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Total (PGK)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">A4 Print / Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {documents.map(d => (
                      <tr key={d.id}>
                        <td className="p-3">
                          <div className="font-mono text-xs font-bold">{d.id}</div>
                          <span className="text-[11px] font-bold text-[#9A7B3E]">{d.division} • {d.type}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{d.clientName}</div>
                          <div className="text-xs text-slate-500">{d.clientContact}</div>
                        </td>
                        <td className="p-3 text-xs">
                          <div className="font-semibold">{d.itemSummary}</div>
                          <div className="text-slate-500">{d.qty} {d.unitLabel} @ {formatPGK(d.unitRate)}</div>
                        </td>
                        <td className="p-3 font-extrabold">{formatPGK(d.totalAmount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            d.status === 'Paid in Full' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>{d.status}</span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setPreviewDoc(d)} className="px-2.5 py-1.5 rounded bg-[#162238] text-white text-xs font-bold inline-flex items-center gap-1">
                            <Printer className="w-3.5 h-3.5" /> A4 View
                          </button>
                          <button onClick={() => setDocModal({ open: true, data: d })} className="p-1.5 rounded bg-slate-100 text-slate-700">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm({ col: 'documents', id: d.id, name: `${d.id} (${d.clientName})` })} className="p-1.5 rounded bg-red-50 text-red-700">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'payments' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Group Payments & Bank Transfer Ledger</h3>
                  <p className="text-xs text-slate-500">Account: {settings.accountName} • {settings.accountNumber}</p>
                </div>
                <button onClick={() => setPayModal(true)} className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Record Manual Payment
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="p-3">Receipt Ref</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Linked Doc</th>
                    <th className="p-3">Method & Reference</th>
                    <th className="p-3">Amount (PGK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {payments.length === 0 ? (
                    <tr><td colSpan="5" className="p-6 text-center text-slate-500 text-xs">No payments recorded yet.</td></tr>
                  ) : payments.map(p => (
                    <tr key={p.id}>
                      <td className="p-3 font-mono text-xs font-bold">{p.id}</td>
                      <td className="p-3 text-xs">{p.date}</td>
                      <td className="p-3 text-xs font-semibold">{p.docId || 'Direct Deposit'}</td>
                      <td className="p-3 text-xs">{p.method} ({p.reference})</td>
                      <td className="p-3 font-bold text-emerald-700">{formatPGK(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === 'expenses' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Group Operating Expenses (Fleet, Organics & Procurement)</h3>
                  <p className="text-xs text-slate-500">Log fuel, servicing, coconut oil supplies, and freight costs.</p>
                </div>
                <button onClick={() => setExpModal(true)} className="px-4 py-2 rounded-lg bg-[#162238] text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Log Expense
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Division</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3">Amount (PGK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {expenses.length === 0 ? (
                    <tr><td colSpan="5" className="p-6 text-center text-slate-500 text-xs">No expenses recorded yet.</td></tr>
                  ) : expenses.map(ex => (
                    <tr key={ex.id}>
                      <td className="p-3 text-xs">{ex.date}</td>
                      <td className="p-3 text-xs font-bold text-[#9A7B3E]">{ex.division}</td>
                      <td className="p-3 text-xs font-semibold">{ex.category}</td>
                      <td className="p-3 text-xs">{ex.notes}</td>
                      <td className="p-3 font-bold text-[#9E2A2B]">{formatPGK(ex.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 9. SITE, WHATSAPP, LOGOS & BANKING LIVE SETTINGS */}
          {adminTab === 'settings' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-4xl">
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-[#162238]">Site, Official WhatsApp, Logos & Banking Settings</h3>
                <p className="text-xs text-slate-500">Update your official WhatsApp number, email, banking details, Owner PIN, or upload new logos directly inside the app.</p>
              </div>

              {settingsSavedBanner && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> All business settings, WhatsApp links, and logos updated live across the site!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Official Contact & WhatsApp */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#162238]">1. Official WhatsApp & Business Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Display Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={settings.phoneDisplay}
                        onChange={e => setSettings({ ...settings, phoneDisplay: e.target.value })}
                        placeholder="+675 7962 5068"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Digits (Country Code + #) *</label>
                      <input
                        type="text"
                        required
                        value={settings.whatsappNumber}
                        onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="67579625068"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email *</label>
                      <input
                        type="email"
                        required
                        value={settings.email}
                        onChange={e => setSettings({ ...settings, email: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Holding Branding & Security */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#162238]">2. Holding Title, Registrations & Owner PIN</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Main Holding Title</label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">IPA Reg #</label>
                      <input
                        type="text"
                        value={settings.ipaNumber}
                        onChange={e => setSettings({ ...settings, ipaNumber: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">IRC TIN #</label>
                      <input
                        type="text"
                        value={settings.tinNumber}
                        onChange={e => setSettings({ ...settings, tinNumber: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Admin PIN</label>
                      <input
                        type="text"
                        value={settings.adminPin}
                        onChange={e => setSettings({ ...settings, adminPin: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono bg-white font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Storefront Welcome Description</label>
                    <input
                      type="text"
                      value={settings.heroDescription}
                      onChange={e => setSettings({ ...settings, heroDescription: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Banking Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#162238]">3. Settlement Bank Account (Shown on Payment Portal & Invoices)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Bank & Branch</label>
                      <input
                        type="text"
                        value={settings.bankName}
                        onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Account Name</label>
                      <input
                        type="text"
                        value={settings.accountName}
                        onChange={e => setSettings({ ...settings, accountName: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={settings.accountNumber}
                        onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono bg-white font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Logo Uploaders (No GitHub upload needed!) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-[#162238]">4. Direct Logo Upload (Instant Cloud Sync)</h4>
                  <p className="text-xs text-slate-500">Upload your Tunz Accessories and Tunz Cars logos straight from your computer here.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-4">
                      <img src={settings.taLogoUrl || DEFAULT_TA_LOGO} alt="TA Logo" className="w-16 h-16 object-contain border rounded-lg p-1" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-800 mb-1">Tunz Accessories Holding Logo</div>
                        <label className="inline-block px-3 py-1.5 rounded-lg bg-[#162238] text-white text-xs font-bold cursor-pointer hover:bg-slate-800">
                          Upload Logo Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const dataUrl = await compressImageFile(file, 500);
                              setSettings(prev => ({ ...prev, taLogoUrl: dataUrl }));
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-4">
                      <img src={settings.tcLogoUrl || DEFAULT_TC_LOGO} alt="TC Logo" className="w-16 h-16 object-contain border rounded-lg p-1" />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-800 mb-1">Tunz Cars Subsidiary Logo</div>
                        <label className="inline-block px-3 py-1.5 rounded-lg bg-[#9A7B3E] text-white text-xs font-bold cursor-pointer hover:opacity-90">
                          Upload Logo Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const dataUrl = await compressImageFile(file, 500);
                              setSettings(prev => ({ ...prev, tcLogoUrl: dataUrl }));
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition"
                >
                  Save All Settings Live
                </button>
              </form>
            </div>
          )}
        </main>
      )}

      {proofViewer && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900">Uploaded Receipt Slip ({proofViewer.id})</h3>
                <p className="text-xs text-slate-500">Ref: {proofViewer.bankReference} • {formatPGK(proofViewer.amountPaid)}</p>
              </div>
              <button onClick={() => setProofViewer(null)} className="p-1.5 rounded-lg bg-slate-100"><X className="w-4 h-4" /></button>
            </div>
            <img src={proofViewer.receiptImage} alt="Uploaded receipt" className="w-full max-h-[60vh] object-contain rounded-lg border bg-slate-50" />
            <div className="flex justify-end gap-2">
              {proofViewer.status === 'Pending Verification' && (
                <button
                  onClick={() => {
                    verifyPaymentSubmission(proofViewer);
                    setProofViewer(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                >
                  Verify & Issue Receipt
                </button>
              )}
              <button onClick={() => setProofViewer(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-bold">Close</button>
            </div>
          </div>
        </div>
      )}

      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handlePinUnlock} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-[#162238] mb-1">{settings.companyName} Owner Login</h3>
            <p className="text-xs text-slate-500 mb-4">Enter Owner PIN to manage all divisions & settings.</p>
            <input
              type="password"
              autoFocus
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-center text-lg font-bold tracking-widest mb-2"
            />
            {pinError && <p className="text-xs text-red-600 mb-2">{pinError}</p>}
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => setShowPinModal(false)} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
              <button type="submit" className="flex-1 py-2 rounded-lg bg-[#162238] text-white text-xs font-bold">Unlock Suite</button>
            </div>
          </form>
        </div>
      )}

      {vehModal.open && (
        <VehicleModal initial={vehModal.data} onClose={() => setVehModal({ open: false, data: null })} onSave={saveVehicle} />
      )}

      {srvModal.open && (
        <CarServiceModal initial={srvModal.data} onClose={() => setSrvModal({ open: false, data: null })} onSave={saveCarService} />
      )}

      {catModal.open && (
        <CatalogModal initial={catModal.data} onClose={() => setCatModal({ open: false, data: null })} onSave={saveCatalogItem} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-red-700 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-slate-600 mb-4">Remove <strong>{deleteConfirm.name}</strong> permanently?</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
              <button
                onClick={async () => {
                  if (deleteConfirm.col === 'vehicles') setVehicles(p => p.filter(x => x.id !== deleteConfirm.id));
                  if (deleteConfirm.col === 'car_services') setCarServices(p => p.filter(x => x.id !== deleteConfirm.id));
                  if (deleteConfirm.col === 'catalog') setCatalog(p => p.filter(x => x.id !== deleteConfirm.id));
                  if (deleteConfirm.col === 'inquiries') setInquiries(p => p.filter(x => x.id !== deleteConfirm.id));
                  if (deleteConfirm.col === 'payment_submissions') setPaymentSubmissions(p => p.filter(x => x.id !== deleteConfirm.id));
                  if (deleteConfirm.col === 'documents') setDocuments(p => p.filter(x => x.id !== deleteConfirm.id));
                  await deleteCloud(deleteConfirm.col, deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {docModal.open && (
        <DocumentModal initial={docModal.data} vehicles={vehicles} catalog={catalog} onClose={() => setDocModal({ open: false, data: null })} onSave={saveDocument} />
      )}

      {payModal && (
        <PaymentModal documents={documents} onClose={() => setPayModal(false)} onSave={logPayment} />
      )}

      {expModal && (
        <ExpenseModal onClose={() => setExpModal(false)} onSave={logExpense} />
      )}

      {/* A4 CORPORATE DOCUMENT PREVIEW */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold uppercase text-slate-500">Corporate A4 Document Preview</span>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-1.5 rounded-lg bg-[#162238] text-white text-xs font-bold flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-lg bg-slate-100"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-6 text-slate-900">
              <div className="flex justify-between items-start border-b-2 border-[#9E2A2B] pb-4 gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={previewDoc.division === 'Tunz Cars' ? (settings.tcLogoUrl || DEFAULT_TC_LOGO) : (settings.taLogoUrl || DEFAULT_TA_LOGO)}
                    alt={previewDoc.division === 'Tunz Cars' ? 'Tunz Cars Logo' : 'Tunz Accessories Logo'}
                    className="h-20 w-auto object-contain shrink-0"
                  />
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#162238] uppercase">
                      {previewDoc.division === 'Tunz Cars' ? 'TUNZ CARS' : settings.companyName}
                    </h2>
                    <p className="text-xs font-bold text-[#9A7B3E]">
                      {previewDoc.division === 'Tunz Cars'
                        ? `A Subsidiary of ${settings.companyName}`
                        : `Operating Division: ${previewDoc.division}`}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Phone / WhatsApp: {settings.phoneDisplay} • Email: {settings.email}</p>
                    <p className="text-xs text-slate-600">IPA Reg #: {settings.ipaNumber} • IRC TIN: {settings.tinNumber}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <h3 className="text-xl font-extrabold uppercase text-[#162238]">{previewDoc.type}</h3>
                  <p className="font-mono text-xs font-bold text-[#9E2A2B]">{previewDoc.id}</p>
                  <p className="text-xs text-slate-600 mt-1">Date: {previewDoc.date}</p>
                  <p className="text-xs font-bold text-slate-700">Status: {previewDoc.status}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1">
                <p className="font-bold uppercase text-[#9A7B3E]">Client / Organization:</p>
                <p className="text-sm font-bold">{previewDoc.clientName}</p>
                <p className="text-slate-600">Contact: {previewDoc.clientContact}</p>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#162238] text-white">
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-center">Qty ({previewDoc.unitLabel})</th>
                    <th className="p-2.5 text-right">Unit Rate (PGK)</th>
                    <th className="p-2.5 text-right">Total (PGK)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-3">
                      <div className="font-bold">{previewDoc.itemSummary}</div>
                      {previewDoc.division === 'Tunz Cars' && (
                        <div className="text-slate-500">Schedule: {previewDoc.startDate} to {previewDoc.endDate}</div>
                      )}
                      <div className="text-slate-500">{previewDoc.notes}</div>
                    </td>
                    <td className="p-3 text-center font-bold">{previewDoc.qty}</td>
                    <td className="p-3 text-right">{formatPGK(previewDoc.unitRate)}</td>
                    <td className="p-3 text-right font-bold">{formatPGK(previewDoc.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-start gap-6">
                <div className="bg-slate-50 p-3.5 rounded-lg border-l-4 border-[#9E2A2B] text-xs space-y-1 flex-1">
                  <p className="font-bold text-[#9E2A2B]">OFFICIAL BANKING DETAILS</p>
                  <p><strong>Account Name:</strong> {settings.accountName}</p>
                  <p><strong>Bank & Acc #:</strong> {settings.bankName} — {settings.accountNumber}</p>
                  {previewDoc.type === 'Official Receipt' && (
                    <p className="pt-1 font-semibold text-slate-800">Amount in Words: {numberToWordsPGK(previewDoc.totalAmount)}</p>
                  )}
                </div>
                <div className="w-60 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal (Excl. GST):</span>
                    <span>{formatPGK(previewDoc.totalAmount / 1.1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PNG GST (10%):</span>
                    <span>{formatPGK(previewDoc.totalAmount - previewDoc.totalAmount / 1.1)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm bg-[#162238] text-white p-2 rounded">
                    <span>TOTAL (PGK):</span>
                    <span>{formatPGK(previewDoc.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VehicleModal({ initial, onClose, onSave }) {
  const defaultRegion = initial?.region || 'New Guinea Islands (NGI)';
  const [form, setForm] = useState(
    initial || {
      name: '',
      plate: '',
      category: 'SUV / AWD',
      seats: '5 Seats • Auto',
      region: 'New Guinea Islands (NGI)',
      town: 'Kavieng',
      dailyRate: 250,
      status: 'Available',
      odometer: 0,
      nextServiceKm: 5000,
      highlights: ''
    }
  );

  const townsForSelectedRegion = PNG_REGIONS_AND_TOWNS[form.region] || PNG_REGIONS_AND_TOWNS[defaultRegion];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-3 shadow-xl">
        <h3 className="text-lg font-bold text-[#162238]">{initial ? 'Edit Fleet Vehicle & Location' : 'Add Fleet Vehicle & Location'}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Vehicle Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="2016 Toyota Hilux" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Plate # *</label>
            <input required value={form.plate} onChange={e => setForm({ ...form, plate: e.target.value })} placeholder="KVG-999" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-[#162238] mb-1">PNG Region *</label>
            <select
              value={form.region}
              onChange={(e) => {
                const newRegion = e.target.value;
                const firstTown = (PNG_REGIONS_AND_TOWNS[newRegion] || ['Kavieng'])[0];
                setForm({ ...form, region: newRegion, town: firstTown });
              }}
              className="w-full border rounded-lg px-2.5 py-2 text-xs font-semibold bg-white"
            >
              {Object.keys(PNG_REGIONS_AND_TOWNS).map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#162238] mb-1">Town / Center *</label>
            <select
              value={form.town}
              onChange={(e) => setForm({ ...form, town: e.target.value })}
              className="w-full border rounded-lg px-2.5 py-2 text-xs font-semibold bg-white"
            >
              {townsForSelectedRegion.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Daily Rate (PGK)</label>
            <input type="number" required value={form.dailyRate} onChange={e => setForm({ ...form, dailyRate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Odometer (km)</label>
            <input type="number" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Available</option>
              <option>On Hire</option>
              <option>Maintenance</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Highlights / Specs</label>
          <input value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-lg bg-[#162238] text-white text-xs font-bold">Save Vehicle</button>
        </div>
      </form>
    </div>
  );
}

function CarServiceModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      title: '',
      pricingMode: 'flat_trip',
      rate: 100,
      badge: 'Airport Transfer',
      description: '',
      requiresLicense: false,
      active: true
    }
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3 shadow-xl">
        <h3 className="text-lg font-bold text-[#162238]">{initial ? 'Edit Transport Service' : 'Add Tunz Cars Service Mode'}</h3>
        <div>
          <label className="block text-xs font-semibold mb-1">Service Name *</label>
          <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Airport VIP Transfer" className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Pricing Rule</label>
            <select value={form.pricingMode} onChange={e => setForm({ ...form, pricingMode: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-xs font-semibold">
              <option value="flat_trip">Flat Trip Rate (One-Off)</option>
              <option value="per_day">Vehicle Daily Rate + Surcharge/Day</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Rate / Surcharge (PGK)</label>
            <input type="number" required value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Badge Label</label>
            <input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g., Fixed Fare" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input type="checkbox" checked={form.requiresLicense} onChange={e => setForm({ ...form, requiresLicense: e.target.checked })} />
              Require Driver Licence #
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Customer Description</label>
          <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short explanation shown to clients" className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-lg bg-[#9A7B3E] text-white text-xs font-bold">Save Service</button>
        </div>
      </form>
    </div>
  );
}

function CatalogModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      division: 'Tech & Merch',
      itemType: 'Product',
      name: '',
      unit: 'Per Unit',
      unitPrice: 100,
      stock: 20,
      status: 'In Stock',
      description: ''
    }
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-3 shadow-xl">
        <h3 className="text-lg font-bold text-[#162238]">{initial ? 'Edit Product / Service' : 'Add Product or Service'}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Division</label>
            <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value })} className="w-full border rounded-lg px-2.5 py-2 text-xs font-semibold">
              <option>Tunz Organics</option>
              <option>Tech & Merch</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Item Type</label>
            <select value={form.itemType} onChange={e => setForm({ ...form, itemType: e.target.value })} className="w-full border rounded-lg px-2.5 py-2 text-xs font-semibold">
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Unit Price (PGK)</label>
            <input type="number" required value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Product or Service Name *</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Custom Branded Caps / Laptop Repair" className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Unit Label</label>
            <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="Per Unit / Per Job" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Stock Qty</label>
            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Availability Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border rounded-lg px-2.5 py-2 text-xs font-semibold">
              <option>In Stock</option>
              <option>Available</option>
              <option>Made to Order</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Description</label>
          <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-lg bg-[#9A7B3E] text-white text-xs font-bold">Save Item</button>
        </div>
      </form>
    </div>
  );
}

function DocumentModal({ initial, vehicles, catalog, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      division: 'Tunz Cars',
      type: 'Quotation',
      status: 'Sent',
      date: new Date().toISOString().slice(0, 10),
      clientName: '',
      clientContact: '',
      itemSummary: vehicles[0]?.name || '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      qty: 1,
      unitLabel: 'Days',
      unitRate: vehicles[0]?.dailyRate || 250,
      notes: '10% PNG GST Inclusive'
    }
  );
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-3 shadow-xl">
        <h3 className="text-lg font-bold text-[#162238]">{initial ? 'Edit Document' : 'Create Group Quote / Invoice / Receipt'}</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Division</label>
            <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value, unitLabel: e.target.value === 'Tunz Cars' ? 'Days' : 'Units' })} className="w-full border rounded-lg px-2 py-2 text-xs">
              <option>Tunz Cars</option>
              <option>Tunz Organics</option>
              <option>Tech & Merch</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Doc Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-2 py-2 text-xs">
              <option>Quotation</option>
              <option>Proforma Invoice</option>
              <option>Official Receipt</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-2 py-2 text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Client / Organization *</label>
            <input required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Contact</label>
            <input value={form.clientContact} onChange={e => setForm({ ...form, clientContact: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Vehicle / Product Description *</label>
          <input required value={form.itemSummary} onChange={e => setForm({ ...form, itemSummary: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        {form.division === 'Tunz Cars' ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-2 py-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded-lg px-2 py-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Daily Rate (PGK)</label>
              <input type="number" value={form.unitRate} onChange={e => setForm({ ...form, unitRate: e.target.value })} className="w-full border rounded-lg px-2 py-2 text-sm font-bold" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Quantity</label>
              <input type="number" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Unit Price (PGK)</label>
              <input type="number" value={form.unitRate} onChange={e => setForm({ ...form, unitRate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1">Notes</label>
          <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-lg bg-[#9E2A2B] text-white text-xs font-bold">Save Document</button>
        </div>
      </form>
    </div>
  );
}

function PaymentModal({ documents, onClose, onSave }) {
  const [form, setForm] = useState({
    docId: documents[0]?.id || '',
    date: new Date().toISOString().slice(0, 10),
    amount: documents[0]?.totalAmount || 250,
    method: 'BSP Bank Transfer',
    reference: ''
  });
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3 shadow-xl">
        <h3 className="text-lg font-bold text-[#162238]">Record Group Payment</h3>
        <div>
          <label className="block text-xs font-semibold mb-1">Linked Invoice / Quote</label>
          <select value={form.docId} onChange={e => setForm({ ...form, docId: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">-- Direct Deposit --</option>
            {documents.map(d => <option key={d.id} value={d.id}>{d.id} ({d.division}) — {d.clientName}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Amount (PGK) *</label>
            <input type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Method</label>
            <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>BSP Bank Transfer</option>
              <option>Cash</option>
              <option>EFTPOS</option>
              <option>Government LPO</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">BSP Reference #</label>
            <input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold">Confirm Payment</button>
        </div>
      </form>
    </div>
  );
}

function ExpenseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    division: 'Tunz Cars',
    date: new Date().toISOString().slice(0, 10),
    category: 'Fuel & Servicing',
    amount: 0,
    notes: ''
  });
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3 shadow-xl">
        <h3 className="text-lg font-bold text-[#162238]">Log Group Expense</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Division</label>
            <select value={form.division} onChange={e => setForm({ ...form, division: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Tunz Cars</option>
              <option>Tunz Organics</option>
              <option>Tech & Merch</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Amount (PGK) *</label>
            <input type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm font-bold" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">Category</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Notes / Supplier</label>
          <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g., Puma Energy Kavieng / Virgin Coconut Oil" className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-slate-100 text-xs font-bold">Cancel</button>
          <button type="submit" className="flex-1 py-2 rounded-lg bg-[#162238] text-white text-xs font-bold">Save Expense</button>
        </div>
      </form>
    </div>
  );
}

export default TunzAccessoriesSuite;
