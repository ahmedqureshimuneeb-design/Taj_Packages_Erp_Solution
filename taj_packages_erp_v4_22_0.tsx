import React, { useState, useMemo } from 'react';
import {
  Folder,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  LayoutDashboard,
  SquarePen,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Calculator,
  Plus,
  Layers,
  Wrench,
  Boxes,
  Sliders,
  Sigma,
  Package,
  Info,
  HelpCircle,
  Ruler,
  Pencil,
  Copy,
  TrendingUp,
  FileText,
  DollarSign,
  Activity,
  Cloud,
  CloudOff,
  User,
  Download
} from 'lucide-react';

interface PackagingStyleItem {
  id: number;
  name: string;
  description: string;
  variablesCount: number;
  formulasCount: number;
  status: string;
  boundFormulas?: Array<{ id: string; name: string; code: string; ply: number; expression: string }>;
}

const INITIAL_PACKAGING_STYLES: PackagingStyleItem[] = [
  { id: 1, name: "Reverse Tuck End (RTE)", description: "Standard folding carton where top flap tucks from rear to front and bottom flap tucks front to rear.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 2, name: "Straight Tuck End (STE)", description: "Both top and bottom tuck flaps fold into the carton in the same direction.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 3, name: "Snap Lock Bottom (1-2-3)", description: "Four flaps that fold and lock manually into place without requiring glue.", variablesCount: 0, formulasCount: 3, status: "Active" },
  { id: 4, name: "Auto Lock Crash Bottom", description: "Pre-glued bottom carton that instantly pops open and locks into shape automatically.", variablesCount: 0, formulasCount: 3, status: "Active" },
  { id: 5, name: "Tuck Top Snap Lock", description: "Standard tuck top with a four-flap interlocking snap bottom base.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 6, name: "Tuck Top Auto Bottom", description: "Quick-setup carton with standard top closure and high-speed auto glued bottom.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 7, name: "Roll End Tuck Top (RETT)", description: "One-piece carton folded from a single sheet with interlocking side walls.", variablesCount: 0, formulasCount: 4, status: "Active" },
  { id: 8, name: "Roll End Lock Front (RELF)", description: "Mailer style box with roll-over side walls and front locking ears.", variablesCount: 0, formulasCount: 4, status: "Active" },
  { id: 9, name: "Mailer Box With Dust Flaps", description: "E-commerce shipper with secure front tuck tabs and protective dust side wings.", variablesCount: 0, formulasCount: 3, status: "Active" },
  { 
    id: 10, 
    name: "Four Corner Tray (4 Corner)", 
    description: "Collapsible tray with four glued corners that folds flat for shipping.", 
    variablesCount: 0, 
    formulasCount: 2, 
    status: "Active",
    boundFormulas: [
      { id: 'bf_1', name: '4 Corner Ply 1 C/A', code: 'ST_093', ply: 1, expression: 'ST_091 * ST_092' },
      { id: 'bf_2', name: '4 Corner Ply 2 C/A', code: 'ST_096', ply: 2, expression: 'ST_094 * ST_095' }
    ]
  },
  { id: 11, name: "Six Corner Tray (6 Corner)", description: "Glued folding carton tray with attached lid and collapsible corner gussets.", variablesCount: 0, formulasCount: 3, status: "Active" },
  { id: 12, name: "Regular Slotted Container (RSC)", description: "Standard corrugated outer shipping box where outer length flaps meet at center.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 13, name: "Half Slotted Container (HSC)", description: "Open top corrugated container with slotted bottom flaps.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 14, name: "Pillow Box", description: "Curved pillow-shaped box with rounded ends for gifts, cosmetics, and confectionery.", variablesCount: 0, formulasCount: 1, status: "Active" },
  { id: 15, name: "Pyramid Pocket Cone", description: "Pyramid-shaped paper cone with pocket-style opening for snacks and fries.", variablesCount: 0, formulasCount: 1, status: "Active" },
  { id: 16, name: "Snack Kraft Bag", description: "Lightweight kraft bag designed for takeaway food and bakery products.", variablesCount: 0, formulasCount: 1, status: "Active" },
  { id: 17, name: "Double Door Lock Closure", description: "Box closure with two interlocking doors that secure package without tape.", variablesCount: 0, formulasCount: 3, status: "Active" },
  { id: 18, name: "Drawer Box", description: "Sliding-style box with inner tray pulling smoothly from outer sleeve.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 19, name: "Rigid Box", description: "Premium sturdy board box wrapped with specialty art paper for luxury presentation.", variablesCount: 0, formulasCount: 6, status: "Active" },
  { id: 20, name: "Gable Box", description: "Handled carton with built-in gable top for bakery, food, and gift items.", variablesCount: 0, formulasCount: 1, status: "Active" },
  { id: 21, name: "Crash Lock Bottom Box", description: "Self-locking box with pre-glued crash-lock bottom for high-speed setup.", variablesCount: 0, formulasCount: 1, status: "Active" },
  { id: 22, name: "Hexagonal Top & Bottom Lid", description: "Six-sided box style with separate top and bottom lids for premium confectionery.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 23, name: "Hexagonal Top & Bottom Tray", description: "Hexagonal presentation box with separate top lid and base tray.", variablesCount: 0, formulasCount: 6, status: "Active" },
  { id: 24, name: "Dori Bag", description: "Flexible packaging bag featuring drawstring or cord handles.", variablesCount: 0, formulasCount: 2, status: "Active" },
  { id: 25, name: "Hexagonal Prism Basket", description: "Six-sided prism open packaging basket for sweets and gift hampers.", variablesCount: 0, formulasCount: 0, status: "Active" },
  { id: 26, name: "Side Lock Top Tuck Box", description: "Folding carton with interlocking side flaps and tuck-in top closure.", variablesCount: 0, formulasCount: 3, status: "Active" }
];

const INITIAL_RAW_MATERIALS = [
  { id: "rm_1", name: "Duplex Grey Back Board", category: "Duplix Board", defaultRate: 185, unit: "kg", defaultGsm: 350, description: "Standard coated grey back carton board" },
  { id: "rm_2", name: "Bleached Folding Box Board", category: "Board", defaultRate: 210, unit: "kg", defaultGsm: 300, description: "Solid bleached sulphate virgin board" },
  { id: "rm_3", name: "Fluting Medium Corrugated", category: "Corrugated", defaultRate: 145, unit: "kg", defaultGsm: 125, description: "High crush resistance fluting substrate" },
  { id: "rm_4", name: "High Density Gatta Greyboard", category: "Gatta", defaultRate: 175, unit: "sheet", defaultGsm: 1200, description: "Rigid box structure core greyboard" },
  { id: "rm_5", name: "Virgin Kraft Liner Board", category: "Kraft Board", defaultRate: 195, unit: "kg", defaultGsm: 250, description: "Unbleached strong tear resistance kraft" },
  { id: "rm_6", name: "Natural Brown Kraft Paper", category: "Kraft Paper", defaultRate: 160, unit: "kg", defaultGsm: 80, description: "Eco friendly packaging and shopping bag paper" },
  { id: "rm_7", name: "Solid CNC MDF Rigid Sheet", category: "Mdf Sheet", defaultRate: 650, unit: "sheet", defaultGsm: 2100, description: "Engineered wood substrate for presentation boxes" },
  { id: "rm_8", name: "Gloss Coated Art Paper", category: "Paper", defaultRate: 240, unit: "kg", defaultGsm: 130, description: "Top liner wrapper for high quality printing" },
  { id: "rm_9", name: "Birch Wood Veneer Sheet", category: "Wood Sheet", defaultRate: 950, unit: "sheet", defaultGsm: 1100, description: "Natural luxury outer veneer finish" }
];

const INITIAL_CONSUMABLES = [
  { id: "c_1", name: "CMYK Process Inks Set", category: "Printing Ink", defaultRate: 1250, unit: "Kilogram", description: "High pigment fast drying offset process inks" },
  { id: "c_2", name: "Side Seam Cold PVA Adhesive", category: "Adhesive", defaultRate: 380, unit: "Kilogram", description: "Water based rapid set folder-gluer adhesive" },
  { id: "c_3", name: "Thermal Gloss BOPP Film 15 Micron", category: "Lamination", defaultRate: 420, unit: "Kilogram", description: "High clarity corona treated thermal laminating roll" },
  { id: "c_4", name: "UV Gloss Overprint Varnish", category: "Coating", defaultRate: 890, unit: "Kilogram", description: "Inline gloss coating with rapid UV curing" }
];

const INITIAL_ACCESSORIES = [
  { id: "acc_1", name: "Ribbon", code: "RIB_FNC", category: "Handles", defaultRate: 2.0, unit: "Piece", description: "Decorative ribbon or closure band" },
  { id: "acc_2", name: "Braided Dori Cotton Handle 18 inch", code: "DORI_18", category: "Handles", defaultRate: 4.5, unit: "Piece", description: "Tipped braided cotton cord handle for carrier bags" },
  { id: "acc_3", name: "Clear Rigid PVC Window Film 150 Micron", code: "PVC_WIN", category: "Window", defaultRate: 18, unit: "Meter", description: "Crystal clear window patching film for bakery boxes" },
  { id: "acc_4", name: "Brass Eyelet 5mm Metallic", code: "EYELET_5", category: "Hardware", defaultRate: 0.65, unit: "Piece", description: "Reinforcing metallic grommet for handle holes" },
  { id: "acc_5", name: "Custom Molded EVA Foam Insert Tray", code: "EVA_INS", category: "Insert", defaultRate: 45, unit: "Piece", description: "Laser cut velvet coated cushioning insert" }
];

const INITIAL_PACKAGING_SERVICES = [
  { id: "ps_1", name: "4-Color Offset Printing (Heidelberg Speedmaster)", category: "Offset Printing", machine: "Heidelberg CD 102", unit: "Thousand", defaultRate: 650, setupCharges: 2500, status: "Active", description: "Standard 4-color CMYK process printing run per 1,000 sheets" },
  { id: "ps_2", name: "Single Color Kraft / Liner Printing", category: "Offset Printing", machine: "RotaPrint 36", unit: "Thousand", defaultRate: 300, setupCharges: 1200, status: "Active", description: "Monochrome text or logo printing for inner liners and shippers" },
  { id: "ps_3", name: "3-Ply / 5-Ply Corrugation & Fluting Line", category: "Corrugation", machine: "Auto Flute Laminator", unit: "Sheet", defaultRate: 4.5, setupCharges: 1500, status: "Active", description: "Single/double wall B, C, or E-flute board bonding and pasting" },
  { id: "ps_4", name: "Automatic Platen Die Cutting & Creasing", category: "Die Cutting", machine: "Bobst Autoplatine", unit: "Thousand", defaultRate: 450, setupCharges: 1800, status: "Active", description: "Precision carton blank cutting, creasing, and stripping" },
  { id: "ps_5", name: "High-Speed Straight Line Folder-Gluer", category: "Pasting & Gluing", machine: "Bobst Media 68", unit: "Thousand", defaultRate: 350, setupCharges: 1000, status: "Active", description: "Automatic side-seam and crash-lock bottom carton gluing" }
];

const INITIAL_FINISHING_SERVICES = [
  { id: "fs_1", name: "Thermal Gloss BOPP Film Lamination", category: "Lamination", spec: "15 Micron Gloss", unit: "Meter", defaultRate: 1.80, setupCharges: 800, status: "Active", description: "High-clarity protective thermal gloss film surface lamination" },
  { id: "fs_2", name: "Thermal Matte Velvet Touch Lamination", category: "Lamination", spec: "18 Micron Matte", unit: "Meter", defaultRate: 1.95, setupCharges: 800, status: "Active", description: "Smooth anti-scuff matte finish lamination for luxury cartons" }
];

const INITIAL_SERVICES_RATES = [
  { id: "sr_1", name: "4 Color Offset Printing (Feed Run)", category: "Printing", serviceType: "Packaging Service", unit: "Thousand", rate: 650, description: "Per 1,000 sheets 40-inch multi-color press pass" },
  { id: "sr_2", name: "Automatic Platen Die Cutting", category: "Die Cutting", serviceType: "Packaging Service", unit: "Thousand", rate: 450, description: "High speed Bobst carton die cutting run" }
];

const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    name: "1LB LUXURY CAKE BOX",
    style: "Four Corner Tray (4 Corner)",
    variant: "1POUND",
    ply: 3,
    length: 8,
    width: 8,
    height: 4,
    dimUom: "inch",
    uom: "pieces",
    accessories: ["Braided Dori Cotton Handle 18 inch", "Clear Rigid PVC Window Film 150 Micron"],
    status: "Active"
  }
];

