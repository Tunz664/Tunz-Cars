import React, { useState, useMemo, useEffect } from 'react';
import {
  Car,
  FileText,
  CreditCard,
  Fuel,
  LayoutDashboard,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Printer,
  ArrowRight,
  Download,
  RotateCcw,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Receipt,
  DollarSign,
  TrendingUp,
  Gauge,
  ShieldCheck,
  Filter,
  Edit3,
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// BRAND & BUSINESS CONSTANTS (TUNZ CARS — A SUBSIDIARY OF TUNZ ACCESSORIES)
// ============================================================================
const COMPANY_INFO = {
  name: 'Tunz Cars',
  parent: 'A Subsidiary of Tunz Accessories',
  ipaReg: '6-136546287',
  ircTin: '501982530',
  bspAccount: '1001252316',
  bspBranch: 'BSP Kavieng Branch',
  accountName: 'Barrie Tunz Jr Abel',
  principal: 'Barrie Tunz Jr Abel',
  phone: '+675 7962 5068',
  email: 'tuneabel@gmail.com',
  locations: 'Kavieng (New Ireland Province) & Port Moresby, PNG',
  currency: 'PGK'
};

// ============================================================================
// INITIAL REALISTIC KAVIENG FLEET & OPERATIONS DATA
// ============================================================================
const INITIAL_VEHICLES = [
  {
    id: 'TC-VEH-01',
    makeModel: '2013 Subaru XV AWD',
    plate: 'KVG-412',
    color: 'Obsidian Black',
    category: '5-Seater AWD SUV',
    dailyRate: 250.0,
    odometer: 149250,
    nextServiceOdo: 154000,
    regoExpiry: '2027-03-15',
    insuranceExpiry: '2027-03-15',
    status: 'Available',
    fuelType: 'Petrol',
    notes: 'Primary institutional & airport AWD SUV. Roof racks installed.'
  },
  {
    id: 'TC-VEH-02',
    makeModel: '2012 Nissan Bluebird Sylphy',
    plate: 'KVG-789',
    color: 'Metallic Silver',
    category: 'Executive Sedan',
    dailyRate: 220.0,
    odometer: 118500,
    nextServiceOdo: 123000,
    regoExpiry: '2027-01-20',
    insuranceExpiry: '2027-01-20',
    status: 'On Hire',
    fuelType: 'Petrol',
    notes: 'Fuel-efficient town & hospital executive transport.'
  },
  {
    id: 'TC-VEH-03',
    makeModel: '1996 Isuzu Bighorn Station Wagon',
    plate: 'KVG-195',
    color: 'Polar White',
    category: '7-Seater 4WD Wagon',
    dailyRate: 250.0,
    odometer: 214000,
    nextServiceOdo: 215000,
    regoExpiry: '2026-12-10',
    insuranceExpiry: '2026-12-10',
    status: 'Maintenance',
    fuelType: 'Diesel',
    notes: 'Heavy-duty Boluminski Highway & outer patrol 4WD. Routine 215k service in progress.'
  }
];

const INITIAL_BILLING_DOCS = [
  {
    id: 'TC-RCT-2026-001',
    docType: 'Receipt',
    quoteRef: 'TC-QT-2026-001',
    proformaRef: 'TC-PI-2026-001',
    vraRef: 'TC-VRA-2026-001',
    date: '2026-11-10',
    validUntil: '2026-12-10',
    clientName: 'Kavieng General Hospital (PHA)',
    contactPerson: 'Dr. Michael Kila — Visiting Specialist Coordinator',
    clientPhone: '+675 984 2040',
    clientEmail: 'admin@kaviengpha.gov.pg',
    vehicleId: 'TC-VEH-01',
    hireType: 'Self-Drive',
    startDate: '2026-11-10',
    endDate: '2026-11-15',
    days: 5,
    dailyRate: 250.0,
    extraFees: 50.0,
    extraDesc: 'Kavieng Airport Return Pickup & Drop-off',
    bondAmount: 0,
    status: 'Paid',
    paymentMethod: 'BSP Transfer',
    notes: '5-day visiting medical team transport in Kavieng Town.'
  },
  {
    id: 'TC-PI-2026-002',
    docType: 'Proforma',
    quoteRef: 'TC-QT-2026-002',
    proformaRef: 'TC-PI-2026-002',
    vraRef: 'TC-VRA-2026-002',
    date: '2026-11-16',
    validUntil: '2026-12-16',
    clientName: 'Joelee Thomas',
    contactPerson: 'Joelee Thomas (Private Executive Hire)',
    clientPhone: '+675 7241 8810',
    clientEmail: 'joelee.thomas@gmail.com',
    vehicleId: 'TC-VEH-02',
    hireType: 'Self-Drive',
    startDate: '2026-11-17',
    endDate: '2026-11-21',
    days: 4,
    dailyRate: 220.0,
    extraFees: 0.0,
    extraDesc: '',
    bondAmount: 300.0,
    status: 'Part-Paid',
    paymentMethod: 'BSP Transfer',
    notes: 'Deposit K500 received via BSP; balance K380 + K300 bond due on return.'
  },
  {
    id: 'TC-QT-2026-003',
    docType: 'Quote',
    quoteRef: 'TC-QT-2026-003',
    proformaRef: '',
    vraRef: '',
    date: '2026-11-18',
    validUntil: '2026-12-18',
    clientName: 'Murat Local Level Government (LLG)',
    contactPerson: 'Hon. Ward Council & LLG Manager',
    clientPhone: '+675 7910 3342',
    clientEmail: 'muratllg.nip@gmail.com',
    vehicleId: 'TC-VEH-01',
    hireType: 'Chauffeur-Driven',
    startDate: '2026-11-24',
    endDate: '2026-12-01',
    days: 7,
    dailyRate: 250.0,
    extraFees: 150.0,
    extraDesc: 'Kavieng Wharf & Airport Coordination Transfer',
    bondAmount: 0,
    status: 'Pending',
    paymentMethod: 'BSP Transfer',
    notes: '7-day official LLG administration transport while delegation is in Kavieng.'
  },
  {
    id: 'TC-RCT-2026-002',
    docType: 'Receipt',
    quoteRef: 'TC-QT-2026-000',
    proformaRef: 'TC-PI-2026-000',
    vraRef: 'TC-VRA-2026-000',
    date: '2026-11-02',
    validUntil: '2026-12-02',
    clientName: 'New Ireland Provincial Works & Health Audit Team',
    contactPerson: 'Sarah Boas — Field Logistics Officer',
    clientPhone: '+675 7188 4920',
    clientEmail: 'sboas.audit@png.gov.pg',
    vehicleId: 'TC-VEH-03',
    hireType: 'Self-Drive',
    startDate: '2026-11-02',
    endDate: '2026-11-06',
    days: 4,
    dailyRate: 250.0,
    extraFees: 0.0,
    extraDesc: '',
    bondAmount: 0,
    status: 'Paid',
    paymentMethod: 'EFTPOS',
    notes: 'Boluminski Highway field inspection run.'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-2026-001',
    date: '2026-11-10',
    docRef: 'TC-RCT-2026-001',
    clientName: 'Kavieng General Hospital (PHA)',
    vehicleId: 'TC-VEH-01',
    amountPaid: 1300.0,
    bondCollected: 0.0,
    method: 'BSP Transfer',
    accountDeposited: 'BSP Acc # 1001252316',
    referenceNo: 'BSP-TXN-884910',
    status: 'Paid'
  },
  {
    id: 'PAY-2026-002',
    date: '2026-11-17',
    docRef: 'TC-PI-2026-002',
    clientName: 'Joelee Thomas',
    vehicleId: 'TC-VEH-02',
    amountPaid: 500.0,
    bondCollected: 300.0,
    method: 'BSP Transfer',
    accountDeposited: 'BSP Acc # 1001252316',
    referenceNo: 'BSP-TXN-890124',
    status: 'Part-Paid'
  },
  {
    id: 'PAY-2026-003',
    date: '2026-11-02',
    docRef: 'TC-RCT-2026-002',
    clientName: 'New Ireland Provincial Works & Health Audit Team',
    vehicleId: 'TC-VEH-03',
    amountPaid: 1000.0,
    bondCollected: 0.0,
    method: 'EFTPOS',
    accountDeposited: 'BSP Acc # 1001252316',
    referenceNo: 'EFT-KVG-4412',
    status: 'Paid'
  }
];

const INITIAL_EXPENSES = [
  {
    id: 'EXP-2026-001',
    date: '2026-11-15',
    vehicleId: 'TC-VEH-01',
    category: 'Fuel',
    vendor: 'Puma Energy Kavieng Service Station',
    description: 'Full tank top-up post-hospital hire (42.5L @ K4.40/L)',
    litres: 42.5,
    odometer: 149250,
    prevOdometer: 148780,
    amount: 187.0,
    receiptNo: 'PUMA-9921'
  },
  {
    id: 'EXP-2026-002',
    date: '2026-11-12',
    vehicleId: 'TC-VEH-03',
    category: 'Routine Service',
    vendor: 'Kavieng Auto & Marine Workshop',
    description: '15W-40 Diesel engine oil, oil filter, fuel filter & grease',
    litres: 0,
    odometer: 214000,
    prevOdometer: 0,
    amount: 485.0,
    receiptNo: 'KAM-304'
  },
  {
    id: 'EXP-2026-003',
    date: '2026-11-08',
    vehicleId: 'TC-VEH-02',
    category: 'Tyres & Alignment',
    vendor: 'Ela Motors Kavieng Parts',
    description: 'Front wheel alignment, balancing & puncture repair',
    litres: 0,
    odometer: 118200,
    prevOdometer: 0,
    amount: 210.0,
    receiptNo: 'ELA-7712'
  },
  {
    id: 'EXP-2026-004',
    date: '2026-11-01',
    vehicleId: 'TC-VEH-01',
    category: 'Rego & MVIL',
    vendor: 'MVIL / Traffic Registry Kavieng',
    description: 'Commercial Hire Third-Party MVIL & Safety Sticker Renewal',
    litres: 0,
    odometer: 148500,
    prevOdometer: 0,
    amount: 640.0,
    receiptNo: 'MVIL-88201'
  }
];

// ============================================================================
// UTILITY FUNCTIONS (PGK FORMATTING, AMOUNT IN WORDS, CSV EXPORT)
// ============================================================================
const formatPGK = (val) => {
  const num = Number(val) || 0;
  return `K ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const calcDocTotals = (doc) => {
  const base = (Number(doc.days) || 0) * (Number(doc.dailyRate) || 0);
  const gross = base + (Number(doc.extraFees) || 0);
  const subtotalExcl = gross / 1.1;
  const gst = gross - subtotalExcl;
  return { base, gross, subtotalExcl, gst };
};

const numberToWordsPGK = (amount) => {
  const num = Math.floor(Number(amount) || 0);
  const toea = Math.round(((Number(amount) || 0) - num) * 100);
  if (num === 0) return 'Zero Kina Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertHundreds = (n) => {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n < 20) {
      str += teens[n - 10] + ' ';
    } else {
      if (n >= 20) {
        str += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        str += ones[n] + ' ';
      }
    }
    return str.trim();
  };

  let words = '';
  if (num >= 1000) {
    words += convertHundreds(Math.floor(num / 1000)) + ' Thousand ';
    const rem = num % 1000;
    if (rem > 0) words += convertHundreds(rem);
  } else {
    words = convertHundreds(num);
  }

  const toeaText = toea > 0 ? ` and ${toea}/100 Toea` : '';
  return `${words.trim()} Kina${toeaText} Only`;
};

const exportToCSV = (filename, rows) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const val = r[h] === null || r[h] === undefined ? '' : String(r[h]).replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ============================================================================
// CUSTOM SVG EMBLEM FOR TUNZ CARS (STEERING WHEEL + TC + WING IN NAVY/GOLD/RED)
// ============================================================================
const TunzCarsLogoSVG = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3E5AB" />
        <stop offset="50%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#8C6D23" />
      </linearGradient>
      <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2B3A52" />
        <stop offset="100%" stopColor="#162238" />
      </linearGradient>
      <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9E2A2B" />
        <stop offset="100%" stopColor="#D9534F" />
      </linearGradient>
    </defs>

    {/* Outer Motion Arcs */}
    <path d="M22 36 A 46 46 0 0 0 22 84" stroke="url(#crimsonGrad)" strokeWidth="3" strokeLinecap="round" />
    <path d="M98 36 A 46 46 0 0 1 98 84" stroke="url(#crimsonGrad)" strokeWidth="3" strokeLinecap="round" />

    {/* Steering Wheel Outer Rim */}
    <circle cx="60" cy="60" r="38" stroke="url(#navyGrad)" strokeWidth="9" />
    <circle cx="60" cy="60" r="38" stroke="url(#goldGrad)" strokeWidth="1.2" strokeDasharray="18 24" />

    {/* Steering Wheel Spokes */}
    <path d="M24 60 H42" stroke="url(#navyGrad)" strokeWidth="8" strokeLinecap="round" />
    <path d="M60 78 V95" stroke="url(#navyGrad)" strokeWidth="8" strokeLinecap="round" />

    {/* TC Brushed Gold Monogram */}
    <text
      x="34"
      y="70"
      fill="url(#goldGrad)"
      fontFamily="Georgia, serif"
      fontWeight="bold"
      fontSize="36"
      letterSpacing="-2"
    >
      TC
    </text>

    {/* Crimson & Gold Speed Wing Accent on Right */}
    <path d="M84 54 Q 104 52 114 42 Q 102 58 84 60 Z" fill="url(#crimsonGrad)" />
    <path d="M84 61 Q 102 60 110 53 Q 99 65 84 66 Z" fill="url(#goldGrad)" />
    <path d="M84 67 Q 98 67 105 62 Q 96 71 84 71 Z" fill="url(#crimsonGrad)" />

    {/* Gold Swoosh Tying T and C */}
    <path
      d="M18 72 C 32 86, 56 82, 65 64"
      stroke="url(#goldGrad)"
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// ============================================================================
// STATUS BADGE HELPER
// ============================================================================
const StatusBadge = ({ status }) => {
  const styles = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'On Hire': 'bg-amber-50 text-amber-800 border-amber-200',
    Maintenance: 'bg-rose-50 text-rose-700 border-rose-200',
    Reserved: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Part-Paid': 'bg-amber-50 text-amber-800 border-amber-200',
    Pending: 'bg-slate-100 text-slate-700 border-slate-300',
    Quote: 'bg-sky-50 text-sky-800 border-sky-200',
    Proforma: 'bg-amber-50 text-amber-800 border-amber-200',
    Receipt: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Persistent State via localStorage
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('tunz_cars_vehicles_v1');
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [billingDocs, setBillingDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('tunz_cars_billing_v1');
      return saved ? JSON.parse(saved) : INITIAL_BILLING_DOCS;
    } catch {
      return INITIAL_BILLING_DOCS;
    }
  });

  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('tunz_cars_payments_v1');
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('tunz_cars_expenses_v1');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tunz_cars_vehicles_v1', JSON.stringify(vehicles));
      localStorage.setItem('tunz_cars_billing_v1', JSON.stringify(billingDocs));
      localStorage.setItem('tunz_cars_payments_v1', JSON.stringify(payments));
      localStorage.setItem('tunz_cars_expenses_v1', JSON.stringify(expenses));
    } catch (err) {
      console.error('Storage persistence warning:', err);
    }
  }, [vehicles, billingDocs, payments, expenses]);

  // Toast Notification Banner
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals State
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPrefillDoc, setPaymentPrefillDoc] = useState(null);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filters
  const [docFilterType, setDocFilterType] = useState('All');
  const [docSearch, setDocSearch] = useState('');
  const [expenseFilterCat, setExpenseFilterCat] = useState('All');
  const [expenseFilterVeh, setExpenseFilterVeh] = useState('All');
  const [scheduleStartDate, setScheduleStartDate] = useState('2026-11-10');

  // ============================================================================
  // COMPUTED DASHBOARD METRICS & ANALYTICS
  // ============================================================================
  const metrics = useMemo(() => {
    const activeFleetCount = vehicles.length;
    const availableCount = vehicles.filter((v) => v.status === 'Available').length;
    const onHireCount = vehicles.filter((v) => v.status === 'On Hire').length;
    const maintenanceCount = vehicles.filter((v) => v.status === 'Maintenance').length;

    // Confirmed bookings (Proformas & Receipts)
    const confirmedDocs = billingDocs.filter((d) => d.docType === 'Proforma' || d.docType === 'Receipt');
    const totalRentalDays = confirmedDocs.reduce((acc, d) => acc + (Number(d.days) || 0), 0);
    const grossRevenue = confirmedDocs.reduce((acc, d) => acc + calcDocTotals(d).gross, 0);
    const gstCollected = confirmedDocs.reduce((acc, d) => acc + calcDocTotals(d).gst, 0);

    const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);
    const totalBondsHeld = payments.reduce((acc, p) => acc + (Number(p.bondCollected) || 0), 0);
    const unpaidReceivables = Math.max(0, grossRevenue - totalCollected);

    const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const netFleetProfit = totalCollected - totalExpenses;

    // Vehicle-by-vehicle breakdown
    const byVehicle = vehicles.map((v) => {
      const vDocs = confirmedDocs.filter((d) => d.vehicleId === v.id);
      const rev = vDocs.reduce((s, d) => s + calcDocTotals(d).gross, 0);
      const days = vDocs.reduce((s, d) => s + (Number(d.days) || 0), 0);
      const exp = expenses.filter((e) => e.vehicleId === v.id).reduce((s, e) => s + (Number(e.amount) || 0), 0);
      return {
        ...v,
        revenue: rev,
        daysBooked: days,
        expenses: exp,
        net: rev - exp
      };
    });

    // Expense breakdown by category
    const categories = ['Fuel', 'Routine Service', 'Repairs & Parts', 'Tyres & Alignment', 'Rego & MVIL'];
    const byCategory = categories.map((cat) => {
      const sum = expenses.filter((e) => e.category === cat).reduce((s, e) => s + (Number(e.amount) || 0), 0);
      return { category: cat, amount: sum };
    });

    return {
      activeFleetCount,
      availableCount,
      onHireCount,
      maintenanceCount,
      totalRentalDays,
      grossRevenue,
      gstCollected,
      totalCollected,
      totalBondsHeld,
      unpaidReceivables,
      totalExpenses,
      netFleetProfit,
      byVehicle,
      byCategory
    };
  }, [vehicles, billingDocs, payments, expenses]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================
  const handleResetDemoData = () => {
    setVehicles(INITIAL_VEHICLES);
    setBillingDocs(INITIAL_BILLING_DOCS);
    setPayments(INITIAL_PAYMENTS);
    setExpenses(INITIAL_EXPENSES);
    setShowResetConfirm(false);
    showToast('Demo data restored to original Kavieng fleet records.');
  };

  const handleToggleVehicleStatus = (vehId, newStatus) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehId ? { ...v, status: newStatus } : v)));
    showToast(`Vehicle ${vehId} status updated to ${newStatus}.`);
  };

  const handleSaveVehicle = (formObj) => {
    if (editingVehicle) {
      setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...formObj } : v)));
      showToast(`Updated ${formObj.makeModel} (${formObj.id}).`);
    } else {
      const nextNum = String(vehicles.length + 1).padStart(2, '0');
      const newVeh = {
        ...formObj,
        id: formObj.id || `TC-VEH-${nextNum}`
      };
      setVehicles((prev) => [...prev, newVeh]);
      showToast(`Added ${newVeh.makeModel} to Tunz Cars fleet.`);
    }
    setShowVehicleModal(false);
    setEditingVehicle(null);
  };

  const checkDateOverlap = (vehicleId, startStr, endStr, excludeDocId = null) => {
    if (!startStr || !endStr) return null;
    const s1 = new Date(startStr).getTime();
    const e1 = new Date(endStr).getTime();
    return billingDocs.find((d) => {
      if (d.id === excludeDocId) return false;
      if (d.vehicleId !== vehicleId) return false;
      if (d.docType === 'Quote') return false; // Quotes don't lock the calendar until converted
      const s2 = new Date(d.startDate).getTime();
      const e2 = new Date(d.endDate).getTime();
      return s1 <= e2 && e1 >= s2;
    });
  };

  const handleSaveBillingDoc = (formObj) => {
    // Check double booking for Proforma or Receipt
    if (formObj.docType !== 'Quote') {
      const conflict = checkDateOverlap(formObj.vehicleId, formObj.startDate, formObj.endDate, editingDoc?.id);
      if (conflict) {
        showToast(
          `Schedule Conflict: ${formObj.vehicleId} is already booked (${conflict.startDate} to ${conflict.endDate}) under ${conflict.id}!`,
          'error'
        );
        return;
      }
    }

    if (editingDoc) {
      setBillingDocs((prev) => prev.map((d) => (d.id === editingDoc.id ? { ...d, ...formObj } : d)));
      showToast(`Updated document ${editingDoc.id}.`);
    } else {
      const prefix =
        formObj.docType === 'Quote' ? 'TC-QT-2026-' : formObj.docType === 'Proforma' ? 'TC-PI-2026-' : 'TC-RCT-2026-';
      const count = billingDocs.filter((d) => d.docType === formObj.docType).length + 1;
      const newId = `${prefix}${String(count).padStart(3, '0')}`;
      const newDoc = {
        ...formObj,
        id: newId,
        quoteRef: formObj.docType === 'Quote' ? newId : formObj.quoteRef || '',
        proformaRef: formObj.docType === 'Proforma' ? newId : formObj.proformaRef || '',
        vraRef: formObj.docType !== 'Quote' ? `TC-VRA-2026-${String(count).padStart(3, '0')}` : ''
      };
      setBillingDocs((prev) => [newDoc, ...prev]);

      // If created directly as Receipt, also log payment automatically
      if (formObj.docType === 'Receipt') {
        const totals = calcDocTotals(newDoc);
        const newPay = {
          id: `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`,
          date: formObj.date,
          docRef: newId,
          clientName: formObj.clientName,
          vehicleId: formObj.vehicleId,
          amountPaid: totals.gross,
          bondCollected: Number(formObj.bondAmount) || 0,
          method: formObj.paymentMethod || 'BSP Transfer',
          accountDeposited: `BSP Acc # ${COMPANY_INFO.bspAccount}`,
          referenceNo: 'AUTO-RCT',
          status: 'Paid'
        };
        setPayments((prev) => [newPay, ...prev]);
      }

      showToast(`Created ${formObj.docType} ${newId}.`);
    }

    setShowDocModal(false);
    setEditingDoc(null);
  };

  const handleConvertQuoteToProforma = (doc) => {
    const conflict = checkDateOverlap(doc.vehicleId, doc.startDate, doc.endDate, doc.id);
    if (conflict) {
      showToast(
        `Cannot convert: ${doc.vehicleId} is already booked (${conflict.startDate} to ${conflict.endDate}) on ${conflict.id}.`,
        'error'
      );
      return;
    }
    const piCount = billingDocs.filter((d) => d.docType === 'Proforma' || d.proformaRef).length + 1;
    const newPiId = `TC-PI-2026-${String(piCount).padStart(3, '0')}`;
    const newVraId = `TC-VRA-2026-${String(piCount).padStart(3, '0')}`;

    setBillingDocs((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? {
              ...d,
              id: newPiId,
              docType: 'Proforma',
              quoteRef: doc.id,
              proformaRef: newPiId,
              vraRef: newVraId,
              status: 'Pending'
            }
          : d
      )
    );
    showToast(`Converted ${doc.id} into Proforma Invoice ${newPiId} & locked vehicle schedule.`);
  };

  const handleLogPayment = (payForm) => {
    const newPayId = `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`;
    const newPayment = {
      ...payForm,
      id: newPayId,
      accountDeposited: `BSP Acc # ${COMPANY_INFO.bspAccount}`
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Update linked billing doc if selected
    if (payForm.docRef) {
      const targetDoc = billingDocs.find((d) => d.id === payForm.docRef);
      if (targetDoc) {
        const totals = calcDocTotals(targetDoc);
        const priorPaid = payments
          .filter((p) => p.docRef === targetDoc.id)
          .reduce((s, p) => s + (Number(p.amountPaid) || 0), 0);
        const totalNowPaid = priorPaid + (Number(payForm.amountPaid) || 0);
        const isFull = totalNowPaid >= totals.gross - 0.01;

        const rctCount = billingDocs.filter((d) => d.docType === 'Receipt').length + 1;
        const newRctId = isFull ? `TC-RCT-2026-${String(rctCount).padStart(3, '0')}` : targetDoc.id;

        setBillingDocs((prev) =>
          prev.map((d) =>
            d.id === targetDoc.id
              ? {
                  ...d,
                  id: newRctId,
                  docType: isFull ? 'Receipt' : d.docType,
                  proformaRef: d.proformaRef || d.id,
                  status: isFull ? 'Paid' : 'Part-Paid',
                  paymentMethod: payForm.method
                }
              : d
          )
        );

        // Also update payment's docRef to the new Receipt ID if upgraded
        if (isFull) {
          setPayments((prev) => prev.map((p) => (p.docRef === targetDoc.id ? { ...p, docRef: newRctId } : p)));
          showToast(`Full payment logged! Issued Official Receipt ${newRctId}.`);
        } else {
          showToast(`Partial payment of ${formatPGK(payForm.amountPaid)} recorded against ${targetDoc.id}.`);
        }
      }
    } else {
      showToast(`Payment ${newPayId} recorded (${formatPGK(payForm.amountPaid)}).`);
    }

    setShowPaymentModal(false);
    setPaymentPrefillDoc(null);
  };

  const handleSaveExpense = (expForm) => {
    const newExp = {
      ...expForm,
      id: `EXP-2026-${String(expenses.length + 1).padStart(3, '0')}`
    };
    setExpenses((prev) => [newExp, ...prev]);

    // Update vehicle odometer if higher than current
    if (Number(expForm.odometer) > 0) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === expForm.vehicleId && Number(expForm.odometer) > v.odometer
            ? { ...v, odometer: Number(expForm.odometer) }
            : v
        )
      );
    }

    showToast(`Logged ${expForm.category} expense (${formatPGK(expForm.amount)}) for ${expForm.vehicleId}.`);
    setShowExpenseModal(false);
  };

  // Filtered Lists
  const filteredDocs = useMemo(() => {
    return billingDocs.filter((d) => {
      const matchesType = docFilterType === 'All' || d.docType === docFilterType;
      const q = docSearch.toLowerCase();
      const matchesSearch =
        !q ||
        d.id.toLowerCase().includes(q) ||
        d.clientName.toLowerCase().includes(q) ||
        d.vehicleId.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [billingDocs, docFilterType, docSearch]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesCat = expenseFilterCat === 'All' || e.category === expenseFilterCat;
      const matchesVeh = expenseFilterVeh === 'All' || e.vehicleId === expenseFilterVeh;
      return matchesCat && matchesVeh;
    });
  }, [expenses, expenseFilterCat, expenseFilterVeh]);

  // 14-day schedule window columns
  const scheduleDays = useMemo(() => {
    const arr = [];
    const base = new Date(scheduleStartDate || '2026-11-10');
    for (let i = 0; i < 14; i++) {
      const dt = new Date(base);
      dt.setDate(base.getDate() + i);
      arr.push(dt.toISOString().slice(0, 10));
    }
    return arr;
  }, [scheduleStartDate]);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#162238] font-sans flex flex-col">
      {/* PRINT STYLES FOR OFFICIAL DOCUMENT PREVIEW */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-document, #printable-document * { visibility: visible; }
          #printable-document {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 16px !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-[#9E2A2B] text-white border-red-800'
              : 'bg-[#162238] text-white border-[#9A7B3E]'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* TOP EXECUTIVE HEADER */}
      <header className="bg-[#162238] text-white border-b-4 border-[#9A7B3E] shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand Logo & Holding Entity Info */}
          <div className="flex items-center gap-3.5">
            <div className="bg-white/95 p-1.5 rounded-xl shadow-inner border border-[#D4AF37]/40">
              <TunzCarsLogoSVG size={46} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  TUNZ <span className="text-[#D4AF37]">CARS</span>
                </h1>
                <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#2B3A52] text-[#F3E5AB] border border-[#9A7B3E]/50">
                  {COMPANY_INFO.parent}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>IPA Reg: <strong className="text-white">{COMPANY_INFO.ipaReg}</strong></span>
                <span>•</span>
                <span>IRC TIN: <strong className="text-white">{COMPANY_INFO.ircTin}</strong></span>
                <span>•</span>
                <span>BSP Kavieng: <strong className="text-[#D4AF37]">{COMPANY_INFO.bspAccount}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingDoc(null);
                setShowDocModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9A7B3E] hover:bg-[#b08d47] text-white text-xs sm:text-sm font-semibold shadow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Quote / Invoice
            </button>
            <button
              onClick={() => {
                setPaymentPrefillDoc(null);
                setShowPaymentModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2B3A52] hover:bg-[#374a68] text-white border border-slate-600 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              Log Payment
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset Demo Data"
              className="p-2 rounded-lg bg-[#2B3A52]/70 hover:bg-[#9E2A2B] text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <nav className="bg-[#2B3A52]/90 border-t border-slate-700/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 py-1.5">
            {[
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'fleet', label: 'Fleet & Car Schedules', icon: Car },
              { id: 'billing', label: 'Quotes, Invoices & Receipts', icon: FileText },
              { id: 'payments', label: 'Payments Ledger', icon: CreditCard },
              { id: 'expenses', label: 'Fuel & Maintenance', icon: Fuel }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#162238] text-[#D4AF37] shadow-sm border border-[#9A7B3E]/60'
                      : 'text-slate-200 hover:bg-[#162238]/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-300'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ====================================================================
            TAB 1: EXECUTIVE DASHBOARD
        ==================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Revenue (GST Incl.)</span>
                  <div className="p-2 rounded-lg bg-[#162238]/5 text-[#162238]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#162238] mt-2">{formatPGK(metrics.grossRevenue)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Across <strong className="text-[#162238]">{metrics.totalRentalDays} rental days</strong> • 10% GST:{' '}
                  <span className="font-semibold text-[#9A7B3E]">{formatPGK(metrics.gstCollected)}</span>
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Collected vs. Receivables</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-emerald-700 mt-2">{formatPGK(metrics.totalCollected)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Unpaid Balance:{' '}
                  <strong className={metrics.unpaidReceivables > 0 ? 'text-[#9E2A2B]' : 'text-slate-700'}>
                    {formatPGK(metrics.unpaidReceivables)}
                  </strong>{' '}
                  • Bonds: {formatPGK(metrics.totalBondsHeld)}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fuel & Operating Expenses</span>
                  <div className="p-2 rounded-lg bg-rose-50 text-[#9E2A2B]">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#9E2A2B] mt-2">{formatPGK(metrics.totalExpenses)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Net Cash Surplus:{' '}
                  <strong className="text-[#162238]">{formatPGK(metrics.netFleetProfit)}</strong>
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Fleet Status</span>
                  <div className="p-2 rounded-lg bg-amber-50 text-[#9A7B3E]">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-[#162238] mt-2">
                  {metrics.availableCount} <span className="text-sm font-semibold text-slate-500">/ {metrics.activeFleetCount} Ready</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="text-amber-700 font-semibold">{metrics.onHireCount} On Hire</span> •{' '}
                  <span className="text-[#9E2A2B] font-semibold">{metrics.maintenanceCount} Maintenance</span>
                </p>
              </div>
            </div>

            {/* FLEET QUICK STATUS CARDS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#162238]">Kavieng Fleet Live Availability & Quick Status</h2>
                  <p className="text-xs text-slate-500">Toggle live vehicle availability or jump directly to booking schedules.</p>
                </div>
                <button
                  onClick={() => setActiveTab('fleet')}
                  className="text-xs font-semibold text-[#9A7B3E] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Open Full Fleet & Calendar <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metrics.byVehicle.map((v) => {
                  const kmToService = v.nextServiceOdo - v.odometer;
                  return (
                    <div
                      key={v.id}
                      className="rounded-xl border border-slate-200 bg-[#F7F6F2]/60 p-4 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A7B3E]">
                              {v.id} • {v.plate}
                            </span>
                            <h3 className="font-bold text-[#162238] text-sm mt-0.5">{v.makeModel}</h3>
                            <p className="text-xs text-slate-500">{v.color} • {v.category}</p>
                          </div>
                          <StatusBadge status={v.status} />
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 block">Daily Hire Rate</span>
                            <strong className="text-[#162238]">{formatPGK(v.dailyRate)}/day</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Odometer / Service</span>
                            <strong className={kmToService <= 1500 ? 'text-[#9E2A2B]' : 'text-[#162238]'}>
                              {v.odometer.toLocaleString()} km
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                        <select
                          value={v.status}
                          onChange={(e) => handleToggleVehicleStatus(v.id, e.target.value)}
                          className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-[#162238] focus:outline-none focus:border-[#9A7B3E]"
                        >
                          <option value="Available">Available</option>
                          <option value="On Hire">On Hire</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Reserved">Reserved</option>
                        </select>
                        <button
                          onClick={() => {
                            setEditingDoc({
                              docType: 'Quote',
                              date: new Date().toISOString().slice(0, 10),
                              validUntil: '2026-12-18',
                              clientName: '',
                              contactPerson: '',
                              clientPhone: '',
                              clientEmail: '',
                              vehicleId: v.id,
                              hireType: 'Self-Drive',
                              startDate: '2026-11-20',
                              endDate: '2026-11-23',
                              days: 3,
                              dailyRate: v.dailyRate,
                              extraFees: 0,
                              extraDesc: '',
                              bondAmount: 0,
                              status: 'Pending',
                              paymentMethod: 'BSP Transfer',
                              notes: ''
                            });
                            setShowDocModal(true);
                          }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#162238] text-white hover:bg-[#2B3A52] transition cursor-pointer"
                        >
                          Book Vehicle
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VISUAL CHARTS & ALERTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue vs Expenses by Vehicle Bar Visualization */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-[#162238]">Vehicle Financial Performance (PGK)</h2>
                <p className="text-xs text-slate-500 mb-4">Confirmed rental revenue vs. fuel & maintenance expenses per unit</p>

                <div className="space-y-4">
                  {metrics.byVehicle.map((v) => {
                    const maxVal = Math.max(
                      1500,
                      ...metrics.byVehicle.map((item) => Math.max(item.revenue, item.expenses))
                    );
                    const revPct = Math.min(100, Math.round((v.revenue / maxVal) * 100));
                    const expPct = Math.min(100, Math.round((v.expenses / maxVal) * 100));

                    return (
                      <div key={v.id} className="p-3.5 rounded-xl bg-[#F7F6F2] border border-slate-200/80">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="font-bold text-sm text-[#162238]">{v.makeModel}</span>
                            <span className="text-xs text-slate-500 ml-2">({v.id} • {v.daysBooked} days booked)</span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              v.net >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Net: {formatPGK(v.net)}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-600 font-medium">Confirmed Revenue</span>
                              <span className="font-bold text-[#162238]">{formatPGK(v.revenue)}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-[#162238] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${revPct}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-600 font-medium">Fuel & Maintenance</span>
                              <span className="font-bold text-[#9E2A2B]">{formatPGK(v.expenses)}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-[#9E2A2B] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${expPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expense Category Breakdown & Service Alerts */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-base font-bold text-[#162238]">Expense Breakdown</h2>
                  <p className="text-xs text-slate-500 mb-3">Operating outflows by cost category</p>
                  <div className="space-y-2.5">
                    {metrics.byCategory.map((c) => {
                      const pct =
                        metrics.totalExpenses > 0 ? Math.round((c.amount / metrics.totalExpenses) * 100) : 0;
                      return (
                        <div key={c.category} className="text-xs">
                          <div className="flex justify-between font-medium mb-1">
                            <span className="text-slate-700">{c.category}</span>
                            <span className="font-bold text-[#162238]">
                              {formatPGK(c.amount)} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-[#9A7B3E] h-2 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compliance & Service Alerts */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-base font-bold text-[#162238] flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-[#9E2A2B]" />
                    Fleet & Service Alerts
                  </h2>
                  <div className="space-y-2.5 text-xs">
                    {vehicles.map((v) => {
                      const kmLeft = v.nextServiceOdo - v.odometer;
                      const isDue = kmLeft <= 1500;
                      return (
                        <div
                          key={v.id}
                          className={`p-3 rounded-lg border ${
                            isDue
                              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="font-bold flex justify-between">
                            <span>{v.id} — {v.makeModel}</span>
                            <span>{isDue ? 'SERVICE DUE' : 'OK'}</span>
                          </div>
                          <p className="mt-1">
                            Next service in <strong>{kmLeft.toLocaleString()} km</strong> (at{' '}
                            {v.nextServiceOdo.toLocaleString()} km) • Rego Exp: <strong>{v.regoExpiry}</strong>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 2: FLEET REGISTRY & CAR SCHEDULES
        ==================================================================== */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#162238]">Fleet Registry & Booking Calendar</h2>
                <p className="text-xs text-slate-600">
                  Manage vehicle specs, odometers, MVIL/Rego expiry dates, and prevent double-bookings across Kavieng.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportToCSV('Tunz_Cars_Fleet_Registry.csv', vehicles)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#162238] hover:bg-slate-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Fleet CSV
                </button>
                <button
                  onClick={() => {
                    setEditingVehicle(null);
                    setShowVehicleModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#162238] text-white text-xs font-semibold hover:bg-[#2B3A52] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Vehicle
                </button>
              </div>
            </div>

            {/* VISUAL CAR SCHEDULE TIMELINE (14-DAY MATRIX) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#162238] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#9A7B3E]" />
                    14-Day Car Schedule & Availability Timeline
                  </h3>
                  <p className="text-xs text-slate-500">
                    Confirmed Proforma Invoices & Paid Receipts automatically lock dates to prevent double-booking.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <label className="font-semibold text-slate-600">Start Date:</label>
                  <input
                    type="date"
                    value={scheduleStartDate}
                    onChange={(e) => setScheduleStartDate(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[820px]">
                  <thead>
                    <tr className="bg-[#162238] text-white">
                      <th className="p-2.5 text-left font-bold border border-slate-700 w-48">Vehicle</th>
                      {scheduleDays.map((day) => (
                        <th key={day} className="p-1.5 text-center font-semibold border border-slate-700">
                          <div>{day.slice(5)}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b border-slate-200">
                        <td className="p-2.5 bg-[#F7F6F2] border border-slate-200">
                          <div className="font-bold text-[#162238]">{v.id}</div>
                          <div className="text-[11px] text-slate-600 truncate max-w-[170px]">{v.makeModel}</div>
                        </td>
                        {scheduleDays.map((day) => {
                          const booking = billingDocs.find(
                            (d) =>
                              d.vehicleId === v.id &&
                              d.docType !== 'Quote' &&
                              day >= d.startDate &&
                              day <= d.endDate
                          );
                          const isMaint = v.status === 'Maintenance' && !booking;

                          return (
                            <td
                              key={day}
                              onClick={() => {
                                if (booking) {
                                  setPreviewDoc(booking);
                                } else {
                                  setEditingDoc({
                                    docType: 'Proforma',
                                    date: new Date().toISOString().slice(0, 10),
                                    validUntil: '2026-12-18',
                                    clientName: '',
                                    contactPerson: '',
                                    clientPhone: '',
                                    clientEmail: '',
                                    vehicleId: v.id,
                                    hireType: 'Self-Drive',
                                    startDate: day,
                                    endDate: day,
                                    days: 1,
                                    dailyRate: v.dailyRate,
                                    extraFees: 0,
                                    extraDesc: '',
                                    bondAmount: 0,
                                    status: 'Pending',
                                    paymentMethod: 'BSP Transfer',
                                    notes: ''
                                  });
                                  setShowDocModal(true);
                                }
                              }}
                              title={
                                booking
                                  ? `${booking.id}: ${booking.clientName} (${booking.startDate} to ${booking.endDate})`
                                  : isMaint
                                  ? 'Vehicle in Maintenance'
                                  : `Click to schedule ${v.id} on ${day}`
                              }
                              className={`p-1.5 text-center border border-slate-200 cursor-pointer transition ${
                                booking
                                  ? booking.docType === 'Receipt'
                                    ? 'bg-emerald-600 text-white font-bold hover:bg-emerald-700'
                                    : 'bg-amber-500 text-white font-bold hover:bg-amber-600'
                                  : isMaint
                                  ? 'bg-rose-100 text-rose-700 font-semibold'
                                  : 'bg-white hover:bg-emerald-50 text-slate-400'
                              }`}
                            >
                              {booking ? booking.clientName.slice(0, 4) : isMaint ? 'MNT' : '+'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Paid Booking (Receipt)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Reserved / Proforma Invoice
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 inline-block" /> Workshop Maintenance
                </span>
                <span className="text-slate-400 italic">Tip: Click any open "+" cell to schedule a hire on that date.</span>
              </div>
            </div>

            {/* FLEET REGISTRY TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#162238] text-white uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Vehicle ID & Plate</th>
                      <th className="p-3.5">Make, Model & Specs</th>
                      <th className="p-3.5">Daily Rate (GST Incl.)</th>
                      <th className="p-3.5">Odometer / Next Service</th>
                      <th className="p-3.5">Rego & MVIL Expiry</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {vehicles.map((v) => {
                      const kmRem = v.nextServiceOdo - v.odometer;
                      return (
                        <tr key={v.id} className="hover:bg-[#F7F6F2]/70">
                          <td className="p-3.5">
                            <div className="font-bold text-[#162238]">{v.id}</div>
                            <div className="text-slate-500 font-medium">{v.plate}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#162238]">{v.makeModel}</div>
                            <div className="text-slate-500">
                              {v.color} • {v.category} ({v.fuelType})
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-[#162238]">{formatPGK(v.dailyRate)}</td>
                          <td className="p-3.5">
                            <div className="font-semibold text-[#162238]">{v.odometer.toLocaleString()} km</div>
                            <div className={kmRem <= 1500 ? 'text-[#9E2A2B] font-semibold' : 'text-slate-500'}>
                              Next: {v.nextServiceOdo.toLocaleString()} km ({kmRem.toLocaleString()} km left)
                            </div>
                          </td>
                          <td className="p-3.5 font-medium text-slate-700">{v.regoExpiry}</td>
                          <td className="p-3.5">
                            <StatusBadge status={v.status} />
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                setEditingVehicle(v);
                                setShowVehicleModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-[#162238] hover:bg-slate-100 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: QUOTES, PROFORMA INVOICES & RECEIPTS (BILLING HUB)
        ==================================================================== */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#162238]">Quotes, Proforma Invoices & Official Receipts</h2>
                <p className="text-xs text-slate-600">
                  Seamless workflow: Create Quote (TC-QT) → Convert to Proforma Invoice (TC-PI) → Record Payment & Issue Official Receipt (TC-RCT).
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    exportToCSV(
                      'Tunz_Cars_Billing_Register.csv',
                      billingDocs.map((d) => ({
                        DocID: d.id,
                        Type: d.docType,
                        Date: d.date,
                        Client: d.clientName,
                        Vehicle: d.vehicleId,
                        StartDate: d.startDate,
                        EndDate: d.endDate,
                        Days: d.days,
                        GrossPGK: calcDocTotals(d).gross.toFixed(2),
                        GST_PGK: calcDocTotals(d).gst.toFixed(2),
                        Status: d.status
                      }))
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#162238] hover:bg-slate-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Billing CSV
                </button>
                <button
                  onClick={() => {
                    setEditingDoc(null);
                    setShowDocModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9A7B3E] hover:bg-[#b08d47] text-white text-xs font-semibold shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Document
                </button>
              </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Quote', 'Proforma', 'Receipt'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDocFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      docFilterType === type
                        ? 'bg-[#162238] text-[#D4AF37]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'All' ? 'All Documents' : `${type}s`}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search TC-QT / TC-PI / Client..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#9A7B3E]"
                />
              </div>
            </div>

            {/* BILLING DOCUMENTS TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#162238] text-white uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Document # & Type</th>
                      <th className="p-3.5">Client / Organization</th>
                      <th className="p-3.5">Vehicle & Hire Dates</th>
                      <th className="p-3.5">Total (GST Incl.)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Workflow Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDocs.map((doc) => {
                      const totals = calcDocTotals(doc);
                      const veh = vehicles.find((v) => v.id === doc.vehicleId);
                      return (
                        <tr key={doc.id} className="hover:bg-[#F7F6F2]/70">
                          <td className="p-3.5">
                            <div className="font-bold text-[#162238]">{doc.id}</div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <StatusBadge status={doc.docType} />
                              <span className="text-slate-400">{doc.date}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#162238]">{doc.clientName}</div>
                            <div className="text-slate-500">{doc.contactPerson}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-[#162238]">
                              {doc.vehicleId} {veh ? `— ${veh.makeModel}` : ''}
                            </div>
                            <div className="text-slate-500">
                              {doc.startDate} to {doc.endDate} ({doc.days}d @ {formatPGK(doc.dailyRate)})
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-extrabold text-[#162238]">{formatPGK(totals.gross)}</div>
                            <div className="text-[11px] text-slate-500">GST: {formatPGK(totals.gst)}</div>
                          </td>
                          <td className="p-3.5">
                            <StatusBadge status={doc.status} />
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                              {/* Preview & Print Official Document */}
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#162238] text-white hover:bg-[#2B3A52] font-semibold cursor-pointer"
                                title="Preview & Print Official Tunz Cars Document"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#D4AF37]" /> Print / View
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => {
                                  setEditingDoc(doc);
                                  setShowDocModal(true);
                                }}
                                className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                                title="Edit Document"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Convert Quote -> Proforma Invoice */}
                              {doc.docType === 'Quote' && (
                                <button
                                  onClick={() => handleConvertQuoteToProforma(doc)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer"
                                >
                                  To Proforma <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Record Payment -> Official Receipt */}
                              {doc.docType === 'Proforma' && doc.status !== 'Paid' && (
                                <button
                                  onClick={() => {
                                    setPaymentPrefillDoc(doc);
                                    setShowPaymentModal(true);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer"
                                >
                                  Record Payment <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 4: PAYMENTS LEDGER
        ==================================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#162238]">Payments & Security Bond Ledger</h2>
                <p className="text-xs text-slate-600">
                  Ring-fenced rental collections deposited into <strong>BSP Kavieng Account # {COMPANY_INFO.bspAccount}</strong>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportToCSV('Tunz_Cars_Payments_Ledger.csv', payments)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#162238] hover:bg-slate-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Payments CSV
                </button>
                <button
                  onClick={() => {
                    setPaymentPrefillDoc(null);
                    setShowPaymentModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Log Incoming Payment
                </button>
              </div>
            </div>

            {/* SUMMARY STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500">Total Rental Revenue Collected</span>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">{formatPGK(metrics.totalCollected)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500">Outstanding Receivables (Pending)</span>
                <p className="text-2xl font-extrabold text-[#9E2A2B] mt-1">{formatPGK(metrics.unpaidReceivables)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-500">Refundable Security Bonds Held</span>
                <p className="text-2xl font-extrabold text-[#162238] mt-1">{formatPGK(metrics.totalBondsHeld)}</p>
              </div>
            </div>

            {/* PAYMENTS TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#162238] text-white uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Payment ID & Date</th>
                      <th className="p-3.5">Invoice / Receipt Ref</th>
                      <th className="p-3.5">Client / Payer</th>
                      <th className="p-3.5">Method & BSP Ref</th>
                      <th className="p-3.5">Hire Paid (PGK)</th>
                      <th className="p-3.5">Bond (PGK)</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F7F6F2]/70">
                        <td className="p-3.5">
                          <div className="font-bold text-[#162238]">{p.id}</div>
                          <div className="text-slate-500">{p.date}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-[#9A7B3E]">{p.docRef || 'Direct Deposit'}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-[#162238]">{p.clientName}</div>
                          <div className="text-slate-500">{p.vehicleId}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-[#162238]">{p.method}</div>
                          <div className="text-slate-500">{p.referenceNo || p.accountDeposited}</div>
                        </td>
                        <td className="p-3.5 font-extrabold text-emerald-700">{formatPGK(p.amountPaid)}</td>
                        <td className="p-3.5 font-semibold text-slate-700">{formatPGK(p.bondCollected)}</td>
                        <td className="p-3.5">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 5: FUEL, MAINTENANCE & OPERATING EXPENSES
        ==================================================================== */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#162238]">Fuel, Servicing & Fleet Maintenance Log</h2>
                <p className="text-xs text-slate-600">
                  Track fuel consumption (km/L), workshop oil changes, tyres, and MVIL/Rego renewals per vehicle.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportToCSV('Tunz_Cars_Fuel_Maintenance_Log.csv', expenses)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-[#162238] hover:bg-slate-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Expenses CSV
                </button>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#9E2A2B] hover:bg-red-800 text-white text-xs font-semibold shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Log Fuel / Expense
                </button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Fuel', 'Routine Service', 'Repairs & Parts', 'Tyres & Alignment', 'Rego & MVIL'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setExpenseFilterCat(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      expenseFilterCat === cat
                        ? 'bg-[#162238] text-[#D4AF37]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={expenseFilterVeh}
                  onChange={(e) => setExpenseFilterVeh(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-white"
                >
                  <option value="All">All Vehicles</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} — {v.makeModel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* EXPENSES TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#162238] text-white uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Date & ID</th>
                      <th className="p-3.5">Vehicle</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Vendor & Description</th>
                      <th className="p-3.5">Fuel / Efficiency</th>
                      <th className="p-3.5">Odometer</th>
                      <th className="p-3.5 text-right">Amount (PGK)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredExpenses.map((e) => {
                      const kmDriven =
                        e.category === 'Fuel' && e.odometer > e.prevOdometer && e.prevOdometer > 0
                          ? e.odometer - e.prevOdometer
                          : 0;
                      const kmPerLitre = kmDriven > 0 && e.litres > 0 ? (kmDriven / e.litres).toFixed(1) : null;

                      return (
                        <tr key={e.id} className="hover:bg-[#F7F6F2]/70">
                          <td className="p-3.5">
                            <div className="font-bold text-[#162238]">{e.date}</div>
                            <div className="text-slate-400">{e.id}</div>
                          </td>
                          <td className="p-3.5 font-bold text-[#162238]">{e.vehicleId}</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F7F6F2] border border-slate-300 text-[#162238]">
                              {e.category}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#162238]">{e.vendor}</div>
                            <div className="text-slate-500">{e.description}</div>
                          </td>
                          <td className="p-3.5">
                            {e.category === 'Fuel' && e.litres > 0 ? (
                              <div>
                                <span className="font-semibold text-[#162238]">{e.litres} L</span>
                                {kmPerLitre && (
                                  <span className="ml-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    {kmPerLitre} km/L
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="p-3.5 font-medium text-slate-700">
                            {e.odometer > 0 ? `${Number(e.odometer).toLocaleString()} km` : '—'}
                          </td>
                          <td className="p-3.5 text-right font-extrabold text-[#9E2A2B]">{formatPGK(e.amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================================
          FOOTER
      ====================================================================== */}
      <footer className="bg-[#162238] text-slate-300 text-xs py-4 px-4 sm:px-6 border-t border-slate-800 mt-10 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-white">{COMPANY_INFO.name}</strong> — {COMPANY_INFO.parent} • IPA #{' '}
            {COMPANY_INFO.ipaReg} • IRC TIN: {COMPANY_INFO.ircTin}
          </div>
          <div className="text-slate-400">
            {COMPANY_INFO.locations} • {COMPANY_INFO.phone}
          </div>
        </div>
      </footer>

      {/* ======================================================================
          MODAL 1: CREATE / EDIT QUOTE, PROFORMA INVOICE, OR RECEIPT
      ====================================================================== */}
      {showDocModal && (
        <DocumentFormModal
          vehicles={vehicles}
          initialDoc={editingDoc}
          onClose={() => {
            setShowDocModal(false);
            setEditingDoc(null);
          }}
          onSave={handleSaveBillingDoc}
        />
      )}

      {/* ======================================================================
          MODAL 2: OFFICIAL PRINTABLE DOCUMENT PREVIEW (QUOTE / PROFORMA / RECEIPT)
      ====================================================================== */}
      {previewDoc && (
        <DocumentPrintModal
          doc={previewDoc}
          vehicles={vehicles}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      {/* ======================================================================
          MODAL 3: ADD / EDIT VEHICLE
      ====================================================================== */}
      {showVehicleModal && (
        <VehicleFormModal
          initialVehicle={editingVehicle}
          onClose={() => {
            setShowVehicleModal(false);
            setEditingVehicle(null);
          }}
          onSave={handleSaveVehicle}
        />
      )}

      {/* ======================================================================
          MODAL 4: LOG INCOMING PAYMENT
      ====================================================================== */}
      {showPaymentModal && (
        <PaymentFormModal
          billingDocs={billingDocs}
          vehicles={vehicles}
          prefillDoc={paymentPrefillDoc}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentPrefillDoc(null);
          }}
          onSave={handleLogPayment}
        />
      )}

      {/* ======================================================================
          MODAL 5: LOG FUEL / MAINTENANCE EXPENSE
      ====================================================================== */}
      {showExpenseModal && (
        <ExpenseFormModal
          vehicles={vehicles}
          onClose={() => setShowExpenseModal(false)}
          onSave={handleSaveExpense}
        />
      )}

      {/* ======================================================================
          MODAL 6: RESET DEMO DATA CONFIRMATION
      ====================================================================== */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#162238] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#9E2A2B]" /> Reset Demo Data?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will restore the default Kavieng fleet registry (Subaru XV, Nissan Sylphy, Isuzu Bighorn) and sample
              hospital/LLG billing records. Any custom entries you added will be replaced.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemoData}
                className="px-4 py-2 rounded-lg bg-[#9E2A2B] text-white text-xs font-semibold hover:bg-red-800 cursor-pointer"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: DOCUMENT FORM MODAL (QUOTE / PROFORMA / RECEIPT)
// ============================================================================
function DocumentFormModal({ vehicles, initialDoc, onClose, onSave }) {
  const defaultVeh = vehicles[0] || { id: 'TC-VEH-01', dailyRate: 250 };
  const [form, setForm] = useState(
    initialDoc || {
      docType: 'Quote',
      date: new Date().toISOString().slice(0, 10),
      validUntil: '2026-12-18',
      clientName: '',
      contactPerson: '',
      clientPhone: '',
      clientEmail: '',
      vehicleId: defaultVeh.id,
      hireType: 'Self-Drive',
      startDate: '2026-11-20',
      endDate: '2026-11-23',
      days: 3,
      dailyRate: defaultVeh.dailyRate,
      extraFees: 0,
      extraDesc: '',
      bondAmount: 0,
      status: 'Pending',
      paymentMethod: 'BSP Transfer',
      notes: ''
    }
  );

  // Auto-calculate days when startDate or endDate changes
  const handleDateChange = (field, val) => {
    const next = { ...form, [field]: val };
    if (next.startDate && next.endDate) {
      const s = new Date(next.startDate);
      const e = new Date(next.endDate);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
      next.days = diff > 0 ? diff : 1;
    }
    setForm(next);
  };

  const handleVehicleSelect = (vehId) => {
    const found = vehicles.find((v) => v.id === vehId);
    setForm({
      ...form,
      vehicleId: vehId,
      dailyRate: found ? found.dailyRate : form.dailyRate
    });
  };

  const totals = calcDocTotals(form);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName.trim()) return;
    onSave({
      ...form,
      status: form.docType === 'Receipt' ? 'Paid' : form.status
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="bg-[#162238] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#9A7B3E]">
          <div>
            <h3 className="text-base font-bold">
              {initialDoc?.id ? `Edit Document (${initialDoc.id})` : 'Create New Tunz Cars Billing Document'}
            </h3>
            <p className="text-xs text-slate-300">All rates in PNG Kina (PGK) with automatic 10% GST breakdown</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Document Type & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Document Type</label>
              <select
                value={form.docType}
                onChange={(e) => setForm({ ...form, docType: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-semibold bg-white"
              >
                <option value="Quote">Quotation (TC-QT)</option>
                <option value="Proforma">Proforma Invoice (TC-PI)</option>
                <option value="Receipt">Official Receipt (TC-RCT)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Valid Until</label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Client / Organization Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Kavieng General Hospital / Murat LLG"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Attention / Authorized Officer</label>
              <input
                type="text"
                placeholder="Officer Name & Title"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Client Phone / WhatsApp</label>
              <input
                type="text"
                placeholder="+675 ..."
                value={form.clientPhone}
                onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Client Email</label>
              <input
                type="email"
                placeholder="client@organization.pg"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Vehicle & Rental Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Assigned Vehicle</label>
              <select
                value={form.vehicleId}
                onChange={(e) => handleVehicleSelect(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-semibold bg-white"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} — {v.makeModel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Hire Start Date</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Hire End Date</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Pricing & Extras */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Rental Days</label>
              <input
                type="number"
                min="1"
                required
                value={form.days}
                onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Daily Rate (K)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.dailyRate}
                onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Extra Fees (K)</label>
              <input
                type="number"
                step="0.01"
                value={form.extraFees}
                onChange={(e) => setForm({ ...form, extraFees: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Hire Mode</label>
              <select
                value={form.hireType}
                onChange={(e) => setForm({ ...form, hireType: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="Self-Drive">Self-Drive</option>
                <option value="Chauffeur-Driven">Chauffeur-Driven</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Extra Fee Description (Airport / Fuel / Driver)</label>
              <input
                type="text"
                placeholder="e.g., Kavieng Airport Return Transfer"
                value={form.extraDesc}
                onChange={(e) => setForm({ ...form, extraDesc: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Notes / Booking Reference</label>
              <input
                type="text"
                placeholder="Optional internal or LPO notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* LIVE PGK TOTALS PREVIEW BOX */}
          <div className="bg-[#F7F6F2] rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-slate-500 block">Subtotal (Excl. GST)</span>
              <strong className="text-sm text-[#162238]">{formatPGK(totals.subtotalExcl)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">10% PNG GST Included</span>
              <strong className="text-sm text-[#9A7B3E]">{formatPGK(totals.gst)}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Gross Total Payable (PGK)</span>
              <strong className="text-lg font-extrabold text-[#162238]">{formatPGK(totals.gross)}</strong>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#162238] text-white font-semibold hover:bg-[#2B3A52] cursor-pointer"
            >
              Save {form.docType}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: PRINTABLE OFFICIAL TUNZ CARS DOCUMENT PREVIEW MODAL
// ============================================================================
function DocumentPrintModal({ doc, vehicles, onClose }) {
  const totals = calcDocTotals(doc);
  const veh = vehicles.find((v) => v.id === doc.vehicleId);

  const docTitle =
    doc.docType === 'Quote'
      ? 'QUOTATION'
      : doc.docType === 'Proforma'
      ? 'PROFORMA INVOICE'
      : 'OFFICIAL RECEIPT';

  const docSub =
    doc.docType === 'Quote'
      ? 'OFFICIAL VEHICLE HIRE & FLEET ESTIMATE'
      : doc.docType === 'Proforma'
      ? 'VEHICLE HIRE & FLEET RENTAL INVOICE'
      : 'VEHICLE HIRE PAYMENT RECEIPT';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-300 overflow-hidden my-6">
        {/* Top Action Toolbar (Hidden when printing) */}
        <div className="bg-[#2B3A52] text-white px-5 py-3 flex items-center justify-between no-print">
          <span className="text-xs font-semibold">Official A4 Document Preview — {doc.id}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#9A7B3E] hover:bg-[#b08d47] text-white text-xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-300 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 DOCUMENT SHEET */}
        <div id="printable-document" className="p-8 bg-white text-[#162238] space-y-5 text-xs">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-[#162238]">
            <div className="flex items-center gap-3.5">
              <TunzCarsLogoSVG size={64} />
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#162238]">
                  TUNZ <span className="text-[#9A7B3E]">CARS</span>
                </h2>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#9E2A2B]">
                  {COMPANY_INFO.parent}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Phone: {COMPANY_INFO.phone} • Email: {COMPANY_INFO.email}
                </p>
                <p className="text-[11px] font-semibold text-[#162238]">
                  Parent IPA Reg #: {COMPANY_INFO.ipaReg} | IRC TIN: {COMPANY_INFO.ircTin}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="inline-block px-3 py-1 rounded bg-[#162238] text-[#D4AF37] font-extrabold text-base tracking-wide">
                {docTitle}
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-1">{docSub}</p>
              <div className="mt-2 space-y-0.5 text-[11px]">
                <div>
                  <span className="text-slate-500">Document No.:</span>{' '}
                  <strong className="text-[#162238]">{doc.id}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Date Issued:</span> <strong>{doc.date}</strong>
                </div>
                {doc.docType !== 'Receipt' && (
                  <div>
                    <span className="text-slate-500">Valid Until:</span> <strong>{doc.validUntil}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Client & Hire Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A7B3E] mb-1">
                {doc.docType === 'Receipt' ? 'Received With Thanks From:' : 'Prepared For / Bill To:'}
              </div>
              <div className="font-bold text-sm text-[#162238]">{doc.clientName}</div>
              {doc.contactPerson && <div className="text-slate-700 mt-0.5">{doc.contactPerson}</div>}
              {doc.clientPhone && <div className="text-slate-600 mt-0.5">Tel: {doc.clientPhone}</div>}
              {doc.clientEmail && <div className="text-slate-600">{doc.clientEmail}</div>}
            </div>

            <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-slate-200">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A7B3E] mb-1">
                Vehicle & Hire Parameters:
              </div>
              <div>
                <span className="text-slate-500">Assigned Vehicle:</span>{' '}
                <strong>{veh ? `${veh.makeModel} (${veh.plate})` : doc.vehicleId}</strong>
              </div>
              <div>
                <span className="text-slate-500">Rental Period:</span>{' '}
                <strong>
                  {doc.startDate} to {doc.endDate} ({doc.days} Days)
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Hire Mode:</span> <strong>{doc.hireType}</strong> • Fuel: Full-to-Full
              </div>
              <div>
                <span className="text-slate-500">Status:</span> <strong>{doc.status}</strong>
              </div>
            </div>
          </div>

          {/* Amount in Words Banner for Receipts */}
          {doc.docType === 'Receipt' && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                Amount Received (In Words):
              </span>
              <span className="font-bold text-sm text-[#162238]">{numberToWordsPGK(totals.gross)}</span>
            </div>
          )}

          {/* Line Items Table */}
          <table className="w-full border-collapse border border-slate-300">
            <thead>
              <tr className="bg-[#162238] text-white text-[11px]">
                <th className="p-2.5 text-left border border-slate-600 w-10">#</th>
                <th className="p-2.5 text-left border border-slate-600">Vehicle & Hire Service Description</th>
                <th className="p-2.5 text-center border border-slate-600 w-16">Days</th>
                <th className="p-2.5 text-right border border-slate-600 w-28">Daily Rate</th>
                <th className="p-2.5 text-right border border-slate-600 w-28">Total (PGK)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2.5 border border-slate-300">1</td>
                <td className="p-2.5 border border-slate-300">
                  <div className="font-bold text-[#162238]">
                    Vehicle Hire — {veh ? veh.makeModel : doc.vehicleId} {veh ? `[Plate: ${veh.plate}]` : ''}
                  </div>
                  <div className="text-slate-600">
                    Rental Period: {doc.startDate} to {doc.endDate} | {doc.hireType} (Inclusive of 10% GST)
                  </div>
                </td>
                <td className="p-2.5 text-center border border-slate-300 font-semibold">{doc.days}</td>
                <td className="p-2.5 text-right border border-slate-300">{formatPGK(doc.dailyRate)}</td>
                <td className="p-2.5 text-right border border-slate-300 font-bold">{formatPGK(totals.base)}</td>
              </tr>

              {Number(doc.extraFees) > 0 && (
                <tr>
                  <td className="p-2.5 border border-slate-300">2</td>
                  <td className="p-2.5 border border-slate-300">
                    <div className="font-bold text-[#162238]">Additional Hire Services / Transfers</div>
                    <div className="text-slate-600">{doc.extraDesc || 'Airport Transfer / Driver / Fuel Surcharge'}</div>
                  </td>
                  <td className="p-2.5 text-center border border-slate-300">1</td>
                  <td className="p-2.5 text-right border border-slate-300">{formatPGK(doc.extraFees)}</td>
                  <td className="p-2.5 text-right border border-slate-300 font-bold">{formatPGK(doc.extraFees)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Bank Payment Details & GST Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A7B3E]">
                BSP Bank Deposit & Tax Details
              </div>
              <div>
                <span className="text-slate-500">Account Name:</span> <strong>{COMPANY_INFO.accountName}</strong>
              </div>
              <div>
                <span className="text-slate-500">Account Number:</span>{' '}
                <strong>
                  {COMPANY_INFO.bspAccount} ({COMPANY_INFO.bspBranch})
                </strong>
              </div>
              <div>
                <span className="text-slate-500">Parent Entity:</span> Tunz Accessories (IPA #{COMPANY_INFO.ipaReg})
              </div>
              <div>
                <span className="text-slate-500">IRC TIN:</span> <strong>{COMPANY_INFO.ircTin}</strong>
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="flex justify-between px-3.5 py-2 border-b border-slate-200">
                <span className="text-slate-600">Subtotal (Excl. GST):</span>
                <span className="font-semibold">{formatPGK(totals.subtotalExcl)}</span>
              </div>
              <div className="flex justify-between px-3.5 py-2 border-b border-slate-200">
                <span className="text-slate-600">GST (10% Included):</span>
                <span className="font-semibold">{formatPGK(totals.gst)}</span>
              </div>
              <div className="flex justify-between px-3.5 py-2.5 bg-[#162238] text-white font-extrabold text-sm">
                <span>{doc.docType === 'Receipt' ? 'TOTAL AMOUNT PAID:' : 'TOTAL PAYABLE (PGK):'}</span>
                <span className="text-[#D4AF37]">{formatPGK(totals.gross)}</span>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="grid grid-cols-2 gap-6 pt-6 mt-4 border-t border-slate-200">
            <div>
              <div className="border-b border-slate-400 h-8" />
              <div className="font-bold text-[#162238] mt-1">
                Authorized Signatory — {COMPANY_INFO.name}
              </div>
              <div className="text-slate-500">{COMPANY_INFO.principal} | Official Stamp & Date</div>
            </div>
            <div>
              <div className="border-b border-slate-400 h-8" />
              <div className="font-bold text-[#162238] mt-1">Client / Hirer Acceptance</div>
              <div className="text-slate-500">Authorized Officer Signature & Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: VEHICLE FORM MODAL
// ============================================================================
function VehicleFormModal({ initialVehicle, onClose, onSave }) {
  const [form, setForm] = useState(
    initialVehicle || {
      id: '',
      makeModel: '',
      plate: '',
      color: '',
      category: '5-Seater AWD SUV',
      dailyRate: 250,
      odometer: 100000,
      nextServiceOdo: 105000,
      regoExpiry: '2027-06-30',
      insuranceExpiry: '2027-06-30',
      status: 'Available',
      fuelType: 'Petrol',
      notes: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.makeModel.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="bg-[#162238] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#9A7B3E]">
          <h3 className="text-base font-bold">
            {initialVehicle ? `Edit Vehicle — ${initialVehicle.id}` : 'Add Vehicle to Tunz Cars Fleet'}
          </h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Make & Model *</label>
              <input
                type="text"
                required
                placeholder="e.g., 2016 Toyota Hilux 4WD"
                value={form.makeModel}
                onChange={(e) => setForm({ ...form, makeModel: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Registration Plate # *</label>
              <input
                type="text"
                required
                placeholder="e.g., KVG-901"
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Colour</label>
              <input
                type="text"
                placeholder="White / Black"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Daily Rate (PGK)</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.dailyRate}
                onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-semibold"
              >
                <option value="Available">Available</option>
                <option value="On Hire">On Hire</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Current Odometer (km)</label>
              <input
                type="number"
                required
                value={form.odometer}
                onChange={(e) => setForm({ ...form, odometer: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Next Service Due (km)</label>
              <input
                type="number"
                required
                value={form.nextServiceOdo}
                onChange={(e) => setForm({ ...form, nextServiceOdo: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Rego / MVIL Expiry</label>
              <input
                type="date"
                value={form.regoExpiry}
                onChange={(e) => setForm({ ...form, regoExpiry: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#162238] text-white font-semibold hover:bg-[#2B3A52] cursor-pointer"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: PAYMENT FORM MODAL
// ============================================================================
function PaymentFormModal({ billingDocs, vehicles, prefillDoc, onClose, onSave }) {
  const unpaidDocs = billingDocs.filter((d) => d.status !== 'Paid');
  const initialDoc = prefillDoc || unpaidDocs[0] || null;
  const initialGross = initialDoc ? calcDocTotals(initialDoc).gross : 250;

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    docRef: initialDoc ? initialDoc.id : '',
    clientName: initialDoc ? initialDoc.clientName : '',
    vehicleId: initialDoc ? initialDoc.vehicleId : vehicles[0]?.id || 'TC-VEH-01',
    amountPaid: initialGross,
    bondCollected: 0,
    method: 'BSP Transfer',
    referenceNo: '',
    status: 'Paid'
  });

  const handleSelectDoc = (docId) => {
    const found = billingDocs.find((d) => d.id === docId);
    if (found) {
      setForm({
        ...form,
        docRef: found.id,
        clientName: found.clientName,
        vehicleId: found.vehicleId,
        amountPaid: calcDocTotals(found).gross
      });
    } else {
      setForm({ ...form, docRef: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || Number(form.amountPaid) <= 0) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-[#162238] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#9A7B3E]">
          <div>
            <h3 className="text-base font-bold">Record Incoming Rental Payment</h3>
            <p className="text-xs text-slate-300">Depositing to BSP Kavieng Acc # {COMPANY_INFO.bspAccount}</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#162238] mb-1">Link to Quote / Proforma Invoice (Optional)</label>
            <select
              value={form.docRef}
              onChange={(e) => handleSelectDoc(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-semibold"
            >
              <option value="">-- Standalone / Direct Rental Deposit --</option>
              {billingDocs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} — {d.clientName} ({formatPGK(calcDocTotals(d).gross)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Payer / Client Name *</label>
              <input
                type="text"
                required
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Rental Amount Paid (PGK) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amountPaid}
                onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-extrabold text-emerald-700"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Security Bond Collected (PGK)</label>
              <input
                type="number"
                step="0.01"
                value={form.bondCollected}
                onChange={(e) => setForm({ ...form, bondCollected: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Payment Method</label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="BSP Transfer">BSP Transfer</option>
                <option value="Cash">Cash</option>
                <option value="EFTPOS">EFTPOS</option>
                <option value="Cheque">Government / Institutional Cheque</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">BSP Deposit Slip / Txn Ref #</label>
              <input
                type="text"
                placeholder="e.g., BSP-TXN-99210"
                value={form.referenceNo}
                onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-700 text-white font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              Confirm Payment & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENT: FUEL & MAINTENANCE EXPENSE MODAL
// ============================================================================
function ExpenseFormModal({ vehicles, onClose, onSave }) {
  const defaultVeh = vehicles[0] || { id: 'TC-VEH-01', odometer: 149250 };
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    vehicleId: defaultVeh.id,
    category: 'Fuel',
    vendor: 'Puma Energy Kavieng Service Station',
    description: '',
    litres: 40,
    odometer: defaultVeh.odometer,
    prevOdometer: defaultVeh.odometer - 420,
    amount: 176,
    receiptNo: ''
  });

  const handleVehChange = (vehId) => {
    const found = vehicles.find((v) => v.id === vehId);
    setForm({
      ...form,
      vehicleId: vehId,
      odometer: found ? found.odometer : form.odometer,
      prevOdometer: found ? found.odometer : form.prevOdometer
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vendor.trim() || Number(form.amount) <= 0) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-[#162238] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#9A7B3E]">
          <h3 className="text-base font-bold">Log Fuel Fill or Fleet Maintenance</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Vehicle</label>
              <select
                value={form.vehicleId}
                onChange={(e) => handleVehChange(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-semibold"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id} — {v.makeModel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white font-semibold"
              >
                <option value="Fuel">Fuel</option>
                <option value="Routine Service">Routine Service</option>
                <option value="Repairs & Parts">Repairs & Parts</option>
                <option value="Tyres & Alignment">Tyres & Alignment</option>
                <option value="Rego & MVIL">Rego & MVIL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#162238] mb-1">Service Station / Workshop *</label>
              <input
                type="text"
                required
                placeholder="e.g., Puma Energy Kavieng / Ela Motors"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#162238] mb-1">Amount Paid (PGK) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 font-extrabold text-[#9E2A2B]"
              />
            </div>
          </div>

          {form.category === 'Fuel' && (
            <div className="grid grid-cols-3 gap-3 bg-[#F7F6F2] p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block font-bold text-[#162238] mb-1">Litres Filled (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.litres}
                  onChange={(e) => setForm({ ...form, litres: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#162238] mb-1">Prev. Odometer</label>
                <input
                  type="number"
                  value={form.prevOdometer}
                  onChange={(e) => setForm({ ...form, prevOdometer: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-[#162238] mb-1">Current Odometer</label>
                <input
                  type="number"
                  value={form.odometer}
                  onChange={(e) => setForm({ ...form, odometer: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                />
              </div>
            </div>
          )}

          {form.category !== 'Fuel' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#162238] mb-1">Current Odometer (km)</label>
                <input
                  type="number"
                  value={form.odometer}
                  onChange={(e) => setForm({ ...form, odometer: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-[#162238] mb-1">Supplier Receipt / Invoice #</label>
                <input
                  type="text"
                  value={form.receiptNo}
                  onChange={(e) => setForm({ ...form, receiptNo: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#162238] mb-1">Work / Fuel Description *</label>
            <input
              type="text"
              required
              placeholder="e.g., Full tank petrol refill / Oil & filter service"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#9E2A2B] text-white font-semibold hover:bg-red-800 cursor-pointer"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}