export default function App() {
  const ERP_VERSION = "v4.22.0";
  const VERSION_CHANGELOG = [
    { ver: "v4.22.0", date: "Current", summary: "Added comprehensive multi-master export covering all ERP entities and harmonized cloud/export button color themes." },
    { ver: "v4.21.0", date: "Prior", summary: "Refined Cloud Backup panel and Download Excel export card with matching ERP theme colors and typography." },
    { ver: "v4.20.0", date: "Prior", summary: "Added Cloud Backup / Cloud Sync widget card to Dashboard with link/unlink account simulation and last sync timestamp." },
    { ver: "v4.19.0", date: "Prior", summary: "Enabled multiple-entry adding functionality across all Cost Calculator steps (Steps 4–8)." }
  ];

  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [activeInfoTooltip, setActiveInfoTooltip] = useState<{ title: string; token: string; formulaCode: string; expression: string; result: string; description: string } | null>(null);

  /* Cloud Sync State */
  const [cloudAccountLinked, setCloudAccountLinked] = useState(true);
  const [cloudEmail, setCloudEmail] = useState('abreeshan@gmail.com');
  const [lastSyncTime, setLastSyncTime] = useState('10/14/2026, 5:42:46 PM');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /* Master States */
  const [variables, setVariables] = useState([
    { id: 'v_1', code: 'GRAM_CNV', name: 'Gram Conversion', category: 'Weight', dataType: 'Numeric', unit: 'Factor', defaultValue: '1550000', seqNo: '1', description: 'Standard metric conversion constant' },
    { id: 'v_2', code: 'GSM', name: 'Basis Weight (GSM)', category: 'Material', dataType: 'Numeric', unit: 'GSM', defaultValue: '350', seqNo: '4', description: 'Grams per square meter' },
    { id: 'v_3', code: 'SHEET_WIDTH', name: 'Sheet Width', category: 'Sheet', dataType: 'Decimal', unit: 'Inch', defaultValue: '40', seqNo: '5', description: 'Full parent sheet width' },
    { id: 'v_4', code: 'SHEET_LENGTH', name: 'Sheet Length', category: 'Sheet', dataType: 'Decimal', unit: 'Inch', defaultValue: '28', seqNo: '6', description: 'Full parent sheet length' },
    { id: 'v_5', code: 'REQ_QTY', name: 'Required Quantity', category: 'Quantity', dataType: 'Numeric', unit: 'Piece', defaultValue: '1000', seqNo: '7', description: 'Final order yield quantity' },
    { id: 'v_6', code: 'WASTAGE_PERC', name: 'Wastage Percentage', category: 'Percentage', dataType: 'Decimal', unit: 'Percentage', defaultValue: '8', seqNo: '13', description: 'Estimated production scrap rate' },
    { id: 'v_7', code: 'LENGTH', name: 'Box Length', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '10', seqNo: '14', description: 'Finished box length' },
    { id: 'v_8', code: 'WIDTH', name: 'Box Width', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '6', seqNo: '15', description: 'Finished box width' },
    { id: 'v_9', code: 'HEIGHT', name: 'Box Height', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '2', seqNo: '16', description: 'Finished box height' },
    { id: 'v_10', code: 'ORDER_QTY', name: 'Order Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Piece', defaultValue: '1000', seqNo: '17', description: 'Job run order quantity' },
    { id: 'v_11', code: 'NO_OF_COLOR', name: 'Number of Colors', category: 'Printing', dataType: 'Numeric', unit: 'Each', defaultValue: '4', seqNo: '18', description: 'Number of printing colors' },
    { id: 'v_12', code: 'CUT_LENGTH', name: 'Cut Sheet Length', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '32.63', seqNo: '19', description: 'Dieline cut blank length' },
    { id: 'v_13', code: 'CUT_WIDTH', name: 'Cut Sheet Width', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '11.50', seqNo: '20', description: 'Dieline cut blank width' },
    { id: 'v_14', code: 'FINISH_REQ_QTY', name: 'Finishing Req Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Sheet', defaultValue: '1000', seqNo: '21', description: 'Finishing required quantity' },
    { id: 'v_15', code: 'FINISH_RATE', name: 'Finishing Rate', category: 'Rate', dataType: 'Decimal', unit: 'Meter', defaultValue: '1.80', seqNo: '22', description: 'Finishing rate per unit' },
    { id: 'v_16', code: 'TOOL_REQ_QTY', name: 'Tooling Req Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Piece', defaultValue: '1', seqNo: '23', description: 'Tooling plate required qty' },
    { id: 'v_17', code: 'TOOL_BATCH_RATE', name: 'Tooling Batch Rate', category: 'Rate', dataType: 'Numeric', unit: 'PKR', defaultValue: '4500', seqNo: '24', description: 'Tooling batch rate' },
    { id: 'v_18', code: 'CONV_REQ_QTY', name: 'Conversion Req Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Sheet', defaultValue: '1000', seqNo: '25', description: 'Conversion service required qty' },
    { id: 'v_19', code: 'CONV_RATE', name: 'Conversion Rate', category: 'Rate', dataType: 'Numeric', unit: 'PKR', defaultValue: '0.45', seqNo: '26', description: 'Conversion service unit rate' },
    { id: 'v_20', code: 'OVERHEAD_PERC', name: 'Overhead Percentage', category: 'Percentage', dataType: 'Decimal', unit: 'Percentage', defaultValue: '5', seqNo: '27', description: 'Factory overhead rate percentage' },
    { id: 'v_21', code: 'PROFIT_MARGIN_PERC', name: 'Profit Margin Percentage', category: 'Percentage', dataType: 'Decimal', unit: 'Percentage', defaultValue: '18', seqNo: '28', description: 'Commercial target profit margin percentage' }
  ]);

  const [formulas, setFormulas] = useState([
    { id: 'f_1', sr: 1, name: 'Gross Quantity With Wastage', code: 'GROSS_QTY', type: 'Material', purpose: 'Weight', expression: 'REQ_QTY + (REQ_QTY * (WASTAGE_PERC / 100))', description: 'Total Quantity Required.', status: 'Active' },
    { id: 'f_2', sr: 2, name: 'Sheet Weight', code: 'SHT_WHT', type: 'Material', purpose: 'Weight', expression: '(SHEET_LENGTH * SHEET_WIDTH * GSM) / GRAM_CNV', description: 'Weight Of One Sheet.', status: 'Active' },
    { id: 'f_3', sr: 3, name: 'Yield Calculation', code: 'YIELD', type: 'Material', purpose: 'Quantity', expression: 'FLOOR(SHEET_LENGTH / CUT_LENGTH) * FLOOR(SHEET_WIDTH / CUT_WIDTH)', description: 'Pieces per mother sheet.', status: 'Active' },
    { id: 'f_4', sr: 4, name: 'Substrate Cost Per Piece', code: 'COST_PER_PIECE', type: 'Material', purpose: 'Cost', expression: '(REQ_QTY_WEIGHT * MATERIAL_RATE) / ORDER_QTY', description: 'Raw material cost per finished box.', status: 'Active' },
    { id: 'f_5', sr: 5, name: 'Finishing Cost Calculation', code: 'FINISH_COST_CALC', type: 'Service', purpose: 'Cost', expression: '(FINISH_REQ_QTY * FINISH_RATE) / ORDER_QTY', description: 'Finishing treatment cost per piece.', status: 'Active' },
    { id: 'f_6', sr: 6, name: 'Tooling Amortized Cost Calculation', code: 'TOOL_AMORTIZED_CALC', type: 'Material', purpose: 'Cost', expression: '(TOOL_REQ_QTY * TOOL_BATCH_RATE) / ORDER_QTY', description: 'Amortized tooling cost per piece.', status: 'Active' },
    { id: 'f_7', sr: 7, name: 'Conversion Cost Calculation', code: 'CONV_COST_CALC', type: 'Service', purpose: 'Cost', expression: '(CONV_REQ_QTY * CONV_RATE) / ORDER_QTY', description: 'Conversion service cost per piece.', status: 'Active' }
  ]);

  const [packagingStyles, setPackagingStyles] = useState<PackagingStyleItem[]>(INITIAL_PACKAGING_STYLES);
  const [rawMaterials, setRawMaterials] = useState(INITIAL_RAW_MATERIALS);
  const [consumables, setConsumables] = useState(INITIAL_CONSUMABLES);
  const [accessories, setAccessories] = useState(INITIAL_ACCESSORIES);
  const [packagingServices, setPackagingServices] = useState(INITIAL_PACKAGING_SERVICES);
  const [finishingServices, setFinishingServices] = useState(INITIAL_FINISHING_SERVICES);
  const [materialRates, setMaterialRates] = useState(INITIAL_SERVICES_RATES);
  const [servicesRates, setServicesRates] = useState(INITIAL_SERVICES_RATES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  /* Modal States for Add & Edit Masters */
  const [isVarModalOpen, setIsVarModalOpen] = useState(false);
  const [editingVarId, setEditingVarId] = useState<string | null>(null);
  const [varFormData, setVarFormData] = useState({ code: '', name: '', category: 'Material', dataType: 'Numeric', unit: 'Inch', defaultValue: '0', seqNo: '1', description: '' });

  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [editingFormulaId, setEditingFormulaId] = useState<string | null>(null);
  const [formulaFormData, setFormulaFormData] = useState({ name: '', code: '', type: 'Material', purpose: 'Cost', description: '', expression: '' });

  /* Packaging Style Modal States */
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [editingStyleId, setEditingStyleId] = useState<number | null>(null);
  const [styleFormData, setStyleFormData] = useState({ name: '', description: '', status: 'Active' });

  const [isRawMatModalOpen, setIsRawMatModalOpen] = useState(false);
  const [editingRawMatId, setEditingRawMatId] = useState<string | null>(null);
  const [rawMatFormData, setRawMatFormData] = useState({ name: '', category: 'Board', defaultRate: '185', unit: 'kg', defaultGsm: '350', description: '' });

  const [isConsumableModalOpen, setIsConsumableModalOpen] = useState(false);
  const [editingConsumableId, setEditingConsumableId] = useState<string | null>(null);
  const [consumableFormData, setConsumableFormData] = useState({ name: '', category: 'Printing Ink', defaultRate: '1250', unit: 'Kilogram', description: '' });

  const [isAccessoryModalOpen, setIsAccessoryModalOpen] = useState(false);
  const [editingAccessoryId, setEditingAccessoryId] = useState<string | null>(null);
  const [accessoryFormData, setAccessoryFormData] = useState({ name: '', code: '', category: 'Handles', defaultRate: '2.0', unit: 'Piece', description: '' });

  const [isPackServiceModalOpen, setIsPackServiceModalOpen] = useState(false);
  const [editingPackServiceId, setEditingPackServiceId] = useState<string | null>(null);
  const [packServiceFormData, setPackServiceFormData] = useState({ name: '', machine: 'Heidelberg', defaultRate: '500', setupCharges: '1500', unit: 'Thousand', description: '' });

  const [isFinServiceModalOpen, setIsFinServiceModalOpen] = useState(false);
  const [editingFinServiceId, setEditingFinServiceId] = useState<string | null>(null);
  const [finServiceFormData, setFinServiceFormData] = useState({ name: '', spec: 'Standard', defaultRate: '1.5', setupCharges: '500', unit: 'Meter', description: '' });

  const [isMatRateModalOpen, setIsMatRateModalOpen] = useState(false);
  const [editingMatRateId, setEditingMatRateId] = useState<string | null>(null);
  const [matRateFormData, setMatRateFormData] = useState({ name: '', category: 'General', unit: 'kg', rate: '150', description: '' });

  const [isServRateModalOpen, setIsServRateModalOpen] = useState(false);
  const [editingServRateId, setEditingServRateId] = useState<string | null>(null);
  const [servRateFormData, setServRateFormData] = useState({ name: '', category: 'General', unit: 'Thousand', rate: '400', description: '' });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormData, setProductFormData] = useState({ name: '', style: 'Rigid Box', variant: 'STANDARD', ply: 3 });

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ type: string; id: any } | null>(null);

  const [calcSelectedStyle, setCalcSelectedStyle] = useState('Rigid Box');
  const [calcStyleDropdownOpen, setCalcStyleDropdownOpen] = useState(false);
  const [calcStyleSearch, setCalcStyleSearch] = useState('');
  const [calcLength, setCalcLength] = useState<string>('10');
  const [calcWidth, setCalcWidth] = useState<string>('6');
  const [calcHeight, setCalcHeight] = useState<string>('2');
  const [calcOrderQty, setCalcOrderQty] = useState<string>('1000');
  const [calcColors, setCalcColors] = useState<string>('4');
  const [calcSelectedPly, setCalcSelectedPly] = useState<number>(1);
  const [calcOverheadPerc, setCalcOverheadPerc] = useState<number>(5);
  const [calcProfitMarginPerc, setCalcProfitMarginPerc] = useState<number>(18);

  const [calcLayers, setCalcLayers] = useState<Array<{
    plyIndex: number;
    materialId: string;
    gsm: number;
    cutLength: number;
    cutWidth: number;
    sheetLength: number;
    sheetWidth: number;
    wastagePerc: number;
    rate: number;
  }>>(() =>
    Array.from({ length: 10 }, (_, idx) => ({
      plyIndex: idx + 1,
      materialId: 'rm_1',
      gsm: 350,
      cutLength: 32.63,
      cutWidth: 11.50,
      sheetLength: 28,
      sheetWidth: 40,
      wastagePerc: 8,
      rate: 185
    }))
  );

  /* Step 5: Multi-Accessory State */
  const [calcAccessoryItems, setCalcAccessoryItems] = useState([
    { id: 'acc_item_1', accessoryId: 'acc_2', name: 'Braided Dori Cotton Handle 18 inch', reqQty: 1, rate: 4.50 }
  ]);
  const [selectedAddAccessoryId, setSelectedAddAccessoryId] = useState('');

  const [toolingItems, setToolingItems] = useState([
    { id: 't_1', name: 'Digital Offset Plate', reqQty: 1, batchRate: 4500 }
  ]);

  const [conversionItems, setConversionItems] = useState([
    { id: 'cs_1', name: 'Card Cutting (Ply 1)', reqQty: 1000, rate: 0.45, unit: 'sheets' },
    { id: 'cs_2', name: 'Card Cutting (Ply 2)', reqQty: 1000, rate: 0.45, unit: 'sheets' },
    { id: 'cs_3', name: 'Printing (Ply 1)', reqQty: 1000, rate: 1.50, unit: 'impressions' }
  ]);
  const [selectedAddServiceId, setSelectedAddServiceId] = useState('');

  const [finishingItems, setFinishingItems] = useState([
    { id: 'fs_item_1', name: 'Thermal Gloss BOPP Film Lamination', dimLength: 28, dimWidth: 40, reqQty: 1000, rate: 1.80, unit: 'sheets' }
  ]);
  const [selectedAddFinishingId, setSelectedAddFinishingId] = useState('');

  /* Dedicated Row Edit Modal State for Calculator (Steps 4–8) */
  const [editCalcModalTarget, setEditCalcModalTarget] = useState<{ step: number; item: any; index: number } | null>(null);
  const [editCalcFormData, setEditCalcFormData] = useState({ name: '', qty: '1', rate: '0', dimLength: '28', dimWidth: '40' });

  /* Dimension Adjustment Popup Modal State */
  const [dimPopupTarget, setDimPopupTarget] = useState<{ plyIndex: number; type: 'cut' | 'sheet'; currentL: number; currentW: number } | null>(null);
  const [dimPopupCustom, setDimPopupCustom] = useState(false);
  const [dimPopupLength, setDimPopupLength] = useState('');
  const [dimPopupWidth, setDimPopupWidth] = useState('');

  const updateCalcLayer = (plyIndex: number, updatedFields: Partial<typeof calcLayers[0]>) => {
    setCalcLayers(prev => prev.map(l => l.plyIndex === plyIndex ? { ...l, ...updatedFields } : l));
  };

  const computedStep4Layers = useMemo(() => {
    const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000);
    const gramCnv = 1550000;

    return calcLayers.slice(0, calcSelectedPly).map(layer => {
      const matObj = rawMaterials.find(m => m.id === layer.materialId) || rawMaterials[0];
      const cutArea = layer.cutLength * layer.cutWidth;
      const sheetArea = layer.sheetLength * layer.sheetWidth;

      const fit1 = Math.floor(layer.sheetLength / layer.cutLength) * Math.floor(layer.sheetWidth / layer.cutWidth);
      const fit2 = Math.floor(layer.sheetLength / layer.cutWidth) * Math.floor(layer.sheetWidth / layer.cutLength);
      const directFit = Math.max(fit1, fit2);
      const yieldUps = directFit > 0 ? directFit : Math.max(1, Math.floor(sheetArea / Math.max(1, cutArea)));

      const netQtySheet = Math.ceil(orderQty / yieldUps);
      const wastageQtySheet = Math.ceil(netQtySheet * (layer.wastagePerc / 100));
      const grossQtySheet = netQtySheet + wastageQtySheet;

      const singleSheetWeightKg = (layer.sheetLength * layer.sheetWidth * layer.gsm) / gramCnv;
      const reqQtyWeight = Number((singleSheetWeightKg * grossQtySheet).toFixed(2));
      const sheetUtilPerc = Number((((cutArea * yieldUps) / Math.max(1, sheetArea)) * 100).toFixed(1));

      const totalLayerCost =
        matObj?.unit === 'sheet'
          ? grossQtySheet * layer.rate
          : reqQtyWeight * layer.rate;
      const costPerPiece = Number((totalLayerCost / orderQty).toFixed(2));

      return {
        ...layer,
        materialObj: matObj,
        yieldUps,
        netQtySheet,
        wastageQtySheet,
        grossQtySheet,
        reqQtyWeight,
        sheetUtilPerc,
        totalLayerCost,
        costPerPiece
      };
    });
  }, [calcLayers, calcSelectedPly, calcOrderQty, rawMaterials]);

  const step4SubtotalPerPiece = useMemo(() => {
    return computedStep4Layers.reduce((acc, l) => acc + l.costPerPiece, 0);
  }, [computedStep4Layers]);

  const computedStep5Accessories = useMemo(() => {
    return calcAccessoryItems.map(item => {
      const accObj = accessories.find(a => a.id === item.accessoryId) || accessories[0];
      const costPerPiece = Number((item.reqQty * item.rate).toFixed(2));
      return { ...item, accObj, costPerPiece };
    });
  }, [calcAccessoryItems, accessories]);

  const step5TotalAccessoriesCost = useMemo(() => {
    return computedStep5Accessories.reduce((acc, item) => acc + item.costPerPiece, 0);
  }, [computedStep5Accessories]);

  const computedStep6Tooling = useMemo(() => {
    const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000);
    return toolingItems.map(item => {
      const amortizedPerPiece = Number(((item.reqQty * item.batchRate) / orderQty).toFixed(2));
      return { ...item, amortizedPerPiece };
    });
  }, [toolingItems, calcOrderQty]);

  const step6TotalToolingCost = useMemo(() => {
    return computedStep6Tooling.reduce((acc, t) => acc + (t.reqQty * t.batchRate), 0);
  }, [toolingItems]);

  const step6TotalAmortizedPerPiece = useMemo(() => {
    return computedStep6Tooling.reduce((acc, t) => acc + t.amortizedPerPiece, 0);
  }, [computedStep6Tooling]);

  const computedStep7Conversion = useMemo(() => {
    const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000);
    return conversionItems.map(item => {
      const totalCost = (item.reqQty * item.rate);
      const costPerPiece = Number((totalCost / orderQty).toFixed(2));
      return { ...item, costPerPiece, totalCost };
    });
  }, [conversionItems, calcOrderQty]);

  const step7TotalConversionCost = useMemo(() => {
    return computedStep7Conversion.reduce((acc, c) => acc + c.totalCost, 0);
  }, [conversionItems]);

  const step7TotalCostPerPiece = useMemo(() => {
    return computedStep7Conversion.reduce((acc, c) => acc + c.costPerPiece, 0);
  }, [computedStep7Conversion]);

  const computedStep8Finishing = useMemo(() => {
    const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000);
    return finishingItems.map(item => {
      const totalCost = (item.reqQty * item.rate);
      const costPerPiece = Number((totalCost / orderQty).toFixed(2));
      return { ...item, costPerPiece, totalCost };
    });
  }, [finishingItems, calcOrderQty]);

  const step8TotalFinishingCost = useMemo(() => {
    return computedStep8Finishing.reduce((acc, f) => acc + f.totalCost, 0);
  }, [finishingItems]);

  const step8TotalCostPerPiece = useMemo(() => {
    return computedStep8Finishing.reduce((acc, f) => acc + f.costPerPiece, 0);
  }, [computedStep8Finishing]);

  /* Step 9 Calculations (Commercial Roll-Up) */
  const step9RollUp = useMemo(() => {
    const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000);
    const matCostUnit = step4SubtotalPerPiece;
    const matBatchTotal = matCostUnit * orderQty;

    const accCostUnit = step5TotalAccessoriesCost;
    const accBatchTotal = accCostUnit * orderQty;

    const toolingCostUnit = step6TotalAmortizedPerPiece;
    const toolingBatchTotal = step6TotalToolingCost;

    const packSrvUnit = step7TotalCostPerPiece;
    const packSrvBatchTotal = step7TotalConversionCost;

    const finSrvUnit = step8TotalCostPerPiece;
    const finSrvBatchTotal = step8TotalFinishingCost;

    const primeCostUnit = matCostUnit + accCostUnit + toolingCostUnit + packSrvUnit + finSrvUnit;
    const primeBatchTotal = matBatchTotal + accBatchTotal + toolingBatchTotal + packSrvBatchTotal + finSrvBatchTotal;

    const overheadUnit = Number((primeCostUnit * (calcOverheadPerc / 100)).toFixed(2));
    const overheadBatchTotal = overheadUnit * orderQty;

    const netFactoryCostUnit = Number((primeCostUnit + overheadUnit).toFixed(2));
    const netFactoryCostBatch = netFactoryCostUnit * orderQty;

    const marginUnit = Number((netFactoryCostUnit * (calcProfitMarginPerc / 100)).toFixed(2));
    const marginBatchTotal = marginUnit * orderQty;

    const finalQuoteUnit = Number((netFactoryCostUnit + marginUnit).toFixed(2));
    const finalQuoteBatch = finalQuoteUnit * orderQty;

    const totalComp = finalQuoteUnit > 0 ? finalQuoteUnit : 1;
    const pMat = Number(((matCostUnit / totalComp) * 100).toFixed(1));
    const pAcc = Number(((accCostUnit / totalComp) * 100).toFixed(1));
    const pTool = Number(((toolingCostUnit / totalComp) * 100).toFixed(1));
    const pConvFin = Number((((packSrvUnit + finSrvUnit) / totalComp) * 100).toFixed(1));
    const pOverhead = Number(((overheadUnit / totalComp) * 100).toFixed(1));
    const pMargin = Number(((marginUnit / totalComp) * 100).toFixed(1));

    const ladders = [
      { pcs: 500, multiplier: 1.18 },
      { pcs: 1000, multiplier: 1.0 },
      { pcs: 2500, multiplier: 0.887 },
      { pcs: 5000, multiplier: 0.85 }
    ].map(tier => {
      const tierUnit = Number((finalQuoteUnit * tier.multiplier).toFixed(2));
      const tierBatch = Math.round(tierUnit * tier.pcs);
      return { ...tier, unit: tierUnit, batch: tierBatch };
    });

    return {
      matCostUnit, matBatchTotal,
      accCostUnit, accBatchTotal,
      toolingCostUnit, toolingBatchTotal,
      packSrvUnit, packSrvBatchTotal,
      finSrvUnit, finSrvBatchTotal,
      primeCostUnit, primeBatchTotal,
      overheadUnit, overheadBatchTotal,
      netFactoryCostUnit, netFactoryCostBatch,
      marginUnit, marginBatchTotal,
      finalQuoteUnit, finalQuoteBatch,
      pMat, pAcc, pTool, pConvFin, pOverhead, pMargin,
      ladders
    };
  }, [step4SubtotalPerPiece, step5TotalAccessoriesCost, step6TotalAmortizedPerPiece, step6TotalToolingCost, step7TotalCostPerPiece, step7TotalConversionCost, step8TotalCostPerPiece, step8TotalFinishingCost, calcOrderQty, calcOverheadPerc, calcProfitMarginPerc]);

  const handleAddAccessoryItem = (accessoryName: string) => {
    if (!accessoryName) return;
    const foundAcc = accessories.find(a => a.name === accessoryName) || accessories[0];
    setCalcAccessoryItems(prev => [
      ...prev,
      { id: `acc_item_${Date.now()}`, accessoryId: foundAcc.id, name: foundAcc.name, reqQty: 1, rate: foundAcc.defaultRate }
    ]);
    setSelectedAddAccessoryId('');
    showToast('Accessory added successfully.');
  };

  const handleAddConversionService = (serviceName: string) => {
    if (!serviceName) return;
    setConversionItems(prev => [
      ...prev,
      { id: `cs_${Date.now()}`, name: `${serviceName} (Ply 1)`, reqQty: 1000, rate: 0.50, unit: 'sheets' }
    ]);
    setSelectedAddServiceId('');
    showToast('Conversion service added successfully.');
  };

  const handleAddFinishingTreatment = (finishingName: string) => {
    if (!finishingName) return;
    setFinishingItems(prev => [
      ...prev,
      { id: `fs_item_${Date.now()}`, name: finishingName, dimLength: 28, dimWidth: 40, reqQty: 1000, rate: 1.80, unit: 'sheets' }
    ]);
    setSelectedAddFinishingId('');
    showToast('Finishing treatment added successfully.');
  };

  const handleDownloadExcel = () => {
    // Comprehensive export covering variables, formulas, styles, raw materials, consumables, accessories, material rates, packaging services, finishing services, service rates, and products
    let csvData = "=== TAJ PACKAGES ERP COMPREHENSIVE EXPORT ===\n\n";
    
    csvData += "--- VARIABLES ---\n";
    csvData += "Code,Name,Category,DataType,Unit,DefaultValue,Description\n";
    variables.forEach(v => {
      csvData += `"${v.code}","${v.name}","${v.category}","${v.dataType}","${v.unit}","${v.defaultValue}","${v.description}"\n`;
    });

    csvData += "\n--- FORMULAS ---\n";
    csvData += "Name,Code,Type,Purpose,Expression,Description\n";
    formulas.forEach(f => {
      csvData += `"${f.name}","${f.code}","${f.type}","${f.purpose}","${f.expression}","${f.description}"\n`;
    });

    csvData += "\n--- PACKAGING STYLES ---\n";
    csvData += "Name,Description,Status\n";
    packagingStyles.forEach(s => {
      csvData += `"${s.name}","${s.description}","${s.status}"\n`;
    });

    csvData += "\n--- RAW MATERIALS ---\n";
    csvData += "Name,Category,DefaultGSM,DefaultRate,Unit,Description\n";
    rawMaterials.forEach(rm => {
      csvData += `"${rm.name}","${rm.category}","${rm.defaultGsm}","${rm.defaultRate}","${rm.unit}","${rm.description}"\n`;
    });

    csvData += "\n--- CONSUMABLE GOODS ---\n";
    csvData += "Name,Category,DefaultRate,Unit,Description\n";
    consumables.forEach(c => {
      csvData += `"${c.name}","${c.category}","${c.defaultRate}","${c.unit}","${c.description}"\n`;
    });

    csvData += "\n--- ACCESSORIES ---\n";
    csvData += "Name,Code,Category,DefaultRate,Unit,Description\n";
    accessories.forEach(a => {
      csvData += `"${a.name}","${a.code || ''}","${a.category}","${a.defaultRate}","${a.unit}","${a.description}"\n`;
    });

    csvData += "\n--- PACKAGING SERVICES ---\n";
    csvData += "Name,Category,Machine,Rate,SetupCharges,Unit\n";
    packagingServices.forEach(ps => {
      csvData += `"${ps.name}","${ps.category}","${ps.machine}","${ps.defaultRate}","${ps.setupCharges}","${ps.unit}"\n`;
    });

    csvData += "\n--- FINISHING SERVICES ---\n";
    csvData += "Name,Category,Specification,Rate,Unit\n";
    finishingServices.forEach(fs => {
      csvData += `"${fs.name}","${fs.category}","${fs.spec}","${fs.defaultRate}","${fs.unit}"\n`;
    });

    csvData += "\n--- MATERIAL RATES ---\n";
    csvData += "Name,Category,Rate,Unit\n";
    materialRates.forEach(mr => {
      csvData += `"${mr.name}","${mr.category}","${mr.rate}","${mr.unit}"\n`;
    });

    csvData += "\n--- SERVICES RATES ---\n";
    csvData += "Name,Category,Rate,Unit\n";
    servicesRates.forEach(sr => {
      csvData += `"${sr.name}","${sr.category}","${sr.rate}","${sr.unit}"\n`;
    });

    csvData += "\n--- PRODUCTS ---\n";
    csvData += "Name,Style,Variant,Ply\n";
    products.forEach(p => {
      csvData += `"${p.name}","${p.style}","${p.variant}","${p.ply}"\n`;
    });

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "taj_packages_erp_complete_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Comprehensive multi-master ERP data exported successfully.');
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased overflow-hidden select-none">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-violet-500/25 text-xs font-semibold animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shrink-0 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white font-black text-base shadow-sm shadow-violet-400/30 shrink-0">TP</div>
            {sidebarOpen && (
              <div className="truncate">
                <h1 className="font-bold text-sm tracking-tight text-slate-900 leading-tight">TAJ PACKAGES</h1>
                <p className="text-[10px] text-slate-400 font-medium">BOM &amp; Costing ERP</p>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition hidden md:block">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <button type="button" onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${currentView === 'dashboard' ? 'bg-[#7c3aed] text-white shadow-md shadow-violet-500/20' : 'text-slate-700 hover:bg-slate-50'}`}>
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <div className="pt-1">
            {sidebarOpen && (
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Formula Engine</div>
            )}
            <div className="space-y-0.5 mt-0.5 ml-2 pl-2 border-l-2 border-slate-100">
              <button type="button" onClick={() => setCurrentView('variables')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'variables' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Variables</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{variables.length}</span>}
              </button>
              <button type="button" onClick={() => setCurrentView('formula')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'formula' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Formula Master</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{formulas.length}</span>}
              </button>
            </div>
          </div>

          <button type="button" onClick={() => setCurrentView('packaging_style')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${currentView === 'packaging_style' ? 'bg-violet-50 text-[#7c3aed] border-r-2 border-[#7c3aed]' : 'text-slate-700 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-2"><Boxes className="w-4 h-4 text-violet-500" />{sidebarOpen && <span>Packaging Style</span>}</div>
            {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{packagingStyles.length}</span>}
          </button>

          <div className="pt-1">
            {sidebarOpen && (
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Material</div>
            )}
            <div className="space-y-0.5 mt-0.5 ml-2 pl-2 border-l-2 border-slate-100">
              <button type="button" onClick={() => setCurrentView('raw_material')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'raw_material' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Raw Material</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{rawMaterials.length}</span>}
              </button>
              <button type="button" onClick={() => setCurrentView('consumable_goods')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'consumable_goods' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Consumable Goods</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{consumables.length}</span>}
              </button>
              <button type="button" onClick={() => setCurrentView('accessories')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'accessories' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Accessories</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{accessories.length}</span>}
              </button>
              <button type="button" onClick={() => setCurrentView('material_rates')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'material_rates' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Material Rates</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{materialRates.length}</span>}
              </button>
            </div>
          </div>

          <div className="pt-1">
            {sidebarOpen && (
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Services</div>
            )}
            <div className="space-y-0.5 mt-0.5 ml-2 pl-2 border-l-2 border-slate-100">
              <button type="button" onClick={() => setCurrentView('packaging_services')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'packaging_services' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Packaging Services</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{packagingServices.length}</span>}
              </button>
              <button type="button" onClick={() => setCurrentView('finishing_services')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'finishing_services' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Finishing Services</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{finishingServices.length}</span>}
              </button>
              <button type="button" onClick={() => setCurrentView('services_rate')} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${currentView === 'services_rate' ? 'text-[#7c3aed] font-bold bg-violet-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                {sidebarOpen && <span>Services Rate</span>}
                {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{servicesRates.length}</span>}
              </button>
            </div>
          </div>

          <button type="button" onClick={() => setCurrentView('product')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${currentView === 'product' ? 'bg-violet-50 text-[#7c3aed] border-r-2 border-[#7c3aed]' : 'text-slate-700 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-violet-500" />{sidebarOpen && <span>Product</span>}</div>
            {sidebarOpen && <span className="text-[10px] font-mono text-slate-400">{products.length}</span>}
          </button>

          <button type="button" onClick={() => setCurrentView('cost_calculator')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${currentView === 'cost_calculator' ? 'bg-violet-50 text-[#7c3aed] border-r-2 border-[#7c3aed]' : 'text-slate-700 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-2"><Calculator className="w-4 h-4 text-violet-500" />{sidebarOpen && <span>Cost Calculator</span>}</div>
            {sidebarOpen && <span className="text-[9px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-1.5 py-0.5 rounded">Ready</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7c3aed]">Taj Packages ERP</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800 capitalize">{currentView.replace(/_/g, ' ')}</span>
            <button type="button" onClick={() => setIsVersionModalOpen(true)} className="ml-2 px-2 py-0.5 rounded-md bg-violet-50 text-[10px] font-mono font-bold text-[#7c3aed] border border-violet-200 hover:bg-violet-100 transition">
              {ERP_VERSION}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 space-y-4">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Dashboard Header Banner */}
              <div className="bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-2 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-mono font-bold">
                    <Activity className="w-3.5 h-3.5 text-emerald-300" />
                    <span>ERP System Operational ({ERP_VERSION})</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Taj Packages Production &amp; Costing Dashboard</h2>
                  <p className="text-xs sm:text-sm text-violet-100 max-w-2xl leading-relaxed">
                    Welcome back. Manage your packaging styles, raw materials, formula engine, and execute multi-ply structural cost estimations in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-3 z-10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentView('cost_calculator')}
                    className="px-5 py-3 bg-white text-[#7c3aed] hover:bg-violet-50 font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Launch Cost Calculator</span>
                  </button>
                </div>
              </div>

              {/* CLOUD BACKUP / CLOUD SYNC WIDGET CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">CLOUD BACKUP</span>
                  <h3 className="text-base font-black text-slate-900">Cloud Sync</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5c4033] text-white flex items-center justify-center font-bold text-sm">
                    {cloudEmail ? cloudEmail.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="text-xs font-medium text-slate-700">
                    Signed in as: <span className="font-bold text-slate-900">{cloudAccountLinked ? cloudEmail : 'Not linked'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  IndexedDB stays primary on this device. When an account is linked, changes upload to Firestore after a short delay and restore on other devices after Google sign-in.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCloudAccountLinked(true);
                      setLastSyncTime(new Date().toLocaleString());
                      showToast('Cloud account linked successfully.');
                    }}
                    className="px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>Link Cloud Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCloudAccountLinked(false);
                      showToast('Cloud account unlinked.');
                    }}
                    className="px-4 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
                  >
                    <CloudOff className="w-4 h-4" />
                    <span>Unlink Account</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                  Last sync: {lastSyncTime}
                </div>
              </div>

              {/* EXPORT / DOWNLOAD ALL DATA CARD */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">EXPORT</span>
                  <h3 className="text-base font-black text-slate-900">Download All Data</h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  Save every master and BOM from this browser as an Excel workbook. Works offline.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadExcel}
                    className="px-4 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Packaging Styles</span>
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center font-bold">
                      <Boxes className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{packagingStyles.length}</div>
                  <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>Active styles library</span>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Raw Materials</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{rawMaterials.length}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Boards, Kraft &amp; Core Substrates</div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Services &amp; Finishing</span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <Wrench className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{packagingServices.length + finishingServices.length}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Printing, Die-cutting &amp; Lamination</div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latest Quote Benchmark</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">Rs. {step9RollUp.finalQuoteUnit.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Per piece (1,000 pcs run)</div>
                </div>
              </div>

              {/* Quick Action Hub & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#7c3aed]" />
                    <span>Quick Navigation &amp; Master Modules</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button type="button" onClick={() => setCurrentView('cost_calculator')} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 hover:border-violet-300 transition text-left space-y-1 group">
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#7c3aed]">Cost Calculator (9 Steps)</div>
                      <p className="text-[11px] text-slate-500">Multi-ply BOM, material yield, accessories, tooling, conversion, and roll-up.</p>
                    </button>
                    <button type="button" onClick={() => setCurrentView('formula')} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 hover:border-violet-300 transition text-left space-y-1 group">
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#7c3aed]">Formula Engine Master</div>
                      <p className="text-[11px] text-slate-500">Inspect and configure dynamic costing expressions and mathematical tokens.</p>
                    </button>
                    <button type="button" onClick={() => setCurrentView('raw_material')} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 hover:border-violet-300 transition text-left space-y-1 group">
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#7c3aed]">Raw Material Inventory</div>
                      <p className="text-[11px] text-slate-500">Manage duplex boards, virgin kraft liners, greyboards, and GSM rates.</p>
                    </button>
                    <button type="button" onClick={() => setCurrentView('packaging_style')} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-violet-50/50 hover:border-violet-300 transition text-left space-y-1 group">
                      <div className="font-bold text-xs text-slate-900 group-hover:text-[#7c3aed]">Packaging Styles Library</div>
                      <p className="text-[11px] text-slate-500">Browse RTE, STE, 4-Corner, Rigid boxes, and RSC corrugated containers.</p>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
                    <span>Recent Active Quotation</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#7c3aed]">{calcSelectedStyle}</span>
                      <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded text-slate-600 border border-violet-200">{calcSelectedPly}-Ply Board</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                      <div>Dimensions: <span className="font-bold text-slate-900">{calcLength} × {calcWidth} × {calcHeight}"</span></div>
                      <div>Order Qty: <span className="font-bold text-slate-900">{parseInt(calcOrderQty || '1000').toLocaleString()} pcs</span></div>
                    </div>
                    <div className="pt-2 border-t border-violet-200 flex items-center justify-between font-mono">
                      <span className="text-xs font-bold text-slate-700">Calculated Quote:</span>
                      <span className="text-base font-black text-[#7c3aed]">Rs. {step9RollUp.finalQuoteUnit.toFixed(2)} / pc</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'variables' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Variables Master ({variables.length})</h2>
                <button type="button" onClick={() => {
                  setEditingVarId(null);
                  setVarFormData({ code: '', name: '', category: 'Material', dataType: 'Numeric', unit: 'Inch', defaultValue: '0', seqNo: (variables.length + 1).toString(), description: '' });
                  setIsVarModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Variable</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Token Code</th>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Unit</th>
                      <th className="py-3 px-3">Default Value</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {variables.map(v => (
                      <tr key={v.id}>
                        <td className="py-3 px-3 font-mono font-bold text-[#7c3aed]">{v.code}</td>
                        <td className="py-3 px-3 font-bold">{v.name}</td>
                        <td className="py-3 px-3">{v.category}</td>
                        <td className="py-3 px-3">{v.unit}</td>
                        <td className="py-3 px-3 font-mono">{v.defaultValue}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingVarId(v.id);
                              setVarFormData({ code: v.code, name: v.name, category: v.category, dataType: v.dataType, unit: v.unit, defaultValue: v.defaultValue, seqNo: v.seqNo || '1', description: v.description || '' });
                              setIsVarModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'variable', id: v.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'formula' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Formula Master ({formulas.length})</h2>
                <button type="button" onClick={() => {
                  setEditingFormulaId(null);
                  setFormulaFormData({ name: '', code: '', type: 'Material', purpose: 'Cost', description: '', expression: 'REQ_QTY * 2' });
                  setIsFormulaModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Formula</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Code</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Expression</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {formulas.map(f => (
                      <tr key={f.id}>
                        <td className="py-3 px-3 font-bold text-[#7c3aed]">{f.name}</td>
                        <td className="py-3 px-3 font-mono font-bold">{f.code}</td>
                        <td className="py-3 px-3">{f.type}</td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{f.expression}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingFormulaId(f.id);
                              setFormulaFormData({ name: f.name, code: f.code, type: f.type, purpose: f.purpose, description: f.description || '', expression: f.expression });
                              setIsFormulaModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'formula', id: f.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'packaging_style' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Packaging Styles ({packagingStyles.length})</h2>
                <button type="button" onClick={() => {
                  setEditingStyleId(null);
                  setStyleFormData({ name: '', description: '', status: 'Active' });
                  setIsStyleModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Style</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {packagingStyles.map(s => (
                  <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                      <p className="text-xs text-slate-500">{s.description}</p>
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-200 gap-1.5">
                      <button type="button" onClick={() => {
                        setEditingStyleId(s.id);
                        setStyleFormData({ name: s.name, description: s.description, status: s.status });
                        setIsStyleModalOpen(true);
                      }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg" title="Edit Style"><SquarePen className="w-3.5 h-3.5" /></button>
                      <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'style', id: s.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete Style"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'raw_material' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Raw Material Master ({rawMaterials.length})</h2>
                <button type="button" onClick={() => {
                  setEditingRawMatId(null);
                  setRawMatFormData({ name: '', category: 'Board', defaultRate: '185', unit: 'kg', defaultGsm: '350', description: '' });
                  setIsRawMatModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Raw Material</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Default GSM</th>
                      <th className="py-3 px-3">Unit Rate</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {rawMaterials.map(rm => (
                      <tr key={rm.id}>
                        <td className="py-3 px-3 font-bold">{rm.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{rm.category}</td>
                        <td className="py-3 px-3 font-mono">{rm.defaultGsm}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {rm.defaultRate} / {rm.unit}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingRawMatId(rm.id);
                              setRawMatFormData({ name: rm.name, category: rm.category, defaultRate: rm.defaultRate.toString(), unit: rm.unit, defaultGsm: rm.defaultGsm.toString(), description: rm.description || '' });
                              setIsRawMatModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'raw_material', id: rm.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'consumable_goods' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Consumable Goods ({consumables.length})</h2>
                <button type="button" onClick={() => {
                  setEditingConsumableId(null);
                  setConsumableFormData({ name: '', category: 'Printing Ink', defaultRate: '1250', unit: 'Kilogram', description: '' });
                  setIsConsumableModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Consumable</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Unit Rate</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {consumables.map(c => (
                      <tr key={c.id}>
                        <td className="py-3 px-3 font-bold">{c.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{c.category}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {c.defaultRate} / {c.unit}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingConsumableId(c.id);
                              setConsumableFormData({ name: c.name, category: c.category, defaultRate: c.defaultRate.toString(), unit: c.unit, description: c.description || '' });
                              setIsConsumableModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'consumable', id: c.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'accessories' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Accessories Master ({accessories.length})</h2>
                <button type="button" onClick={() => {
                  setEditingAccessoryId(null);
                  setAccessoryFormData({ name: '', code: 'ACC_NEW', category: 'Handles', defaultRate: '2.0', unit: 'Piece', description: '' });
                  setIsAccessoryModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Accessory</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Code</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Default Rate</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {accessories.map(a => (
                      <tr key={a.id}>
                        <td className="py-3 px-3 font-bold">{a.name}</td>
                        <td className="py-3 px-3 font-mono text-[#7c3aed]">{a.code || '—'}</td>
                        <td className="py-3 px-3">{a.category}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {a.defaultRate} / {a.unit}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingAccessoryId(a.id);
                              setAccessoryFormData({ name: a.name, code: a.code || '', category: a.category, defaultRate: a.defaultRate.toString(), unit: a.unit, description: a.description || '' });
                              setIsAccessoryModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'accessory', id: a.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'packaging_services' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Packaging Services ({packagingServices.length})</h2>
                <button type="button" onClick={() => {
                  setEditingPackServiceId(null);
                  setPackServiceFormData({ name: '', machine: 'Heidelberg', defaultRate: '500', setupCharges: '1500', unit: 'Thousand', description: '' });
                  setIsPackServiceModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Service</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Service Name</th>
                      <th className="py-3 px-3">Machine</th>
                      <th className="py-3 px-3">Rate</th>
                      <th className="py-3 px-3">Setup Charges</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {packagingServices.map(ps => (
                      <tr key={ps.id}>
                        <td className="py-3 px-3 font-bold">{ps.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{ps.machine}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {ps.defaultRate} / {ps.unit}</td>
                        <td className="py-3 px-3 font-mono">Rs. {ps.setupCharges}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingPackServiceId(ps.id);
                              setPackServiceFormData({ name: ps.name, machine: ps.machine, defaultRate: ps.defaultRate.toString(), setupCharges: ps.setupCharges.toString(), unit: ps.unit, description: ps.description || '' });
                              setIsPackServiceModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'packaging_service', id: ps.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'finishing_services' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Finishing Services ({finishingServices.length})</h2>
                <button type="button" onClick={() => {
                  setEditingFinServiceId(null);
                  setFinServiceFormData({ name: '', spec: 'Standard', defaultRate: '1.5', setupCharges: '500', unit: 'Meter', description: '' });
                  setIsFinServiceModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Finishing</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Service Name</th>
                      <th className="py-3 px-3">Specification</th>
                      <th className="py-3 px-3">Rate</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {finishingServices.map(fs => (
                      <tr key={fs.id}>
                        <td className="py-3 px-3 font-bold">{fs.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{fs.spec}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {fs.defaultRate} / {fs.unit}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingFinServiceId(fs.id);
                              setFinServiceFormData({ name: fs.name, spec: fs.spec, defaultRate: fs.defaultRate.toString(), setupCharges: (fs.setupCharges || 500).toString(), unit: fs.unit, description: fs.description || '' });
                              setIsFinServiceModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'finishing_service', id: fs.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'material_rates' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Material Rates ({materialRates.length})</h2>
                <button type="button" onClick={() => {
                  setEditingMatRateId(null);
                  setMatRateFormData({ name: '', category: 'General', unit: 'kg', rate: '150', description: '' });
                  setIsMatRateModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Rate</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Rate</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {materialRates.map(mr => (
                      <tr key={mr.id}>
                        <td className="py-3 px-3 font-bold">{mr.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{mr.category}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {mr.rate} / {mr.unit}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingMatRateId(mr.id);
                              setMatRateFormData({ name: mr.name, category: mr.category, unit: mr.unit, rate: mr.rate.toString(), description: mr.description || '' });
                              setIsMatRateModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'material_rate', id: mr.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'services_rate' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Services Rate ({servicesRates.length})</h2>
                <button type="button" onClick={() => {
                  setEditingServRateId(null);
                  setServRateFormData({ name: '', category: 'General', unit: 'Thousand', rate: '400', description: '' });
                  setIsServRateModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Service Rate</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Rate</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {servicesRates.map(sr => (
                      <tr key={sr.id}>
                        <td className="py-3 px-3 font-bold">{sr.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{sr.category}</td>
                        <td className="py-3 px-3 font-mono font-bold">Rs. {sr.rate} / {sr.unit}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingServRateId(sr.id);
                              setServRateFormData({ name: sr.name, category: sr.category, unit: sr.unit, rate: sr.rate.toString(), description: sr.description || '' });
                              setIsServRateModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'service_rate', id: sr.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'product' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">Product Master ({products.length})</h2>
                <button type="button" onClick={() => {
                  setEditingProductId(null);
                  setProductFormData({ name: '', style: 'Rigid Box', variant: 'STANDARD', ply: 3 });
                  setIsProductModalOpen(true);
                }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span>Add Product</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3">Style</th>
                      <th className="py-3 px-3">Variant</th>
                      <th className="py-3 px-3">Ply</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 px-3 font-bold">{p.name}</td>
                        <td className="py-3 px-3 text-[#7c3aed]">{p.style}</td>
                        <td className="py-3 px-3 font-mono">{p.variant}</td>
                        <td className="py-3 px-3 font-mono font-bold">{p.ply}P</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button type="button" onClick={() => {
                              setEditingProductId(p.id);
                              setProductFormData({ name: p.name, style: p.style, variant: p.variant, ply: p.ply });
                              setIsProductModalOpen(true);
                            }} className="p-1.5 text-[#7c3aed] hover:bg-violet-50 rounded-lg"><SquarePen className="w-3.5 h-3.5" /></button>
                            <button type="button" onClick={() => setDeleteConfirmTarget({ type: 'product', id: p.id })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'cost_calculator' && (
            <div className="space-y-4">
              {/* STEP 1: SELECT STYLE */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">1</span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">STEP 1: SELECT STYLE</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">26 Packaging Styles</span>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCalcStyleDropdownOpen(!calcStyleDropdownOpen)}
                    className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-800 hover:border-[#7c3aed] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>{calcSelectedStyle}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {calcStyleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto p-2 space-y-1">
                      <div className="px-3 py-2">
                        <input
                          type="text"
                          value={calcStyleSearch}
                          onChange={(e) => setCalcStyleSearch(e.target.value)}
                          placeholder="Search style..."
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#7c3aed]"
                        />
                      </div>
                      {packagingStyles
                        .filter(s => s.name.toLowerCase().includes(calcStyleSearch.toLowerCase()))
                        .map(style => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => {
                              setCalcSelectedStyle(style.name);
                              setCalcStyleDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-violet-50 hover:text-[#7c3aed] transition"
                          >
                            {style.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* STEPS 2 & 3 */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-200/90 px-6 py-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">2</span>
                      <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">DIMENSIONS &amp; JOB RUN SPECS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">tokens: <span className="text-[#7c3aed] font-bold">ORDER_QTY, NO_OF_COLOR</span></span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Inches (in)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Length</span>
                      <input type="number" value={calcLength} onChange={(e) => setCalcLength(e.target.value)} className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Width</span>
                      <input type="number" value={calcWidth} onChange={(e) => setCalcWidth(e.target.value)} className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Height</span>
                      <input type="number" value={calcHeight} onChange={(e) => setCalcHeight(e.target.value)} className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs font-bold" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-wider block mb-1">Order Qty</span>
                      <input type="number" value={calcOrderQty} onChange={(e) => setCalcOrderQty(e.target.value)} className="w-full px-3 py-2 bg-[#f5f3ff] border border-violet-300 rounded-xl text-xs font-black text-[#7c3aed]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Colors</span>
                      <input type="number" value={calcColors} onChange={(e) => setCalcColors(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-center" />
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200/90 px-6 py-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">3</span>
                      <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">SELECT PLY</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-[11px] font-bold">Active: {calcSelectedPly}-Ply</span>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ply) => (
                      <button key={ply} type="button" onClick={() => setCalcSelectedPly(ply)} className={`py-2 rounded-xl text-xs font-extrabold border ${calcSelectedPly === ply ? 'bg-[#ecfdf5] border-[#10b981] text-[#047857]' : 'bg-[#f8fafc] border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                        {ply}P
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STEP 4: SELECT RAW MATERIALS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">4</span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">STEP 4: SELECT RAW MATERIALS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (calcSelectedPly < 10) {
                          setCalcSelectedPly(prev => prev + 1);
                          showToast(`Added Ply ${calcSelectedPly + 1} layer successfully.`);
                        } else {
                          showToast('Maximum 10 ply layers supported.');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Substrate Layer</span>
                    </button>
                    <span className="text-xs font-black text-slate-900">Subtotal: Rs. {step4SubtotalPerPiece.toFixed(2)}</span>
                  </div>
                </div>

                {computedStep4Layers.map((layer, idx) => (
                  <div key={layer.plyIndex} className="space-y-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="text-[#7c3aed] font-extrabold">Single Layer Material (Ply {layer.plyIndex})</span>
                      <span className="font-mono font-black text-slate-900">Cost / pc: Rs. {layer.costPerPiece.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-8 flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 shrink-0">Material</span>
                        <select
                          value={layer.materialId}
                          onChange={(e) => updateCalcLayer(layer.plyIndex, { materialId: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#7c3aed]"
                        >
                          {rawMaterials.map(rm => (
                            <option key={rm.id} value={rm.id}>[{rm.category}] {rm.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-4 flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-slate-600">GSM</span>
                        <input
                          type="number"
                          value={layer.gsm}
                          onChange={(e) => updateCalcLayer(layer.plyIndex, { gsm: parseFloat(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-black text-center"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                          <tr>
                            <th className="py-3 px-3 w-10 text-center">#</th>
                            <th className="py-3 px-3 min-w-[160px]">DIMENSION <span className="text-[10px] font-mono font-normal text-slate-400 block">cut_sheet_dim</span></th>
                            <th className="py-3 px-3 min-w-[130px]">REQUIRED QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">req_qty_weight</span></th>
                            <th className="py-3 px-3 min-w-[130px]">MATERIAL QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">net_qty_sheet</span></th>
                            <th className="py-3 px-3 min-w-[100px]">YIELD <span className="text-[10px] font-mono font-normal text-slate-400 block">yield</span></th>
                            <th className="py-3 px-3 min-w-[110px]">UTILIZATION <span className="text-[10px] font-mono font-normal text-slate-400 block">sheet_util_perc</span></th>
                            <th className="py-3 px-3 min-w-[110px]">WASTAGE % <span className="text-[10px] font-mono font-normal text-slate-400 block">wastage_perc</span></th>
                            <th className="py-3 px-3 min-w-[120px]">WASTAGE QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">wastage_qty_sheet</span></th>
                            <th className="py-3 px-3 min-w-[120px]">GROSS QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">gross_qty_sheet</span></th>
                            <th className="py-3 px-3 min-w-[130px]">RATE <span className="text-[10px] font-mono font-normal text-slate-400 block">material_rate</span></th>
                            <th className="py-3 px-3 min-w-[140px]">COST / PIECE <span className="text-[10px] font-mono font-normal text-slate-400 block">cost_per_piece</span></th>
                            <th className="py-3 px-3 text-center w-36">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-3 text-center font-bold text-slate-400">{layer.plyIndex}</td>
                            <td className="py-3 px-3">
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-[#7c3aed]">
                                  <span>CUT {layer.cutLength} × {layer.cutWidth}</span>
                                  <button type="button" onClick={() => {
                                    setDimPopupTarget({ plyIndex: layer.plyIndex, type: 'cut', currentL: layer.cutLength, currentW: layer.cutWidth });
                                    setDimPopupCustom(false);
                                    setDimPopupLength(layer.cutLength.toString());
                                    setDimPopupWidth(layer.cutWidth.toString());
                                  }} className="hover:text-slate-900"><Ruler className="w-3 h-3" /></button>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600">
                                  <span>SHEET {layer.sheetLength} × {layer.sheetWidth}</span>
                                  <button type="button" onClick={() => {
                                    setDimPopupTarget({ plyIndex: layer.plyIndex, type: 'sheet', currentL: layer.sheetLength, currentW: layer.sheetWidth });
                                    setDimPopupCustom(false);
                                    setDimPopupLength(layer.sheetLength.toString());
                                    setDimPopupWidth(layer.sheetWidth.toString());
                                  }} className="hover:text-slate-900"><Ruler className="w-3 h-3" /></button>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.reqQtyWeight} kg</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Required Qty Weight', token: 'req_qty_weight', formulaCode: 'SHT_WHT', expression: 'Weight Of One Sheet * Gross Qty', result: `${layer.reqQtyWeight} kg`, description: 'Total raw material weight required.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.netQtySheet} sheet</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Net Material Qty Sheets', token: 'net_qty_sheet', formulaCode: 'SHT_QTY', expression: 'CEIL(REQ_QTY / YIELD)', result: `${layer.netQtySheet} sheets`, description: 'Net parent sheets required.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.yieldUps} ups</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Sheet Yield (Ups)', token: 'yield', formulaCode: 'YIELD', expression: 'FLOOR(SHEET / CUT)', result: `${layer.yieldUps} ups`, description: 'Pieces per mother sheet.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.sheetUtilPerc}%</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Sheet Utilization Percentage', token: 'sheet_util_perc', formulaCode: 'AREA_UTL', expression: '(CUT_AREA * YIELD) / SHEET_AREA * 100', result: `${layer.sheetUtilPerc}%`, description: 'Mother sheet area utilization %.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.wastagePerc}%</span>
                                <button type="button" onClick={() => {
                                  const wp = prompt('Enter Wastage %:', layer.wastagePerc.toString());
                                  if (wp !== null) updateCalcLayer(layer.plyIndex, { wastagePerc: parseFloat(wp) || 0 });
                                }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Wastage Percentage', token: 'wastage_perc', formulaCode: 'GROSS_QTY', expression: 'Scrap rate', result: `${layer.wastagePerc}%`, description: 'Scrap rate.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.wastageQtySheet} sheet</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Wastage Qty Sheets', token: 'wastage_qty_sheet', formulaCode: 'GROSS_QTY', expression: 'NET * (WASTAGE / 100)', result: `${layer.wastageQtySheet} sheets`, description: 'Wastage sheets.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{layer.grossQtySheet} sheet</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Gross Qty Sheets', token: 'gross_qty_sheet', formulaCode: 'GROSS_QTY', expression: 'NET + WASTAGE', result: `${layer.grossQtySheet} sheets`, description: 'Total sheets.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>Rs. {layer.rate.toFixed(2)}</span>
                                <button type="button" onClick={() => {
                                  const rt = prompt('Enter Material Rate:', layer.rate.toString());
                                  if (rt !== null) updateCalcLayer(layer.plyIndex, { rate: parseFloat(rt) || layer.rate });
                                }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Substrate Material Rate', token: 'material_rate', formulaCode: 'COST_PER_PIECE', expression: 'Rate per unit', result: `Rs. ${layer.rate}`, description: 'Unit rate.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-black text-slate-900">
                              <div className="flex items-center gap-1.5">
                                <span>Rs. {layer.costPerPiece.toFixed(2)} / pc</span>
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Material Cost Per Piece', token: 'cost_per_piece', formulaCode: 'COST_PER_PIECE', expression: '(WEIGHT * RATE) / ORDER_QTY', result: `Rs. ${layer.costPerPiece.toFixed(2)}`, description: 'Cost per piece.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Layer Formula Inspection', token: 'cost_per_piece', formulaCode: 'COST_PER_PIECE', expression: '(WEIGHT * RATE) / ORDER_QTY', result: `Rs. ${layer.costPerPiece.toFixed(2)}`, description: 'Formula inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
                                <button type="button" onClick={() => showToast(`Layer ${layer.plyIndex} summary inspected.`)} className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center" title="Summary"><Calculator className="w-3.5 h-3.5" /></button>
                                <button type="button" onClick={() => {
                                  setEditCalcModalTarget({ step: 4, item: layer, index: idx });
                                  setEditCalcFormData({ name: `Ply ${layer.plyIndex} Substrate`, qty: layer.grossQtySheet.toString(), rate: layer.rate.toString(), dimLength: layer.cutLength.toString(), dimWidth: layer.cutWidth.toString() });
                                }} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center" title="Edit Row"><SquarePen className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Material Cost (All {calcSelectedPly} Layers)</span>
                  <span className="text-base font-black text-slate-900">Rs. {step4SubtotalPerPiece.toFixed(2)}</span>
                </div>
              </div>

              {/* STEP 5: ACCESSORIES MATERIAL */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">5</span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">STEP 5: ACCESSORIES MATERIAL</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCalcAccessoryItems(prev => [
                          ...prev,
                          { id: `acc_item_${Date.now()}`, accessoryId: accessories[0]?.id || 'acc_1', name: accessories[0]?.name || 'New Accessory', reqQty: 1, rate: 2.0 }
                        ]);
                        showToast('Accessory added successfully.');
                      }}
                      className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Accessory</span>
                    </button>
                    <span className="text-xs font-black text-slate-900">Subtotal: Rs. {step5TotalAccessoriesCost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">#</th>
                        <th className="py-3 px-3 min-w-[200px]">NAME <span className="text-[10px] font-mono font-normal text-slate-400 block">acc_name</span></th>
                        <th className="py-3 px-3 min-w-[150px]">REQ QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">acc_req_qty</span></th>
                        <th className="py-3 px-3 min-w-[150px]">RATE <span className="text-[10px] font-mono font-normal text-slate-400 block">acc_rate</span></th>
                        <th className="py-3 px-3 min-w-[160px]">COST / PIECE <span className="text-[10px] font-mono font-normal text-slate-400 block">acc_cost_per_piece</span></th>
                        <th className="py-3 px-3 text-center w-36">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {computedStep5Accessories.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>{item.reqQty} pieces</span>
                              <button type="button" onClick={() => {
                                const q = prompt('Enter Accessory Required Qty:', item.reqQty.toString());
                                if (q !== null) {
                                  const val = parseFloat(q) || item.reqQty;
                                  setCalcAccessoryItems(prev => prev.map((ai, i) => i === idx ? { ...ai, reqQty: val } : ai));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Accessory Required Quantity', token: 'acc_req_qty', formulaCode: 'ACC_COST_CALC', expression: 'REQ * RATE', result: `${item.reqQty} pieces`, description: 'Required quantity.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.rate.toFixed(2)}/piece</span>
                              <button type="button" onClick={() => {
                                const r = prompt('Enter accessory unit rate:', item.rate.toString());
                                if (r !== null) {
                                  const val = parseFloat(r) || item.rate;
                                  setCalcAccessoryItems(prev => prev.map((ai, i) => i === idx ? { ...ai, rate: val } : ai));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Accessory Unit Rate', token: 'acc_rate', formulaCode: 'ACC_COST_CALC', expression: 'Unit rate', result: `Rs. ${item.rate}`, description: 'Unit rate.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-black text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.costPerPiece.toFixed(2)} / pieces</span>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Accessory Cost Per Piece', token: 'acc_cost_per_piece', formulaCode: 'ACC_COST_CALC', expression: 'REQ * RATE', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Cost per piece.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Accessory Formula Inspection', token: 'acc_cost_per_piece', formulaCode: 'ACC_COST_CALC', expression: 'REQ * RATE', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
                              <button type="button" onClick={() => showToast('Accessory summary inspected.')} className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center" title="Summary"><Calculator className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => {
                                setEditCalcModalTarget({ step: 5, item, index: idx });
                                setEditCalcFormData({ name: item.name, qty: item.reqQty.toString(), rate: item.rate.toString(), dimLength: '0', dimWidth: '0' });
                              }} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center" title="Edit Row"><SquarePen className="w-3.5 h-3.5" /></button>
                              {calcAccessoryItems.length > 1 && (
                                <button type="button" onClick={() => {
                                  setCalcAccessoryItems(prev => prev.filter((_, i) => i !== idx));
                                  showToast('Accessory removed.');
                                }} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Accessories</span>
                  <span className="text-base font-black text-slate-900">Rs. {step5TotalAccessoriesCost.toFixed(2)}</span>
                </div>
              </div>

              {/* STEP 6: ADDITIONAL MATERIALS & TOOLING */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">6</span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">ADDITIONAL MATERIALS &amp; TOOLING</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setToolingItems(prev => [...prev, { id: `t_${Date.now()}`, name: 'Custom Die Plate', reqQty: 1, batchRate: 3500 }]);
                      showToast('Tooling item added successfully.');
                    }}
                    className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Material</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">#</th>
                        <th className="py-3 px-3 min-w-[220px]">ITEM / DIE <span className="text-[10px] font-mono font-normal text-slate-400 block">tool_name</span></th>
                        <th className="py-3 px-3 min-w-[150px]">REQ QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">tool_req_qty</span></th>
                        <th className="py-3 px-3 min-w-[150px]">BATCH RATE <span className="text-[10px] font-mono font-normal text-slate-400 block">tool_batch_rate</span></th>
                        <th className="py-3 px-3 min-w-[160px]">AMORTIZED / PC <span className="text-[10px] font-mono font-normal text-slate-400 block">tool_amortized_pc</span></th>
                        <th className="py-3 px-3 text-center w-36">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {computedStep6Tooling.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>{item.reqQty} pieces</span>
                              <button type="button" onClick={() => {
                                const q = prompt('Enter Tooling Required Qty:', item.reqQty.toString());
                                if (q !== null) {
                                  const val = parseInt(q) || item.reqQty;
                                  setToolingItems(prev => prev.map((ti, i) => i === idx ? { ...ti, reqQty: val } : ti));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Tooling Required Quantity', token: 'tool_req_qty', formulaCode: 'TOOL_AMORTIZED_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `${item.reqQty} pieces`, description: 'Required quantity.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.batchRate.toLocaleString()}/piece</span>
                              <button type="button" onClick={() => {
                                const r = prompt('Enter Tooling Batch Rate:', item.batchRate.toString());
                                if (r !== null) {
                                  const val = parseFloat(r) || item.batchRate;
                                  setToolingItems(prev => prev.map((ti, i) => i === idx ? { ...ti, batchRate: val } : ti));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Tooling Batch Rate', token: 'tool_batch_rate', formulaCode: 'TOOL_AMORTIZED_CALC', expression: 'Batch rate', result: `Rs. ${item.batchRate}`, description: 'Batch rate.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-black text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.amortizedPerPiece.toFixed(2)} / pieces</span>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Tooling Amortized Per Piece', token: 'tool_amortized_pc', formulaCode: 'TOOL_AMORTIZED_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.amortizedPerPiece.toFixed(2)}`, description: 'Amortized cost per piece.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Tooling Inspection', token: 'tool_amortized_pc', formulaCode: 'TOOL_AMORTIZED_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.amortizedPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
                              <button type="button" onClick={() => showToast('Tooling summary inspected.')} className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center" title="Summary"><Calculator className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => {
                                setEditCalcModalTarget({ step: 6, item, index: idx });
                                setEditCalcFormData({ name: item.name, qty: item.reqQty.toString(), rate: item.batchRate.toString(), dimLength: '0', dimWidth: '0' });
                              }} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center" title="Edit Row"><SquarePen className="w-3.5 h-3.5" /></button>
                              {toolingItems.length > 1 && (
                                <button type="button" onClick={() => {
                                  setToolingItems(prev => prev.filter((_, i) => i !== idx));
                                  showToast('Tooling item removed.');
                                }} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Tooling &amp; Plates</span>
                  <span className="text-base font-black text-slate-900">Rs. {step6TotalToolingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* STEP 7: CONVERSION SERVICES */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">7</span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">CONVERSION SERVICES</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setConversionItems(prev => [
                          ...prev,
                          { id: `cs_${Date.now()}`, name: 'General Conversion Service', reqQty: 1000, rate: 0.50, unit: 'sheets' }
                        ]);
                        showToast('Conversion service added successfully.');
                      }}
                      className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Service</span>
                    </button>
                    <div className="w-48">
                      <select
                        value={selectedAddServiceId}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddConversionService(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#7c3aed]"
                      >
                        <option value="">+ Select preset...</option>
                        {packagingServices.map(ps => (<option key={ps.id} value={ps.name}>{ps.name}</option>))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">#</th>
                        <th className="py-3 px-3 min-w-[220px]">SERVICE <span className="text-[10px] font-mono font-normal text-slate-400 block">conv_service</span></th>
                        <th className="py-3 px-3 min-w-[150px]">REQ QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">conv_req_qty</span></th>
                        <th className="py-3 px-3 min-w-[140px]">RATE <span className="text-[10px] font-mono font-normal text-slate-400 block">conv_rate</span></th>
                        <th className="py-3 px-3 min-w-[160px]">COST / PIECE <span className="text-[10px] font-mono font-normal text-slate-400 block">conv_cost_per_piece</span></th>
                        <th className="py-3 px-3 text-center w-36">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {computedStep7Conversion.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>{item.reqQty} {item.unit}</span>
                              <button type="button" onClick={() => {
                                const q = prompt('Enter Conversion Required Qty:', item.reqQty.toString());
                                if (q !== null) {
                                  const val = parseFloat(q) || item.reqQty;
                                  setConversionItems(prev => prev.map((ci, i) => i === idx ? { ...ci, reqQty: val } : ci));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Conversion Required Quantity', token: 'conv_req_qty', formulaCode: 'CONV_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `${item.reqQty} ${item.unit}`, description: 'Required quantity.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.rate.toFixed(2)}</span>
                              <button type="button" onClick={() => {
                                const r = prompt('Enter Conversion Rate:', item.rate.toString());
                                if (r !== null) {
                                  const val = parseFloat(r) || item.rate;
                                  setConversionItems(prev => prev.map((ci, i) => i === idx ? { ...ci, rate: val } : ci));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Conversion Unit Rate', token: 'conv_rate', formulaCode: 'CONV_COST_CALC', expression: 'Unit rate', result: `Rs. ${item.rate.toFixed(2)}`, description: 'Unit rate.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-black text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.costPerPiece.toFixed(2)} / pc</span>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Conversion Cost Per Piece', token: 'conv_cost_per_piece', formulaCode: 'CONV_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Cost per piece.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Conversion Inspection', token: 'conv_cost_per_piece', formulaCode: 'CONV_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
                              <button type="button" onClick={() => showToast('Conversion summary inspected.')} className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center" title="Summary"><Calculator className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => {
                                setEditCalcModalTarget({ step: 7, item, index: idx });
                                setEditCalcFormData({ name: item.name, qty: item.reqQty.toString(), rate: item.rate.toString(), dimLength: '0', dimWidth: '0' });
                              }} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center" title="Edit Row"><SquarePen className="w-3.5 h-3.5" /></button>
                              {conversionItems.length > 1 && (
                                <button type="button" onClick={() => {
                                  setConversionItems(prev => prev.filter((_, i) => i !== idx));
                                  showToast('Conversion service removed.');
                                }} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Converting Operations</span>
                  <span className="text-base font-black text-slate-900">Rs. {step7TotalConversionCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* STEP 8: FINISHING TREATMENTS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">8</span>
                    <span className="text-[11px] font-black tracking-wider uppercase text-slate-400">FINISHING TREATMENTS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFinishingItems(prev => [
                          ...prev,
                          { id: `fs_item_${Date.now()}`, name: 'Thermal Matte Lamination', dimLength: 28, dimWidth: 40, reqQty: 1000, rate: 1.95, unit: 'sheets' }
                        ]);
                        showToast('Finishing treatment added successfully.');
                      }}
                      className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Finishing</span>
                    </button>
                    <div className="w-48">
                      <select
                        value={selectedAddFinishingId}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddFinishingTreatment(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#7c3aed]"
                      >
                        <option value="">+ Select preset...</option>
                        {finishingServices.map(fs => (<option key={fs.id} value={fs.name}>{fs.name}</option>))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">#</th>
                        <th className="py-3 px-3 min-w-[200px]">FINISHING <span className="text-[10px] font-mono font-normal text-slate-400 block">finish_name</span></th>
                        <th className="py-3 px-3 min-w-[150px]">DIMENSION <span className="text-[10px] font-mono font-normal text-slate-400 block">finish_dim</span></th>
                        <th className="py-3 px-3 min-w-[150px]">REQ QTY <span className="text-[10px] font-mono font-normal text-slate-400 block">finish_req_qty</span></th>
                        <th className="py-3 px-3 min-w-[140px]">RATE <span className="text-[10px] font-mono font-normal text-slate-400 block">finish_rate</span></th>
                        <th className="py-3 px-3 min-w-[160px]">COST / PIECE <span className="text-[10px] font-mono font-normal text-slate-400 block">finish_cost_per_piece</span></th>
                        <th className="py-3 px-3 text-center w-36">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {computedStep8Finishing.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-3">
                            <div className="inline-flex items-center gap-1 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-[#7c3aed]">
                              <span>{item.dimLength} × {item.dimWidth}</span>
                              <button type="button" onClick={() => {
                                const dl = prompt('Enter Dimension Length:', item.dimLength.toString());
                                const dw = prompt('Enter Dimension Width:', item.dimWidth.toString());
                                if (dl !== null && dw !== null) {
                                  const lVal = parseFloat(dl) || item.dimLength;
                                  const wVal = parseFloat(dw) || item.dimWidth;
                                  setFinishingItems(prev => prev.map((fi, i) => i === idx ? { ...fi, dimLength: lVal, dimWidth: wVal } : fi));
                                }
                              }} className="hover:text-slate-900"><Ruler className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>{item.reqQty} {item.unit}</span>
                              <button type="button" onClick={() => {
                                const q = prompt('Enter Finishing Required Qty:', item.reqQty.toString());
                                if (q !== null) {
                                  const val = parseFloat(q) || item.reqQty;
                                  setFinishingItems(prev => prev.map((fi, i) => i === idx ? { ...fi, reqQty: val } : fi));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Finishing Required Quantity', token: 'finish_req_qty', formulaCode: 'FINISH_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `${item.reqQty} ${item.unit}`, description: 'Required quantity.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-bold text-slate-700">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.rate.toFixed(2)}</span>
                              <button type="button" onClick={() => {
                                const r = prompt('Enter Finishing Rate:', item.rate.toString());
                                if (r !== null) {
                                  const val = parseFloat(r) || item.rate;
                                  setFinishingItems(prev => prev.map((fi, i) => i === idx ? { ...fi, rate: val } : fi));
                                }
                              }} className="text-[#7c3aed]"><Pencil className="w-3 h-3" /></button>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Finishing Unit Rate', token: 'finish_rate', formulaCode: 'FINISH_COST_CALC', expression: 'Unit rate', result: `Rs. ${item.rate.toFixed(2)}`, description: 'Unit rate.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-black text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>Rs. {item.costPerPiece.toFixed(2)} / pc</span>
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Finishing Cost Per Piece', token: 'finish_cost_per_piece', formulaCode: 'FINISH_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Cost per piece.' })} className="text-slate-400 hover:text-[#7c3aed]"><HelpCircle className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Finishing Inspection', token: 'finish_cost_per_piece', formulaCode: 'FINISH_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
                              <button type="button" onClick={() => showToast('Finishing summary inspected.')} className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center" title="Summary"><Calculator className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => {
                                setEditCalcModalTarget({ step: 8, item, index: idx });
                                setEditCalcFormData({ name: item.name, qty: item.reqQty.toString(), rate: item.rate.toString(), dimLength: item.dimLength.toString(), dimWidth: item.dimWidth.toString() });
                              }} className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center" title="Edit Row"><SquarePen className="w-3.5 h-3.5" /></button>
                              {finishingItems.length > 1 && (
                                <button type="button" onClick={() => {
                                  setFinishingItems(prev => prev.filter((_, i) => i !== idx));
                                  showToast('Finishing treatment removed.');
                                }} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Total Finishing</span>
                  <span className="text-base font-black text-slate-900">Rs. {step8TotalFinishingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* STEP 9: COMMERCIAL ROLL-UP / COST SUMMARY PER PIECE ROLL-UP */}
              <div className="bg-white rounded-3xl border border-slate-200/90 px-6 py-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#7c3aed] font-black text-xs flex items-center justify-center">9</span>
                      <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase">STEP 9: COMMERCIAL ROLL-UP / Cost Summary Per Piece Roll-Up</h3>
                    </div>
                    <p className="text-xs text-slate-500 pl-8.5">Consolidated direct costs, tooling amortizations, machine operations, factory overheads, and target profit margins.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => {
                      navigator.clipboard.writeText(`Quote: Rs. ${step9RollUp.finalQuoteUnit}/pc (Net: Rs. ${step9RollUp.netFactoryCostUnit})`);
                      showToast('Cost breakdown copied to clipboard.');
                    }} className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs">
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Breakdown</span>
                    </button>
                    <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Commercial Roll-Up Formula', token: 'final_quote', formulaCode: 'QUOTE_ROLLUP', expression: 'NET_FACTORY_COST + MARGIN_UNIT', result: `Rs. ${step9RollUp.finalQuoteUnit} / pc`, description: 'Consolidated commercial quote breakdown.' })} className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-2xs">
                      <Sigma className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sigma Formula Inspector</span>
                    </button>
                  </div>
                </div>

                {/* Cost Composition Breakdown Bar */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#f8fafc] border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-[#7c3aed]" />Cost Composition Breakdown</span>
                    <span className="text-[11px] font-mono text-slate-400">100% Normalized Allocation</span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: `${step9RollUp.pMat}%` }} className="bg-violet-600 transition-all duration-500" title={`Substrates: ${step9RollUp.pMat}%`} />
                    <div style={{ width: `${step9RollUp.pAcc}%` }} className="bg-amber-500 transition-all duration-500" title={`Accessories: ${step9RollUp.pAcc}%`} />
                    <div style={{ width: `${step9RollUp.pTool}%` }} className="bg-teal-600 transition-all duration-500" title={`Tooling: ${step9RollUp.pTool}%`} />
                    <div style={{ width: `${step9RollUp.pConvFin}%` }} className="bg-blue-600 transition-all duration-500" title={`Conversion & Finishing: ${step9RollUp.pConvFin}%`} />
                    <div style={{ width: `${step9RollUp.pOverhead}%` }} className="bg-slate-500 transition-all duration-500" title={`Overheads: ${step9RollUp.pOverhead}%`} />
                    <div style={{ width: `${step9RollUp.pMargin}%` }} className="bg-emerald-500 transition-all duration-500" title={`Margin: ${step9RollUp.pMargin}%`} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-600" />Substrates ({step9RollUp.pMat}%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Accessories ({step9RollUp.pAcc}%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-600" />Tooling / Plates ({step9RollUp.pTool}%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" />Conversion &amp; Finishing ({step9RollUp.pConvFin}%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" />Overheads ({step9RollUp.pOverhead}%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Margin ({step9RollUp.pMargin}%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Table */}
                  <div className="lg:col-span-7 rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                        <tr>
                          <th className="py-3 px-3 w-12 text-center"># <span className="text-[10px] font-mono font-normal text-slate-400 block">seq</span></th>
                          <th className="py-3 px-3 min-w-[200px]">COST ELEMENT <span className="text-[10px] font-mono font-normal text-slate-400 block">element_token</span></th>
                          <th className="py-3 px-3 min-w-[130px]">BATCH TOTAL <span className="text-[10px] font-mono font-normal text-slate-400 block">batch_pkr</span></th>
                          <th className="py-3 px-3 min-w-[120px]">COST / PIECE <span className="text-[10px] font-mono font-normal text-slate-400 block">cost_unit</span></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">1</td>
                          <td className="py-3 px-3 font-bold text-slate-900">1. Substrate Materials (All Layers)<span className="text-[10px] font-mono text-[#7c3aed] block font-normal">mat_cost_unit</span></td>
                          <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.matBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.matCostUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">2</td>
                          <td className="py-3 px-3 font-bold text-slate-900">2. Accessories Material<span className="text-[10px] font-mono text-[#7c3aed] block font-normal">acc_cost_unit</span></td>
                          <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.accBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.accCostUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">3</td>
                          <td className="py-3 px-3 font-bold text-slate-900">3. Additional Tooling &amp; Materials<span className="text-[10px] font-mono text-[#7c3aed] block font-normal">tooling_cost_unit</span></td>
                          <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.toolingBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.toolingCostUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">4</td>
                          <td className="py-3 px-3 font-bold text-slate-900">4. Packaging Conversion Operations<span className="text-[10px] font-mono text-[#7c3aed] block font-normal">pack_srv_unit</span></td>
                          <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.packSrvBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.packSrvUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">5</td>
                          <td className="py-3 px-3 font-bold text-slate-900">5. Post-Press Finishing Treatments<span className="text-[10px] font-mono text-[#7c3aed] block font-normal">fin_srv_unit</span></td>
                          <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.finSrvBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.finSrvUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-[#f8fafc]/80 border-t-2 border-slate-200 font-bold">
                          <td className="py-3 px-3 text-center">—</td>
                          <td className="py-3 px-3 text-[#7c3aed] font-extrabold uppercase">PRIME DIRECT MANUFACTURING COST</td>
                          <td className="py-3 px-3 font-mono">Rs. {step9RollUp.primeBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black">Rs. {step9RollUp.primeCostUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">6</td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <div className="flex items-center justify-between">
                              <span>Factory Overheads</span>
                              <div className="flex items-center gap-1 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 font-mono text-[#7c3aed]">
                                <input
                                  type="number"
                                  value={calcOverheadPerc}
                                  onChange={(e) => setCalcOverheadPerc(parseFloat(e.target.value) || 0)}
                                  className="w-10 bg-transparent text-right font-bold focus:outline-none"
                                />
                                <span>%</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#7c3aed] block font-normal">overhead_unit</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.overheadBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.overheadUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="bg-[#f8fafc]/80 border-t-2 border-slate-200 font-bold">
                          <td className="py-3 px-3 text-center">—</td>
                          <td className="py-3 px-3 text-[#7c3aed] font-extrabold uppercase">NET FACTORY COST (PRIME + OVERHEADS)</td>
                          <td className="py-3 px-3 font-mono">Rs. {step9RollUp.netFactoryCostBatch.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black">Rs. {step9RollUp.netFactoryCostUnit.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">7</td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <div className="flex items-center justify-between">
                              <span>Commercial Profit Margin</span>
                              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono text-emerald-700">
                                <input
                                  type="number"
                                  value={calcProfitMarginPerc}
                                  onChange={(e) => setCalcProfitMarginPerc(parseFloat(e.target.value) || 0)}
                                  className="w-10 bg-transparent text-right font-bold focus:outline-none"
                                />
                                <span>% Markup</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#7c3aed] block font-normal">margin_unit</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-700 font-bold">+ Rs. {step9RollUp.marginBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3 px-3 font-mono font-black text-emerald-700">+ Rs. {step9RollUp.marginUnit.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Right Highlight Card & Volume Price Ladder */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-3xl bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] text-white p-6 shadow-xl space-y-5 relative overflow-hidden">
                      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-mono font-bold uppercase tracking-wider text-white">COMMERCIAL QUOTE PER PIECE</span>
                        <span className="text-[11px] font-mono text-white/80">Run: {parseInt(calcOrderQty || '1000').toLocaleString()} Pcs</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 block">FINAL_UNIT_QUOTE</span>
                        <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                          Rs. {step9RollUp.finalQuoteUnit.toFixed(2)} <span className="text-xs font-sans font-medium text-white/80">/ piece</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                        <div className="bg-black/15 rounded-2xl p-3 backdrop-blur-xs">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 block mb-0.5">NET FACTORY COST</span>
                          <span className="text-base font-black font-mono">Rs. {step9RollUp.netFactoryCostUnit.toFixed(2)}</span>
                        </div>
                        <div className="bg-black/15 rounded-2xl p-3 backdrop-blur-xs">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 block mb-0.5">BATCH TOTAL QUOTE</span>
                          <span className="text-base font-black font-mono">Rs. {step9RollUp.finalQuoteBatch.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-white/90 pt-1">
                        <span>{calcSelectedStyle} ({calcLength} × {calcWidth} × {calcHeight}")</span>
                        <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono">{calcSelectedPly}-Ply Board</span>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-tight text-slate-900 uppercase">VOLUME PRICE LADDER</span>
                        <span className="text-[10px] font-mono text-slate-400">Tooling Amortization</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {step9RollUp.ladders.map((tier) => (
                          <div key={tier.pcs} className={`p-3 rounded-2xl border transition ${tier.pcs === parseInt(calcOrderQty || '1000') ? 'bg-violet-50/80 border-violet-300 ring-2 ring-violet-400/20' : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'}`}>
                            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{tier.pcs.toLocaleString()} PCS</div>
                            <div className="text-sm font-black font-mono text-slate-900 mt-0.5">Rs. {tier.unit.toFixed(2)}</div>
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Batch: {tier.batch.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DIMENSION ADJUSTMENT POPUP MODAL */}
      {dimPopupTarget && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-slate-900">
                  Adjust {dimPopupTarget.type === 'cut' ? 'Cut' : 'Sheet'} Size (Layer {dimPopupTarget.plyIndex})
                </h3>
              </div>
              <button type="button" onClick={() => setDimPopupTarget(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between font-mono text-slate-700">
                <span className="font-bold text-slate-500">Current dimensions</span>
                <span className="font-black">L = {dimPopupTarget.currentL.toFixed(2)}, W = {dimPopupTarget.currentW.toFixed(2)}</span>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dimPopupCustom}
                  onChange={(e) => setDimPopupCustom(e.target.checked)}
                  className="w-4 h-4 rounded text-[#7c3aed] focus:ring-violet-400 border-slate-300"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Use Custom Dimensions</span>
                  <span className="text-[11px] text-slate-500">Replace the current length and width for this material line</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Length (L)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      disabled={!dimPopupCustom}
                      value={dimPopupLength}
                      onChange={(e) => setDimPopupLength(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl font-mono font-bold pr-8 ${!dimPopupCustom ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-[11px]">in</span>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Width (W)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      disabled={!dimPopupCustom}
                      value={dimPopupWidth}
                      onChange={(e) => setDimPopupWidth(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-xl font-mono font-bold pr-8 ${!dimPopupCustom ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-[11px]">in</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDimPopupTarget(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (dimPopupCustom) {
                      const lVal = parseFloat(dimPopupLength);
                      const wVal = parseFloat(dimPopupWidth);
                      if (!isNaN(lVal) && !isNaN(wVal)) {
                        if (dimPopupTarget.type === 'cut') {
                          updateCalcLayer(dimPopupTarget.plyIndex, { cutLength: lVal, cutWidth: wVal });
                        } else {
                          updateCalcLayer(dimPopupTarget.plyIndex, { sheetLength: lVal, sheetWidth: wVal });
                        }
                        showToast('Dimensions updated successfully.');
                      }
                    }
                    setDimPopupTarget(null);
                  }}
                  className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-xs transition"
                >
                  Save Dimensions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED ROW EDIT MODAL FOR COST CALCULATOR (STEPS 4-8) */}
      {editCalcModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-violet-50 text-[#7c3aed] border border-violet-200">Step {editCalcModalTarget.step} Row Editor</span>
                <h3 className="font-black text-base text-slate-900 mt-1">Edit Item Parameters</h3>
              </div>
              <button type="button" onClick={() => setEditCalcModalTarget(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const { step, index } = editCalcModalTarget;
              const newQty = parseFloat(editCalcFormData.qty) || 0;
              const newRate = parseFloat(editCalcFormData.rate) || 0;
              const newLen = parseFloat(editCalcFormData.dimLength) || 0;
              const newWid = parseFloat(editCalcFormData.dimWidth) || 0;

              if (step === 4) {
                updateCalcLayer(computedStep4Layers[index].plyIndex, { cutLength: newLen, cutWidth: newWid, rate: newRate });
              } else if (step === 5) {
                setCalcAccessoryItems(prev => prev.map((ai, i) => i === index ? { ...ai, reqQty: newQty, rate: newRate } : ai));
              } else if (step === 6) {
                setToolingItems(prev => prev.map((ti, i) => i === index ? { ...ti, reqQty: newQty, batchRate: newRate } : ti));
              } else if (step === 7) {
                setConversionItems(prev => prev.map((ci, i) => i === index ? { ...ci, reqQty: newQty, rate: newRate } : ci));
              } else if (step === 8) {
                setFinishingItems(prev => prev.map((fi, i) => i === index ? { ...fi, reqQty: newQty, rate: newRate, dimLength: newLen, dimWidth: newWid } : fi));
              }

              showToast('Cost calculator row updated successfully.');
              setEditCalcModalTarget(null);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item / Name</label>
                <input type="text" value={editCalcFormData.name} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Quantity</label>
                  <input type="number" step="any" value={editCalcFormData.qty} onChange={(e) => setEditCalcFormData({ ...editCalcFormData, qty: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold" required />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (PKR)</label>
                  <input type="number" step="any" value={editCalcFormData.rate} onChange={(e) => setEditCalcFormData({ ...editCalcFormData, rate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold" required />
                </div>
              </div>
              {(editCalcModalTarget.step === 4 || editCalcModalTarget.step === 8) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dimension Length</label>
                    <input type="number" step="any" value={editCalcFormData.dimLength} onChange={(e) => setEditCalcFormData({ ...editCalcFormData, dimLength: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dimension Width</label>
                    <input type="number" step="any" value={editCalcFormData.dimWidth} onChange={(e) => setEditCalcFormData({ ...editCalcFormData, dimWidth: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                  </div>
                </div>
              )}
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditCalcModalTarget(null)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INFORMATIVE MODAL */}
      {activeInfoTooltip && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-violet-50 text-[#7c3aed] border border-violet-200">Token: {activeInfoTooltip.token}</span>
                <h3 className="font-black text-base text-slate-900 mt-1">{activeInfoTooltip.title}</h3>
              </div>
              <button type="button" onClick={() => setActiveInfoTooltip(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">{activeInfoTooltip.description}</p>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase text-slate-400">Formula Code</span><span className="font-mono font-bold text-[#7c3aed]">{activeInfoTooltip.formulaCode}</span></div>
                <div><span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Expression</span><code className="block font-mono text-[11px] font-bold text-slate-800 bg-white p-2 rounded-xl border border-slate-200">{activeInfoTooltip.expression}</code></div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Evaluated Result</span>
                <span className="font-mono text-sm font-black text-emerald-700">{String(activeInfoTooltip.result)}</span>
              </div>
            </div>
            <div className="pt-1 flex justify-end">
              <button type="button" onClick={() => setActiveInfoTooltip(null)} className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl transition">Got It</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/ADD VARIABLE MODAL */}
      {isVarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingVarId ? 'Edit Variable' : 'Add Variable'}</h3>
              <button type="button" onClick={() => setIsVarModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingVarId) {
                setVariables(prev => prev.map(v => v.id === editingVarId ? { ...v, ...varFormData } : v));
                showToast('Variable updated.');
              } else {
                setVariables(prev => [...prev, { id: `v_${Date.now()}`, ...varFormData }]);
                showToast('Variable added.');
              }
              setIsVarModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Code</label>
                <input type="text" value={varFormData.code} onChange={(e) => setVarFormData({ ...varFormData, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold" required />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={varFormData.name} onChange={(e) => setVarFormData({ ...varFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" value={varFormData.category} onChange={(e) => setVarFormData({ ...varFormData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default Value</label>
                  <input type="text" value={varFormData.defaultValue} onChange={(e) => setVarFormData({ ...varFormData, defaultValue: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsVarModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD FORMULA MODAL */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingFormulaId ? 'Edit Formula' : 'Add Formula'}</h3>
              <button type="button" onClick={() => setIsFormulaModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingFormulaId) {
                setFormulas(prev => prev.map(f => f.id === editingFormulaId ? { ...f, ...formulaFormData } : f));
                showToast('Formula updated.');
              } else {
                setFormulas(prev => [...prev, { id: `f_${Date.now()}`, sr: formulas.length + 1, ...formulaFormData, status: 'Active' }]);
                showToast('Formula added.');
              }
              setIsFormulaModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={formulaFormData.name} onChange={(e) => setFormulaFormData({ ...formulaFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Code</label>
                <input type="text" value={formulaFormData.code} onChange={(e) => setFormulaFormData({ ...formulaFormData, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold" required />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expression</label>
                <textarea rows={3} value={formulaFormData.expression} onChange={(e) => setFormulaFormData({ ...formulaFormData, expression: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold" required />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsFormulaModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD PACKAGING STYLE MODAL */}
      {isStyleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingStyleId ? 'Edit Packaging Style' : 'Add Packaging Style'}</h3>
              <button type="button" onClick={() => setIsStyleModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingStyleId) {
                setPackagingStyles(prev => prev.map(s => s.id === editingStyleId ? { ...s, name: styleFormData.name, description: styleFormData.description, status: styleFormData.status } : s));
                showToast('Packaging style updated.');
              } else {
                setPackagingStyles(prev => [...prev, { id: Date.now(), name: styleFormData.name, description: styleFormData.description, variablesCount: 0, formulasCount: 1, status: styleFormData.status }]);
                showToast('Packaging style added.');
              }
              setIsStyleModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Style Name</label>
                <input type="text" value={styleFormData.name} onChange={(e) => setStyleFormData({ ...styleFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea rows={3} value={styleFormData.description} onChange={(e) => setStyleFormData({ ...styleFormData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" required />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsStyleModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD RAW MATERIAL MODAL */}
      {isRawMatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingRawMatId ? 'Edit Raw Material' : 'Add Raw Material'}</h3>
              <button type="button" onClick={() => setIsRawMatModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingRawMatId) {
                setRawMaterials(prev => prev.map(m => m.id === editingRawMatId ? { ...m, name: rawMatFormData.name, category: rawMatFormData.category, defaultRate: parseFloat(rawMatFormData.defaultRate) || 0, defaultGsm: parseInt(rawMatFormData.defaultGsm) || 0 } : m));
                showToast('Raw material updated.');
              } else {
                setRawMaterials(prev => [...prev, { id: `rm_${Date.now()}`, name: rawMatFormData.name, category: rawMatFormData.category, defaultRate: parseFloat(rawMatFormData.defaultRate) || 0, unit: 'kg', defaultGsm: parseInt(rawMatFormData.defaultGsm) || 0, description: 'Added' }]);
                showToast('Raw material added.');
              }
              setIsRawMatModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={rawMatFormData.name} onChange={(e) => setRawMatFormData({ ...rawMatFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default GSM</label>
                  <input type="number" value={rawMatFormData.defaultGsm} onChange={(e) => setRawMatFormData({ ...rawMatFormData, defaultGsm: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Default Rate (Rs)</label>
                  <input type="number" value={rawMatFormData.defaultRate} onChange={(e) => setRawMatFormData({ ...rawMatFormData, defaultRate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsRawMatModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD CONSUMABLE MODAL */}
      {isConsumableModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingConsumableId ? 'Edit Consumable' : 'Add Consumable'}</h3>
              <button type="button" onClick={() => setIsConsumableModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingConsumableId) {
                setConsumables(prev => prev.map(c => c.id === editingConsumableId ? { ...c, name: consumableFormData.name, category: consumableFormData.category, defaultRate: parseFloat(consumableFormData.defaultRate) || 0, unit: consumableFormData.unit } : c));
                showToast('Consumable updated.');
              } else {
                setConsumables(prev => [...prev, { id: `c_${Date.now()}`, name: consumableFormData.name, category: consumableFormData.category, defaultRate: parseFloat(consumableFormData.defaultRate) || 0, unit: consumableFormData.unit, description: 'Added' }]);
                showToast('Consumable added.');
              }
              setIsConsumableModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={consumableFormData.name} onChange={(e) => setConsumableFormData({ ...consumableFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" value={consumableFormData.category} onChange={(e) => setConsumableFormData({ ...consumableFormData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (Rs)</label>
                  <input type="number" value={consumableFormData.defaultRate} onChange={(e) => setConsumableFormData({ ...consumableFormData, defaultRate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsConsumableModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD ACCESSORY MODAL */}
      {isAccessoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingAccessoryId ? 'Edit Accessory' : 'Add Accessory'}</h3>
              <button type="button" onClick={() => setIsAccessoryModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingAccessoryId) {
                setAccessories(prev => prev.map(a => a.id === editingAccessoryId ? { ...a, name: accessoryFormData.name, code: accessoryFormData.code, category: accessoryFormData.category, defaultRate: parseFloat(accessoryFormData.defaultRate) || 0, unit: accessoryFormData.unit } : a));
                showToast('Accessory updated.');
              } else {
                setAccessories(prev => [...prev, { id: `acc_${Date.now()}`, name: accessoryFormData.name, code: accessoryFormData.code, category: accessoryFormData.category, defaultRate: parseFloat(accessoryFormData.defaultRate) || 0, unit: accessoryFormData.unit, description: 'Added' }]);
                showToast('Accessory added.');
              }
              setIsAccessoryModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={accessoryFormData.name} onChange={(e) => setAccessoryFormData({ ...accessoryFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code</label>
                  <input type="text" value={accessoryFormData.code} onChange={(e) => setAccessoryFormData({ ...accessoryFormData, code: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (Rs)</label>
                  <input type="number" value={accessoryFormData.defaultRate} onChange={(e) => setAccessoryFormData({ ...accessoryFormData, defaultRate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAccessoryModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD PACKAGING SERVICE MODAL */}
      {isPackServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingPackServiceId ? 'Edit Packaging Service' : 'Add Packaging Service'}</h3>
              <button type="button" onClick={() => setIsPackServiceModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingPackServiceId) {
                setPackagingServices(prev => prev.map(ps => ps.id === editingPackServiceId ? { ...ps, name: packServiceFormData.name, machine: packServiceFormData.machine, defaultRate: parseFloat(packServiceFormData.defaultRate) || 0, setupCharges: parseFloat(packServiceFormData.setupCharges) || 0 } : ps));
                showToast('Packaging service updated.');
              } else {
                setPackagingServices(prev => [...prev, { id: `ps_${Date.now()}`, name: packServiceFormData.name, category: 'Offset Printing', machine: packServiceFormData.machine, unit: packServiceFormData.unit, defaultRate: parseFloat(packServiceFormData.defaultRate) || 0, setupCharges: parseFloat(packServiceFormData.setupCharges) || 0, status: 'Active', description: 'Added' }]);
                showToast('Packaging service added.');
              }
              setIsPackServiceModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Name</label>
                <input type="text" value={packServiceFormData.name} onChange={(e) => setPackServiceFormData({ ...packServiceFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Machine</label>
                  <input type="text" value={packServiceFormData.machine} onChange={(e) => setPackServiceFormData({ ...packServiceFormData, machine: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (Rs)</label>
                  <input type="number" value={packServiceFormData.defaultRate} onChange={(e) => setPackServiceFormData({ ...packServiceFormData, defaultRate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPackServiceModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD FINISHING SERVICE MODAL */}
      {isFinServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingFinServiceId ? 'Edit Finishing Service' : 'Add Finishing Service'}</h3>
              <button type="button" onClick={() => setIsFinServiceModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingFinServiceId) {
                setFinishingServices(prev => prev.map(fs => fs.id === editingFinServiceId ? { ...fs, name: finServiceFormData.name, spec: finServiceFormData.spec, defaultRate: parseFloat(finServiceFormData.defaultRate) || 0, setupCharges: parseFloat(finServiceFormData.setupCharges) || 0 } : fs));
                showToast('Finishing service updated.');
              } else {
                setFinishingServices(prev => [...prev, { id: `fs_${Date.now()}`, name: finServiceFormData.name, category: 'Lamination', spec: finServiceFormData.spec, unit: finServiceFormData.unit, defaultRate: parseFloat(finServiceFormData.defaultRate) || 0, setupCharges: parseFloat(finServiceFormData.setupCharges) || 0, status: 'Active', description: 'Added' }]);
                showToast('Finishing service added.');
              }
              setIsFinServiceModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Name</label>
                <input type="text" value={finServiceFormData.name} onChange={(e) => setFinServiceFormData({ ...finServiceFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specification</label>
                  <input type="text" value={finServiceFormData.spec} onChange={(e) => setFinServiceFormData({ ...finServiceFormData, spec: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (Rs)</label>
                  <input type="number" value={finServiceFormData.defaultRate} onChange={(e) => setFinServiceFormData({ ...finServiceFormData, defaultRate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsFinServiceModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD MATERIAL RATE MODAL */}
      {isMatRateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingMatRateId ? 'Edit Material Rate' : 'Add Material Rate'}</h3>
              <button type="button" onClick={() => setIsMatRateModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingMatRateId) {
                setMaterialRates(prev => prev.map(mr => mr.id === editingMatRateId ? { ...mr, name: matRateFormData.name, category: matRateFormData.category, rate: parseFloat(matRateFormData.rate) || 0 } : mr));
                showToast('Material rate updated.');
              } else {
                setMaterialRates(prev => [...prev, { id: `sr_${Date.now()}`, name: matRateFormData.name, category: matRateFormData.category, serviceType: 'Material Rate', unit: matRateFormData.unit, rate: parseFloat(matRateFormData.rate) || 0, description: 'Added' }]);
                showToast('Material rate added.');
              }
              setIsMatRateModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={matRateFormData.name} onChange={(e) => setMatRateFormData({ ...matRateFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" value={matRateFormData.category} onChange={(e) => setMatRateFormData({ ...matRateFormData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (Rs)</label>
                  <input type="number" value={matRateFormData.rate} onChange={(e) => setMatRateFormData({ ...matRateFormData, rate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsMatRateModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD SERVICE RATE MODAL */}
      {isServRateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingServRateId ? 'Edit Service Rate' : 'Add Service Rate'}</h3>
              <button type="button" onClick={() => setIsServRateModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingServRateId) {
                setServicesRates(prev => prev.map(sr => sr.id === editingServRateId ? { ...sr, name: servRateFormData.name, category: servRateFormData.category, rate: parseFloat(servRateFormData.rate) || 0 } : sr));
                showToast('Service rate updated.');
              } else {
                setServicesRates(prev => [...prev, { id: `sr_${Date.now()}`, name: servRateFormData.name, category: servRateFormData.category, serviceType: 'Service Rate', unit: servRateFormData.unit, rate: parseFloat(servRateFormData.rate) || 0, description: 'Added' }]);
                showToast('Service rate added.');
              }
              setIsServRateModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name</label>
                <input type="text" value={servRateFormData.name} onChange={(e) => setServRateFormData({ ...servRateFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" value={servRateFormData.category} onChange={(e) => setServRateFormData({ ...servRateFormData, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate (Rs)</label>
                  <input type="number" value={servRateFormData.rate} onChange={(e) => setServRateFormData({ ...servRateFormData, rate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsServRateModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingProductId) {
                setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, ...productFormData } : p));
                showToast('Product updated.');
              } else {
                setProducts(prev => [...prev, { id: `prod_${Date.now()}`, ...productFormData, length: 8, width: 8, height: 4, dimUom: 'inch', uom: 'pieces', accessories: [], status: 'Active' }]);
                showToast('Product added.');
              }
              setIsProductModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input type="text" value={productFormData.name} onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Variant</label>
                <input type="text" value={productFormData.variant} onChange={(e) => setProductFormData({ ...productFormData, variant: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete this record?</p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button type="button" onClick={() => setDeleteConfirmTarget(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition border border-slate-200">Cancel</button>
              <button type="button" onClick={() => {
                const { type, id } = deleteConfirmTarget;
                if (type === 'variable') setVariables(prev => prev.filter(v => v.id !== id));
                if (type === 'formula') setFormulas(prev => prev.filter(f => f.id !== id));
                if (type === 'style') setPackagingStyles(prev => prev.filter(s => s.id !== id));
                if (type === 'raw_material') setRawMaterials(prev => prev.filter(m => m.id !== id));
                if (type === 'consumable') setConsumables(prev => prev.filter(c => c.id !== id));
                if (type === 'accessory') setAccessories(prev => prev.filter(a => a.id !== id));
                if (type === 'packaging_service') setPackagingServices(prev => prev.filter(ps => ps.id !== id));
                if (type === 'finishing_service') setFinishingServices(prev => prev.filter(fs => fs.id !== id));
                if (type === 'material_rate') setMaterialRates(prev => prev.filter(mr => mr.id !== id));
                if (type === 'service_rate') setServicesRates(prev => prev.filter(sr => sr.id !== id));
                if (type === 'product') setProducts(prev => prev.filter(p => p.id !== id));
                setDeleteConfirmTarget(null);
                showToast('Record deleted successfully.');
              }} className="px-5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* VERSION MODAL */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Taj ERP Version Tracking</h3>
              <button type="button" onClick={() => setIsVersionModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {VERSION_CHANGELOG.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-[#7c3aed] bg-violet-100 px-2 py-0.5 rounded-md">{item.ver}</span><span className="text-[10px] text-slate-400 font-semibold">{item.date}</span></div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}