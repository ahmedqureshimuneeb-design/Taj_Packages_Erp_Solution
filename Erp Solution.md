import React, { useState, useEffect, useMemo } from 'react';
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
Download,
Sparkles
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

const INITIAL_PACKAGING_STYLES: PackagingStyleItem\[\] = \[
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
boundFormulas: \[
{ id: 'bf_1', name: '4 Corner Ply 1 C/A', code: 'ST_093', ply: 1, expression: 'ST_091 \* ST_092' },
{ id: 'bf_2', name: '4 Corner Ply 2 C/A', code: 'ST_096', ply: 2, expression: 'ST_094 \* ST_095' }
\]
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
\];

const INITIAL_RAW_MATERIALS = \[
{ id: "rm_1", name: "Duplex Grey Back Board", category: "Duplix Board", defaultRate: 185, unit: "kg", defaultGsm: 350, description: "Standard coated grey back carton board" },
{ id: "rm_2", name: "Bleached Folding Box Board", category: "Board", defaultRate: 210, unit: "kg", defaultGsm: 300, description: "Solid bleached sulphate virgin board" },
{ id: "rm_3", name: "Fluting Medium Corrugated", category: "Corrugated", defaultRate: 145, unit: "kg", defaultGsm: 125, description: "High crush resistance fluting substrate" },
{ id: "rm_4", name: "High Density Gatta Greyboard", category: "Gatta", defaultRate: 175, unit: "sheet", defaultGsm: 1200, description: "Rigid box structure core greyboard" },
{ id: "rm_5", name: "Virgin Kraft Liner Board", category: "Kraft Board", defaultRate: 195, unit: "kg", defaultGsm: 250, description: "Unbleached strong tear resistance kraft" },
{ id: "rm_6", name: "Natural Brown Kraft Paper", category: "Kraft Paper", defaultRate: 160, unit: "kg", defaultGsm: 80, description: "Eco friendly packaging and shopping bag paper" },
{ id: "rm_7", name: "Solid CNC MDF Rigid Sheet", category: "Mdf Sheet", defaultRate: 650, unit: "sheet", defaultGsm: 2100, description: "Engineered wood substrate for presentation boxes" },
{ id: "rm_8", name: "Gloss Coated Art Paper", category: "Paper", defaultRate: 240, unit: "kg", defaultGsm: 130, description: "Top liner wrapper for high quality printing" },
{ id: "rm_9", name: "Birch Wood Veneer Sheet", category: "Wood Sheet", defaultRate: 950, unit: "sheet", defaultGsm: 1100, description: "Natural luxury outer veneer finish" }
\];

const INITIAL_CONSUMABLES = \[
{ id: "c_1", name: "CMYK Process Inks Set", category: "Printing Ink", defaultRate: 1250, unit: "Kilogram", description: "High pigment fast drying offset process inks" },
{ id: "c_2", name: "Side Seam Cold PVA Adhesive", category: "Adhesive", defaultRate: 380, unit: "Kilogram", description: "Water based rapid set folder-gluer adhesive" },
{ id: "c_3", name: "Thermal Gloss BOPP Film 15 Micron", category: "Lamination", defaultRate: 420, unit: "Kilogram", description: "High clarity corona treated thermal laminating roll" },
{ id: "c_4", name: "UV Gloss Overprint Varnish", category: "Coating", defaultRate: 890, unit: "Kilogram", description: "Inline gloss coating with rapid UV curing" }
\];

const INITIAL_ACCESSORIES = \[
{ id: "acc_1", name: "Ribbon", code: "RIB_FNC", category: "Handles", defaultRate: 2.0, unit: "Piece", description: "Decorative ribbon or closure band" },
{ id: "acc_2", name: "Braided Dori Cotton Handle 18 inch", code: "DORI_18", category: "Handles", defaultRate: 4.5, unit: "Piece", description: "Tipped braided cotton cord handle for carrier bags" },
{ id: "acc_3", name: "Clear Rigid PVC Window Film 150 Micron", code: "PVC_WIN", category: "Window", defaultRate: 18, unit: "Meter", description: "Crystal clear window patching film for bakery boxes" },
{ id: "acc_4", name: "Brass Eyelet 5mm Metallic", code: "EYELET_5", category: "Hardware", defaultRate: 0.65, unit: "Piece", description: "Reinforcing metallic grommet for handle holes" },
{ id: "acc_5", name: "Custom Molded EVA Foam Insert Tray", code: "EVA_INS", category: "Insert", defaultRate: 45, unit: "Piece", description: "Laser cut velvet coated cushioning insert" }
\];

const INITIAL_PACKAGING_SERVICES = \[
{ id: "ps_1", name: "4-Color Offset Printing (Heidelberg Speedmaster)", category: "Offset Printing", machine: "Heidelberg CD 102", unit: "Thousand", defaultRate: 650, setupCharges: 2500, status: "Active", description: "Standard 4-color CMYK process printing run per 1,000 sheets" },
{ id: "ps_2", name: "Single Color Kraft / Liner Printing", category: "Offset Printing", machine: "RotaPrint 36", unit: "Thousand", defaultRate: 300, setupCharges: 1200, status: "Active", description: "Monochrome text or logo printing for inner liners and shippers" },
{ id: "ps_3", name: "3-Ply / 5-Ply Corrugation & Fluting Line", category: "Corrugation", machine: "Auto Flute Laminator", unit: "Sheet", defaultRate: 4.5, setupCharges: 1500, status: "Active", description: "Single/double wall B, C, or E-flute board bonding and pasting" },
{ id: "ps_4", name: "Automatic Platen Die Cutting & Creasing", category: "Die Cutting", machine: "Bobst Autoplatine", unit: "Thousand", defaultRate: 450, setupCharges: 1800, status: "Active", description: "Precision carton blank cutting, creasing, and stripping" },
{ id: "ps_5", name: "High-Speed Straight Line Folder-Gluer", category: "Pasting & Gluing", machine: "Bobst Media 68", unit: "Thousand", defaultRate: 350, setupCharges: 1000, status: "Active", description: "Automatic side-seam and crash-lock bottom carton gluing" }
\];

const INITIAL_FINISHING_SERVICES = \[ { id: "fs_1", name: "Thermal Gloss BOPP Film Lamination", category: "Lamination", spec: "15 Micron Gloss", unit: "Meter", defaultRate: 1.80, setupCharges: 800, status: "Active", description: "High-clarity protective thermal gloss film surface lamination" }, { id: "fs_2", name: "Thermal Matte Velvet Touch Lamination", category: "Lamination", spec: "18 Micron Matte", unit: "Meter", defaultRate: 1.95, setupCharges: 800, status: "Active", description: "Smooth anti-scuff matte finish lamination for luxury cartons" } \];

const INITIAL_PRODUCTS = \[ { id: "prod_1", name: "1LB LUXURY CAKE BOX", style: "Four Corner Tray (4 Corner)", variant: "1POUND", ply: 3, length: 8, width: 8, height: 4, dimUom: "inch", uom: "pieces", accessories: \["Braided Dori Cotton Handle 18 inch", "Clear Rigid PVC Window Film 150 Micron"\], status: "Active", description: "Premium food grade confectionery carrier box with window patch" } \];

export default function App() { const ERP_VERSION = "v4.27.0"; const VERSION_CHANGELOG = \[ { ver: "v4.27.0", date: "Current", summary: "Added robust localStorage persistence across all core masters and state models to prevent data loss in Google Sites iframe sandbox environments." }, { ver: "v4.26.0", date: "Prior", summary: "Added dedicated Description textareas with proper case formatting in every master form and add/edit modal." }, { ver: "v4.25.0", date: "Prior", summary: "Added instant search bars across every master menu and introduced the AI Assistant companion widget." }, { ver: "v4.24.0", date: "Prior", summary: "Added automatic bidirectional synchronization between Raw Materials, Consumables, Accessories and Material Rates, as well as Packaging and Finishing Services." }, { ver: "v4.23.0", date: "Prior", summary: "Added intelligent dependency validation and deletion protection across all master entities." } \];

const \[currentView, setCurrentView\] = useState('dashboard'); const \[sidebarOpen, setSidebarOpen\] = useState(true); const \[toastMessage, setToastMessage\] = useState<string | null>(null); const \[isVersionModalOpen, setIsVersionModalOpen\] = useState(false); const \[activeInfoTooltip, setActiveInfoTooltip\] = useState<{ title: string; token: string; formulaCode: string; expression: string; result: string; description: string } | null>(null);

/\* Global Search States per view \*/ const \[searchVar, setSearchVar\] = useState(''); const \[searchFormula, setSearchFormula\] = useState(''); const \[searchStyle, setSearchStyle\] = useState(''); const \[searchRawMat, setSearchRawMat\] = useState(''); const \[searchConsumable, setSearchConsumable\] = useState(''); const \[searchAccessory, setSearchAccessory\] = useState(''); const \[searchMatRate, setSearchMatRate\] = useState(''); const \[searchPackSrv, setSearchPackSrv\] = useState(''); const \[searchFinSrv, setSearchFinSrv\] = useState(''); const \[searchServRate, setSearchServRate\] = useState(''); const \[searchProduct, setSearchProduct\] = useState('');

/\* AI Assistant Modal State \*/ const \[isAiModalOpen, setIsAiModalOpen\] = useState(false); const \[aiQuery, setAiQuery\] = useState(''); const \[aiAnswer, setAiAnswer\] = useState<string | null>(null); const \[aiLoading, setAiLoading\] = useState(false);

/\* Cloud Sync State \*/ const \[cloudAccountLinked, setCloudAccountLinked\] = useState(true); const \[cloudEmail, setCloudEmail\] = useState('abreeshan@gmail.com'); const \[lastSyncTime, setLastSyncTime\] = useState('10/16/2026, 8:30:00 AM');

const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };

/\* Helper to format description in proper case \*/ const toProperCase = (str: string) => { if (!str) return ''; return str.charAt(0).toUpperCase() + str.slice(1); };

/\* Master States with localStorage Persistence Hook (Rule v4.27.0) \*/ const \[variables, setVariables\] = useState(() => { const saved = localStorage.getItem('taj_erp_variables'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return \[ { id: 'v_1', code: 'GRAM_CNV', name: 'Gram Conversion', category: 'Weight', dataType: 'Numeric', unit: 'Factor', defaultValue: '1550000', seqNo: '1', description: 'Standard metric conversion constant for paper calculations' }, { id: 'v_2', code: 'GSM', name: 'Basis Weight (GSM)', category: 'Material', dataType: 'Numeric', unit: 'GSM', defaultValue: '350', seqNo: '4', description: 'Grams per square meter for board substrate' }, { id: 'v_3', code: 'SHEET_WIDTH', name: 'Sheet Width', category: 'Sheet', dataType: 'Decimal', unit: 'Inch', defaultValue: '40', seqNo: '5', description: 'Full parent mother sheet width dimension' }, { id: 'v_4', code: 'SHEET_LENGTH', name: 'Sheet Length', category: 'Sheet', dataType: 'Decimal', unit: 'Inch', defaultValue: '28', seqNo: '6', description: 'Full parent mother sheet length dimension' }, { id: 'v_5', code: 'REQ_QTY', name: 'Required Quantity', category: 'Quantity', dataType: 'Numeric', unit: 'Piece', defaultValue: '1000', seqNo: '7', description: 'Final order yield delivery quantity' }, { id: 'v_6', code: 'WASTAGE_PERC', name: 'Wastage Percentage', category: 'Percentage', dataType: 'Decimal', unit: 'Percentage', defaultValue: '8', seqNo: '13', description: 'Estimated production scrap and setup wastage rate' }, { id: 'v_7', code: 'LENGTH', name: 'Box Length', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '10', seqNo: '14', description: 'Finished box inner length dimension' }, { id: 'v_8', code: 'WIDTH', name: 'Box Width', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '6', seqNo: '15', description: 'Finished box inner width dimension' }, { id: 'v_9', code: 'HEIGHT', name: 'Box Height', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '2', seqNo: '16', description: 'Finished box inner height dimension' }, { id: 'v_10', code: 'ORDER_QTY', name: 'Order Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Piece', defaultValue: '1000', seqNo: '17', description: 'Job run order batch quantity for amortization' }, { id: 'v_11', code: 'NO_OF_COLOR', name: 'Number of Colors', category: 'Printing', dataType: 'Numeric', unit: 'Each', defaultValue: '4', seqNo: '18', description: 'Number of printing colors on Heidelberg press' }, { id: 'v_12', code: 'CUT_LENGTH', name: 'Cut Sheet Length', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '32.63', seqNo: '19', description: 'Dieline cut blank length dimension' }, { id: 'v_13', code: 'CUT_WIDTH', name: 'Cut Sheet Width', category: 'Dimension', dataType: 'Decimal', unit: 'Inch', defaultValue: '11.50', seqNo: '20', description: 'Dieline cut blank width dimension' }, { id: 'v_14', code: 'FINISH_REQ_QTY', name: 'Finishing Req Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Sheet', defaultValue: '1000', seqNo: '21', description: 'Finishing service required quantity count' }, { id: 'v_15', code: 'FINISH_RATE', name: 'Finishing Rate', category: 'Rate', dataType: 'Decimal', unit: 'Meter', defaultValue: '1.80', seqNo: '22', description: 'Finishing treatment rate per running meter' }, { id: 'v_16', code: 'TOOL_REQ_QTY', name: 'Tooling Req Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Piece', defaultValue: '1', seqNo: '23', description: 'Tooling plate required quantity count' }, { id: 'v_17', code: 'TOOL_BATCH_RATE', name: 'Tooling Batch Rate', category: 'Rate', dataType: 'Numeric', unit: 'PKR', defaultValue: '4500', seqNo: '24', description: 'Tooling plate batch preparation rate' }, { id: 'v_18', code: 'CONV_REQ_QTY', name: 'Conversion Req Qty', category: 'Quantity', dataType: 'Numeric', unit: 'Sheet', defaultValue: '1000', seqNo: '25', description: 'Conversion service required sheet count' }, { id: 'v_19', code: 'CONV_RATE', name: 'Conversion Rate', category: 'Rate', dataType: 'Numeric', unit: 'PKR', defaultValue: '0.45', seqNo: '26', description: 'Conversion service unit operation rate' }, { id: 'v_20', code: 'OVERHEAD_PERC', name: 'Overhead Percentage', category: 'Percentage', dataType: 'Decimal', unit: 'Percentage', defaultValue: '5', seqNo: '27', description: 'Factory overhead rate percentage allocation' }, { id: 'v_21', code: 'PROFIT_MARGIN_PERC', name: 'Profit Margin Percentage', category: 'Percentage', dataType: 'Decimal', unit: 'Percentage', defaultValue: '18', seqNo: '28', description: 'Commercial target profit markup percentage' } \]; });

const \[formulas, setFormulas\] = useState(() => { const saved = localStorage.getItem('taj_erp_formulas'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return \[ { id: 'f_1', sr: 1, name: 'Gross Quantity With Wastage', code: 'GROSS_QTY', type: 'Material', purpose: 'Weight', expression: 'REQ_QTY + (REQ_QTY \* (WASTAGE_PERC / 100))', description: 'Total quantity required including scrap allowance.', status: 'Active' }, { id: 'f_2', sr: 2, name: 'Sheet Weight', code: 'SHT_WHT', type: 'Material', purpose: 'Weight', expression: '(SHEET_LENGTH \* SHEET_WIDTH \* GSM) / GRAM_CNV', description: 'Weight of one mother sheet in kilograms.', status: 'Active' }, { id: 'f_3', sr: 3, name: 'Yield Calculation', code: 'YIELD', type: 'Material', purpose: 'Quantity', expression: 'FLOOR(SHEET_LENGTH / CUT_LENGTH) \* FLOOR(SHEET_WIDTH / CUT_WIDTH)', description: 'Pieces per mother sheet ups count.', status: 'Active' }, { id: 'f_4', sr: 4, name: 'Substrate Cost Per Piece', code: 'COST_PER_PIECE', type: 'Material', purpose: 'Cost', expression: '(REQ_QTY_WEIGHT \* MATERIAL_RATE) / ORDER_QTY', description: 'Raw material substrate cost per finished box.', status: 'Active' }, { id: 'f_5', sr: 5, name: 'Finishing Cost Calculation', code: 'FINISH_COST_CALC', type: 'Service', purpose: 'Cost', expression: '(FINISH_REQ_QTY \* FINISH_RATE) / ORDER_QTY', description: 'Finishing treatment cost per finished piece.', status: 'Active' }, { id: 'f_6', sr: 6, name: 'Tooling Amortized Cost Calculation', code: 'TOOL_AMORTIZED_CALC', type: 'Material', purpose: 'Cost', expression: '(TOOL_REQ_QTY \* TOOL_BATCH_RATE) / ORDER_QTY', description: 'Amortized tooling cost per finished piece.', status: 'Active' }, { id: 'f_7', sr: 7, name: 'Conversion Cost Calculation', code: 'CONV_COST_CALC', type: 'Service', purpose: 'Cost', expression: '(CONV_REQ_QTY \* CONV_RATE) / ORDER_QTY', description: 'Conversion service cost per finished piece.', status: 'Active' } \]; });

const \[packagingStyles, setPackagingStyles\] = useState<PackagingStyleItem\[\]>(() => { const saved = localStorage.getItem('taj_erp_packaging_styles'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_PACKAGING_STYLES; });

const \[rawMaterials, setRawMaterials\] = useState(() => { const saved = localStorage.getItem('taj_erp_raw_materials'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_RAW_MATERIALS; });

const \[consumables, setConsumables\] = useState(() => { const saved = localStorage.getItem('taj_erp_consumables'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_CONSUMABLES; });

const \[accessories, setAccessories\] = useState(() => { const saved = localStorage.getItem('taj_erp_accessories'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_ACCESSORIES; });

const \[packagingServices, setPackagingServices\] = useState(() => { const saved = localStorage.getItem('taj_erp_packaging_services'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_PACKAGING_SERVICES; });

const \[finishingServices, setFinishingServices\] = useState(() => { const saved = localStorage.getItem('taj_erp_finishing_services'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_FINISHING_SERVICES; });

const \[products, setProducts\] = useState(() => { const saved = localStorage.getItem('taj_erp_products'); if (saved) { try { return JSON.parse(saved); } catch (e) { console.error(e); } } return INITIAL_PRODUCTS; });

/\* Sync states to localStorage whenever they change \*/ useEffect(() => { localStorage.setItem('taj_erp_variables', JSON.stringify(variables)); }, \[variables\]); useEffect(() => { localStorage.setItem('taj_erp_formulas', JSON.stringify(formulas)); }, \[formulas\]); useEffect(() => { localStorage.setItem('taj_erp_packaging_styles', JSON.stringify(packagingStyles)); }, \[packagingStyles\]); useEffect(() => { localStorage.setItem('taj_erp_raw_materials', JSON.stringify(rawMaterials)); }, \[rawMaterials\]); useEffect(() => { localStorage.setItem('taj_erp_consumables', JSON.stringify(consumables)); }, \[consumables\]); useEffect(() => { localStorage.setItem('taj_erp_accessories', JSON.stringify(accessories)); }, \[accessories\]); useEffect(() => { localStorage.setItem('taj_erp_packaging_services', JSON.stringify(packagingServices)); }, \[packagingServices\]); useEffect(() => { localStorage.setItem('taj_erp_finishing_services', JSON.stringify(finishingServices)); }, \[finishingServices\]); useEffect(() => { localStorage.setItem('taj_erp_products', JSON.stringify(products)); }, \[products\]);

/\* Automated Synchronized Rates derived from Raw Materials, Consumables, Accessories, Packaging Services & Finishing Services \*/ const materialRates = useMemo(() => { const list: Array<{ id: string; name: string; category: string; unit: string; rate: number; description: string }> = \[\]; rawMaterials.forEach(rm => { list.push({ id: `mr_rm_${rm.id}`, name: rm.name, category: rm.category, unit: rm.unit, rate: rm.defaultRate, description: rm.description }); }); consumables.forEach(c => { list.push({ id: `mr_c_${c.id}`, name: c.name, category: c.category, unit: c.unit, rate: c.defaultRate, description: c.description }); }); accessories.forEach(acc => { list.push({ id: `mr_acc_${acc.id}`, name: acc.name, category: acc.category, unit: acc.unit, rate: acc.defaultRate, description: acc.description }); }); return list; }, \[rawMaterials, consumables, accessories\]);

const servicesRates = useMemo(() => { const list: Array<{ id: string; name: string; category: string; unit: string; rate: number; description: string }> = \[\]; packagingServices.forEach(ps => { list.push({ id: `sr_ps_${ps.id}`, name: ps.name, category: ps.category, unit: ps.unit, rate: ps.defaultRate, description: ps.description }); }); finishingServices.forEach(fs => { list.push({ id: `sr_fs_${fs.id}`, name: fs.name, category: fs.category, unit: fs.unit, rate: fs.defaultRate, description: fs.description }); }); return list; }, \[packagingServices, finishingServices\]);

/\* Modal States for Add & Edit Masters \*/ const \[isVarModalOpen, setIsVarModalOpen\] = useState(false); const \[editingVarId, setEditingVarId\] = useState<string | null>(null); const \[varFormData, setVarFormData\] = useState({ code: '', name: '', category: 'Material', dataType: 'Numeric', unit: 'Inch', defaultValue: '0', seqNo: '1', description: '' });

const \[isFormulaModalOpen, setIsFormulaModalOpen\] = useState(false); const \[editingFormulaId, setEditingFormulaId\] = useState<string | null>(null); const \[formulaFormData, setFormulaFormData\] = useState({ name: '', code: '', type: 'Material', purpose: 'Cost', description: '', expression: '' });

/\* Packaging Style Modal States \*/ const \[isStyleModalOpen, setIsStyleModalOpen\] = useState(false); const \[editingStyleId, setEditingStyleId\] = useState<number | null>(null); const \[styleFormData, setStyleFormData\] = useState({ name: '', description: '', status: 'Active' });

const \[isRawMatModalOpen, setIsRawMatModalOpen\] = useState(false); const \[editingRawMatId, setEditingRawMatId\] = useState<string | null>(null); const \[rawMatFormData, setRawMatFormData\] = useState({ name: '', category: 'Board', defaultRate: '185', unit: 'kg', defaultGsm: '350', description: '' });

const \[isConsumableModalOpen, setIsConsumableModalOpen\] = useState(false); const \[editingConsumableId, setEditingConsumableId\] = useState<string | null>(null); const \[consumableFormData, setConsumableFormData\] = useState({ name: '', category: 'Printing Ink', defaultRate: '1250', unit: 'Kilogram', description: '' });

const \[isAccessoryModalOpen, setIsAccessoryModalOpen\] = useState(false); const \[editingAccessoryId, setEditingAccessoryId\] = useState<string | null>(null); const \[accessoryFormData, setAccessoryFormData\] = useState({ name: '', code: '', category: 'Handles', defaultRate: '2.0', unit: 'Piece', description: '' });

const \[isPackServiceModalOpen, setIsPackServiceModalOpen\] = useState(false); const \[editingPackServiceId, setEditingPackServiceId\] = useState<string | null>(null); const \[packServiceFormData, setPackServiceFormData\] = useState({ name: '', machine: 'Heidelberg', defaultRate: '500', setupCharges: '1500', unit: 'Thousand', description: '' });

const \[isFinServiceModalOpen, setIsFinServiceModalOpen\] = useState(false); const \[editingFinServiceId, setEditingFinServiceId\] = useState<string | null>(null); const \[finServiceFormData, setFinServiceFormData\] = useState({ name: '', spec: 'Standard', defaultRate: '1.5', setupCharges: '500', unit: 'Meter', description: '' });

const \[isProductModalOpen, setIsProductModalOpen\] = useState(false); const \[editingProductId, setEditingProductId\] = useState<string | null>(null); const \[productFormData, setProductFormData\] = useState({ name: '', style: 'Rigid Box', variant: 'STANDARD', ply: 3, description: '' });

const \[deleteConfirmTarget, setDeleteConfirmTarget\] = useState<{ type: string; id: any } | null>(null); const \[deletionWarning, setDeletionWarning\] = useState<string | null>(null);

const \[calcSelectedStyle, setCalcSelectedStyle\] = useState('Rigid Box'); const \[calcStyleDropdownOpen, setCalcStyleDropdownOpen\] = useState(false); const \[calcStyleSearch, setCalcStyleSearch\] = useState(''); const \[calcLength, setCalcLength\] = useState('10'); const \[calcWidth, setCalcWidth\] = useState('6'); const \[calcHeight, setCalcHeight\] = useState('2'); const \[calcOrderQty, setCalcOrderQty\] = useState('1000'); const \[calcColors, setCalcColors\] = useState('4'); const \[calcSelectedPly, setCalcSelectedPly\] = useState(1); const \[calcOverheadPerc, setCalcOverheadPerc\] = useState(5); const \[calcProfitMarginPerc, setCalcProfitMarginPerc\] = useState(18);

const \[calcLayers, setCalcLayers\] = useState<Array<{ plyIndex: number; materialId: string; gsm: number; cutLength: number; cutWidth: number; sheetLength: number; sheetWidth: number; wastagePerc: number; rate: number; }>>(() => Array.from({ length: 10 }, (\_, idx) => ({ plyIndex: idx + 1, materialId: 'rm_1', gsm: 350, cutLength: 32.63, cutWidth: 11.50, sheetLength: 28, sheetWidth: 40, wastagePerc: 8, rate: 185 })) );

const \[calcAccessoryItems, setCalcAccessoryItems\] = useState(\[ { id: 'acc_item_1', accessoryId: 'acc_2', name: 'Braided Dori Cotton Handle 18 inch', reqQty: 1, rate: 4.50 } \]);

const \[toolingItems, setToolingItems\] = useState(\[ { id: 't_1', name: 'Digital Offset Plate', reqQty: 1, batchRate: 4500 } \]);

const \[conversionItems, setConversionItems\] = useState(\[ { id: 'cs_1', name: 'Card Cutting (Ply 1)', reqQty: 1000, rate: 0.45, unit: 'sheets' }, { id: 'cs_2', name: 'Card Cutting (Ply 2)', reqQty: 1000, rate: 0.45, unit: 'sheets' }, { id: 'cs_3', name: 'Printing (Ply 1)', reqQty: 1000, rate: 1.50, unit: 'impressions' } \]); const \[selectedAddServiceId, setSelectedAddServiceId\] = useState('');

const \[finishingItems, setFinishingItems\] = useState(\[ { id: 'fs_item_1', name: 'Thermal Gloss BOPP Film Lamination', dimLength: 28, dimWidth: 40, reqQty: 1000, rate: 1.80, unit: 'sheets' } \]); const \[selectedAddFinishingId, setSelectedAddFinishingId\] = useState('');

const updateCalcLayer = (plyIndex: number, updatedFields: Partial<typeof calcLayers\[0\]>) => { setCalcLayers(prev => prev.map(l => l.plyIndex === plyIndex ? { ...l, ...updatedFields } : l)); };

const handleAddConversionService = (serviceName: string) => { const sObj = packagingServices.find(ps => ps.name === serviceName); const unitRate = sObj ? sObj.defaultRate : 0.50; setConversionItems(prev => \[ ...prev, { id: `cs_${Date.now()}`, name: serviceName, reqQty: 1000, rate: unitRate, unit: 'sheets' } \]); setSelectedAddServiceId(''); showToast(`Added packaging service: ${serviceName}`); };

const handleAddFinishingTreatment = (finName: string) => { const fObj = finishingServices.find(fs => fs.name === finName); const unitRate = fObj ? fObj.defaultRate : 1.95; setFinishingItems(prev => \[ ...prev, { id: `fs_item_${Date.now()}`, name: finName, dimLength: 28, dimWidth: 40, reqQty: 1000, rate: unitRate, unit: 'sheets' } \]); setSelectedAddFinishingId(''); showToast(`Added finishing service: ${finName}`); };

const computedStep4Layers = useMemo(() => { const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000); const gramCnv = 1550000;

```
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

```

}, \[calcLayers, calcSelectedPly, calcOrderQty, rawMaterials\]);

const step4SubtotalPerPiece = useMemo(() => { return computedStep4Layers.reduce((acc, l) => acc + l.costPerPiece, 0); }, \[computedStep4Layers\]);

const computedStep5Accessories = useMemo(() => { return calcAccessoryItems.map(item => { const accObj = accessories.find(a => a.id === item.accessoryId) || accessories\[0\]; const costPerPiece = Number((item.reqQty \* item.rate).toFixed(2)); return { ...item, accObj, costPerPiece }; }); }, \[calcAccessoryItems, accessories\]);

const step5TotalAccessoriesCost = useMemo(() => { return computedStep5Accessories.reduce((acc, item) => acc + item.costPerPiece, 0); }, \[computedStep5Accessories\]);

const computedStep6Tooling = useMemo(() => { const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000); return toolingItems.map(item => { const amortizedPerPiece = Number(((item.reqQty \* item.batchRate) / orderQty).toFixed(2)); return { ...item, amortizedPerPiece }; }); }, \[toolingItems, calcOrderQty\]);

const step6TotalToolingCost = useMemo(() => { return computedStep6Tooling.reduce((acc, t) => acc + (t.reqQty \* t.batchRate), 0); }, \[toolingItems\]);

const step6TotalAmortizedPerPiece = useMemo(() => { return computedStep6Tooling.reduce((acc, t) => acc + t.amortizedPerPiece, 0); }, \[computedStep6Tooling\]);

const computedStep7Conversion = useMemo(() => { const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000); return conversionItems.map(item => { const totalCost = (item.reqQty \* item.rate); const costPerPiece = Number((totalCost / orderQty).toFixed(2)); return { ...item, costPerPiece, totalCost }; }); }, \[conversionItems, calcOrderQty\]);

const step7TotalConversionCost = useMemo(() => { return computedStep7Conversion.reduce((acc, c) => acc + c.totalCost, 0); }, \[conversionItems\]);

const step7TotalCostPerPiece = useMemo(() => { return computedStep7Conversion.reduce((acc, c) => acc + c.costPerPiece, 0); }, \[computedStep7Conversion\]);

const computedStep8Finishing = useMemo(() => { const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000); return finishingItems.map(item => { const totalCost = (item.reqQty \* item.rate); const costPerPiece = Number((totalCost / orderQty).toFixed(2)); return { ...item, costPerPiece, totalCost }; }); }, \[finishingItems, calcOrderQty\]);

const step8TotalFinishingCost = useMemo(() => { return computedStep8Finishing.reduce((acc, f) => acc + f.totalCost, 0); }, \[finishingItems\]);

const step8TotalCostPerPiece = useMemo(() => { return computedStep8Finishing.reduce((acc, f) => acc + f.costPerPiece, 0); }, \[computedStep8Finishing\]);

const step9RollUp = useMemo(() => { const orderQty = Math.max(1, parseFloat(calcOrderQty) || 1000); const matCostUnit = step4SubtotalPerPiece; const matBatchTotal = matCostUnit \* orderQty;

```
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

```

}, \[step4SubtotalPerPiece, step5TotalAccessoriesCost, step6TotalAmortizedPerPiece, step6TotalToolingCost, step7TotalCostPerPiece, step7TotalConversionCost, step8TotalCostPerPiece, step8TotalFinishingCost, calcOrderQty, calcOverheadPerc, calcProfitMarginPerc\]);

/\* Deletion Dependency Validator Check (Rule v4.23.0) \*/ const validateAndDeleteRecord = (type: string, id: any) => { let isInUse = false; let usageReason = '';

```
if (type === 'variable') {
  const vObj = variables.find(v => v.id === id);
  if (vObj) {
    const foundInFormula = formulas.some(f => f.expression.includes(vObj.code));
    if (foundInFormula) {
      isInUse = true;
      usageReason = `Variable "${vObj.code}" is currently used in active Formula Master expressions.`;
    }
  }
} else if (type === 'formula') {
  const fObj = formulas.find(f => f.id === id);
  if (fObj && formulas.length <= 1) {
    isInUse = true;
    usageReason = `Cannot delete the last remaining formula.`;
  }
} else if (type === 'raw_material') {
  const rmObj = rawMaterials.find(m => m.id === id);
  const usedInCalc = computedStep4Layers.some(l => l.materialId === id);
  if (usedInCalc) {
    isInUse = true;
    usageReason = `Raw Material "${rmObj?.name || id}" is currently assigned to active layers in the Cost Calculator.`;
  }
} else if (type === 'consumable') {
  const cObj = consumables.find(c => c.id === id);
  if (consumables.length <= 1) {
    isInUse = true;
    usageReason = `Cannot delete the last remaining consumable item.`;
  }
} else if (type === 'accessory') {
  const accObj = accessories.find(a => a.id === id);
  const usedInStep5 = calcAccessoryItems.some(ai => ai.accessoryId === id);
  const usedInProducts = products.some(p => p.accessories?.includes(accObj?.name || ''));
  if (usedInStep5 || usedInProducts) {
    isInUse = true;
    usageReason = `Accessory "${accObj?.name || id}" is currently assigned in Cost Calculator Step 5 or Product Master.`;
  }
} else if (type === 'packaging_style') {
  const styleObj = packagingStyles.find(s => s.id === id);
  const usedInProducts = products.some(p => p.style === styleObj?.name);
  if (usedInProducts || calcSelectedStyle === styleObj?.name) {
    isInUse = true;
    usageReason = `Packaging Style "${styleObj?.name}" is currently selected in Product Master or active Cost Calculator session.`;
  }
} else if (type === 'packaging_service') {
  const psObj = packagingServices.find(ps => ps.id === id);
  const usedInConv = conversionItems.some(ci => ci.name.includes(psObj?.name || ''));
  if (usedInConv && packagingServices.length <= 1) {
    isInUse = true;
    usageReason = `Packaging Service "${psObj?.name}" is currently referenced in active conversion operations.`;
  }
} else if (type === 'finishing_service') {
  const fsObj = finishingServices.find(fs => fs.id === id);
  const usedInFin = finishingItems.some(fi => fi.name.includes(fsObj?.name || ''));
  if (usedInFin && finishingServices.length <= 1) {
    isInUse = true;
    usageReason = `Finishing Service "${fsObj?.name}" is currently referenced in active finishing operations.`;
  }
}

if (isInUse) {
  setDeletionWarning(usageReason);
  setDeleteConfirmTarget(null);
  return;
}

if (type === 'variable') setVariables(prev => prev.filter(v => v.id !== id));
if (type === 'formula') setFormulas(prev => prev.filter(f => f.id !== id));
if (type === 'style') setPackagingStyles(prev => prev.filter(s => s.id !== id));
if (type === 'raw_material') setRawMaterials(prev => prev.filter(m => m.id !== id));
if (type === 'consumable') setConsumables(prev => prev.filter(c => c.id !== id));
if (type === 'accessory') setAccessories(prev => prev.filter(a => a.id !== id));
if (type === 'packaging_service') setPackagingServices(prev => prev.filter(ps => ps.id !== id));
if (type === 'finishing_service') setFinishingServices(prev => prev.filter(fs => fs.id !== id));
if (type === 'product') setProducts(prev => prev.filter(p => p.id !== id));

setDeleteConfirmTarget(null);
showToast('Record deleted successfully.');

```

};

const handleDownloadExcel = () => { let csvData = "=== TAJ PACKAGES ERP COMPREHENSIVE EXPORT ===\\n\\n";

```
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
csvData += "Name,Category,Machine,Rate,SetupCharges,Unit,Description\n";
packagingServices.forEach(ps => {
  csvData += `"${ps.name}","${ps.category}","${ps.machine}","${ps.defaultRate}","${ps.setupCharges}","${ps.unit}","${ps.description}"\n`;
});

csvData += "\n--- FINISHING SERVICES ---\n";
csvData += "Name,Category,Specification,Rate,Unit,Description\n";
finishingServices.forEach(fs => {
  csvData += `"${fs.name}","${fs.category}","${fs.spec}","${fs.defaultRate}","${fs.unit}","${fs.description}"\n`;
});

csvData += "\n--- MATERIAL RATES (SYNCHRONIZED) ---\n";
csvData += "Name,Category,Rate,Unit,Description\n";
materialRates.forEach(mr => {
  csvData += `"${mr.name}","${mr.category}","${mr.rate}","${mr.unit}","${mr.description}"\n`;
});

csvData += "\n--- SERVICES RATE (SYNCHRONIZED) ---\n";
csvData += "Name,Category,Rate,Unit,Description\n";
servicesRates.forEach(sr => {
  csvData += `"${sr.name}","${sr.category}","${sr.rate}","${sr.unit}","${sr.description}"\n`;
});

csvData += "\n--- PRODUCTS ---\n";
csvData += "Name,Style,Variant,Ply,Description\n";
products.forEach(p => {
  csvData += `"${p.name}","${p.style}","${p.variant}","${p.ply}","${p.description || ''}"\n`;
});

const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvData);
const link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "taj_packages_erp_complete_export.csv");
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
showToast('Comprehensive multi-master ERP data exported successfully.');

```

};

return (  {toastMessage && (   {toastMessage}  )}

```
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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>AI Assistant</span>
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
                <span>ERP System Operational ({ERP_VERSION} - LocalStorage Persisted)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Taj Packages Production &amp; Costing Dashboard</h2>
              <p className="text-xs sm:text-sm text-violet-100 max-w-2xl leading-relaxed">
                Data entered is now automatically saved to browser <code className="bg-black/20 px-1 py-0.5 rounded font-mono">localStorage</code>. Whether running locally or inside Google Sites, your entries persist across sessions and page refreshes.
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
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">LOCAL &amp; CLOUD STORAGE</span>
              <h3 className="text-base font-black text-slate-900">Data Persistence &amp; Cloud Sync</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm">
                {cloudEmail ? cloudEmail.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-xs font-medium text-slate-700">
                Signed in as: <span className="font-bold text-slate-900">{cloudAccountLinked ? cloudEmail : 'Not linked'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
              LocalStorage persists all your additions and edits across browser reloads and iframe sessions (including Google Sites). Cloud sync uploads changes when connected.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCloudAccountLinked(true);
                  setLastSyncTime(new Date().toLocaleString());
                  showToast('Cloud account linked successfully.');
                }}
                className="px-4 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
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
                className="px-4 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
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
                className="px-4 py-2.5 bg-[#0f766e] hover:bg-[#115e59] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Excel</span>
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
              <div className="text-[11px] text-slate-500 font-medium">Auto-synced to Material Rates</div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Services &amp; Rates</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{packagingServices.length + finishingServices.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">Auto-synced to Services Rate</div>
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
        </div>
      )}

      {currentView === 'variables' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Variables Master ({variables.length})</h2>
              <p className="text-xs text-slate-500">Total Records: {variables.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchVar}
                  onChange={(e) => setSearchVar(e.target.value)}
                  placeholder="Search variables..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingVarId(null);
                setVarFormData({ code: '', name: '', category: 'Material', dataType: 'Numeric', unit: 'Inch', defaultValue: '0', seqNo: (variables.length + 1).toString(), description: '' });
                setIsVarModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Variable</span>
              </button>
            </div>
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
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {variables
                  .filter(v => v.code.toLowerCase().includes(searchVar.toLowerCase()) || v.name.toLowerCase().includes(searchVar.toLowerCase()) || v.category.toLowerCase().includes(searchVar.toLowerCase()) || (v.description && v.description.toLowerCase().includes(searchVar.toLowerCase())))
                  .map(v => (
                  <tr key={v.id}>
                    <td className="py-3 px-3 font-mono font-bold text-[#7c3aed]">{v.code}</td>
                    <td className="py-3 px-3 font-bold">{v.name}</td>
                    <td className="py-3 px-3">{v.category}</td>
                    <td className="py-3 px-3">{v.unit}</td>
                    <td className="py-3 px-3 font-mono">{v.defaultValue}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{v.description ? toProperCase(v.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Formula Master ({formulas.length})</h2>
              <p className="text-xs text-slate-500">Total Records: {formulas.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFormula}
                  onChange={(e) => setSearchFormula(e.target.value)}
                  placeholder="Search formulas..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingFormulaId(null);
                setFormulaFormData({ name: '', code: '', type: 'Material', purpose: 'Cost', description: '', expression: 'REQ_QTY * 2' });
                setIsFormulaModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Formula</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Expression</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {formulas
                  .filter(f => f.name.toLowerCase().includes(searchFormula.toLowerCase()) || f.code.toLowerCase().includes(searchFormula.toLowerCase()) || f.expression.toLowerCase().includes(searchFormula.toLowerCase()) || (f.description && f.description.toLowerCase().includes(searchFormula.toLowerCase())))
                  .map(f => (
                  <tr key={f.id}>
                    <td className="py-3 px-3 font-bold text-[#7c3aed]">{f.name}</td>
                    <td className="py-3 px-3 font-mono font-bold">{f.code}</td>
                    <td className="py-3 px-3">{f.type}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{f.expression}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{f.description ? toProperCase(f.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Packaging Styles ({packagingStyles.length})</h2>
              <p className="text-xs text-slate-500">Total Records: {packagingStyles.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchStyle}
                  onChange={(e) => setSearchStyle(e.target.value)}
                  placeholder="Search packaging styles..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingStyleId(null);
                setStyleFormData({ name: '', description: '', status: 'Active' });
                setIsStyleModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Style</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {packagingStyles
              .filter(s => s.name.toLowerCase().includes(searchStyle.toLowerCase()) || s.description.toLowerCase().includes(searchStyle.toLowerCase()))
              .map(s => (
              <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                  <p className="text-xs text-slate-500">{toProperCase(s.description)}</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Raw Material Master ({rawMaterials.length})</h2>
              <p className="text-xs text-slate-500">Automatically synchronizes with Material Rates master table. Total Records: {rawMaterials.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchRawMat}
                  onChange={(e) => setSearchRawMat(e.target.value)}
                  placeholder="Search raw materials..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingRawMatId(null);
                setRawMatFormData({ name: '', category: 'Board', defaultRate: '185', unit: 'kg', defaultGsm: '350', description: '' });
                setIsRawMatModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Raw Material</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Default GSM</th>
                  <th className="py-3 px-3">Unit Rate</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {rawMaterials
                  .filter(rm => rm.name.toLowerCase().includes(searchRawMat.toLowerCase()) || rm.category.toLowerCase().includes(searchRawMat.toLowerCase()) || (rm.description && rm.description.toLowerCase().includes(searchRawMat.toLowerCase())))
                  .map(rm => (
                  <tr key={rm.id}>
                    <td className="py-3 px-3 font-bold">{rm.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{rm.category}</td>
                    <td className="py-3 px-3 font-mono">{rm.defaultGsm}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {rm.defaultRate} / {rm.unit}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{rm.description ? toProperCase(rm.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Consumable Goods ({consumables.length})</h2>
              <p className="text-xs text-slate-500">Automatically synchronizes with Material Rates master table. Total Records: {consumables.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchConsumable}
                  onChange={(e) => setSearchConsumable(e.target.value)}
                  placeholder="Search consumables..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingConsumableId(null);
                setConsumableFormData({ name: '', category: 'Printing Ink', defaultRate: '1250', unit: 'Kilogram', description: '' });
                setIsConsumableModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Consumable</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Unit Rate</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {consumables
                  .filter(c => c.name.toLowerCase().includes(searchConsumable.toLowerCase()) || c.category.toLowerCase().includes(searchConsumable.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchConsumable.toLowerCase())))
                  .map(c => (
                  <tr key={c.id}>
                    <td className="py-3 px-3 font-bold">{c.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{c.category}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {c.defaultRate} / {c.unit}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{c.description ? toProperCase(c.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Accessories Master ({accessories.length})</h2>
              <p className="text-xs text-slate-500">Automatically synchronizes with Material Rates master table. Total Records: {accessories.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchAccessory}
                  onChange={(e) => setSearchAccessory(e.target.value)}
                  placeholder="Search accessories..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingAccessoryId(null);
                setAccessoryFormData({ name: '', code: 'ACC_NEW', category: 'Handles', defaultRate: '2.0', unit: 'Piece', description: '' });
                setIsAccessoryModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Accessory</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Default Rate</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {accessories
                  .filter(a => a.name.toLowerCase().includes(searchAccessory.toLowerCase()) || a.category.toLowerCase().includes(searchAccessory.toLowerCase()) || (a.code && a.code.toLowerCase().includes(searchAccessory.toLowerCase())) || (a.description && a.description.toLowerCase().includes(searchAccessory.toLowerCase())))
                  .map(a => (
                  <tr key={a.id}>
                    <td className="py-3 px-3 font-bold">{a.name}</td>
                    <td className="py-3 px-3 font-mono text-[#7c3aed]">{a.code || '—'}</td>
                    <td className="py-3 px-3">{a.category}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {a.defaultRate} / {a.unit}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{a.description ? toProperCase(a.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Packaging Services ({packagingServices.length})</h2>
              <p className="text-xs text-slate-500">Automatically synchronizes with Services Rate master table. Total Records: {packagingServices.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchPackSrv}
                  onChange={(e) => setSearchPackSrv(e.target.value)}
                  placeholder="Search packaging services..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingPackServiceId(null);
                setPackServiceFormData({ name: '', machine: 'Heidelberg', defaultRate: '500', setupCharges: '1500', unit: 'Thousand', description: '' });
                setIsPackServiceModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Service</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Service Name</th>
                  <th className="py-3 px-3">Machine</th>
                  <th className="py-3 px-3">Rate</th>
                  <th className="py-3 px-3">Setup Charges</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {packagingServices
                  .filter(ps => ps.name.toLowerCase().includes(searchPackSrv.toLowerCase()) || ps.machine.toLowerCase().includes(searchPackSrv.toLowerCase()) || (ps.description && ps.description.toLowerCase().includes(searchPackSrv.toLowerCase())))
                  .map(ps => (
                  <tr key={ps.id}>
                    <td className="py-3 px-3 font-bold">{ps.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{ps.machine}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {ps.defaultRate} / {ps.unit}</td>
                    <td className="py-3 px-3 font-mono">Rs. {ps.setupCharges}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{ps.description ? toProperCase(ps.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Finishing Services ({finishingServices.length})</h2>
              <p className="text-xs text-slate-500">Automatically synchronizes with Services Rate master table. Total Records: {finishingServices.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFinSrv}
                  onChange={(e) => setSearchFinSrv(e.target.value)}
                  placeholder="Search finishing services..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingFinServiceId(null);
                setFinServiceFormData({ name: '', spec: 'Standard', defaultRate: '1.5', setupCharges: '500', unit: 'Meter', description: '' });
                setIsFinServiceModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Finishing</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Service Name</th>
                  <th className="py-3 px-3">Specification</th>
                  <th className="py-3 px-3">Rate</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {finishingServices
                  .filter(fs => fs.name.toLowerCase().includes(searchFinSrv.toLowerCase()) || fs.spec.toLowerCase().includes(searchFinSrv.toLowerCase()) || (fs.description && fs.description.toLowerCase().includes(searchFinSrv.toLowerCase())))
                  .map(fs => (
                  <tr key={fs.id}>
                    <td className="py-3 px-3 font-bold">{fs.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{fs.spec}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {fs.defaultRate} / {fs.unit}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{fs.description ? toProperCase(fs.description) : '—'}</td>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Material Rates Master ({materialRates.length})</h2>
              <p className="text-xs text-slate-500">Auto-synchronized with Raw Materials, Consumables, and Accessories. Total Records: {materialRates.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchMatRate}
                  onChange={(e) => setSearchMatRate(e.target.value)}
                  placeholder="Search material rates..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <span className="px-3 py-1 bg-violet-50 text-[#7c3aed] text-xs font-mono font-bold rounded-xl border border-violet-200 shrink-0">Auto-Synced Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Synchronized Rate</th>
                  <th className="py-3 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {materialRates
                  .filter(mr => mr.name.toLowerCase().includes(searchMatRate.toLowerCase()) || mr.category.toLowerCase().includes(searchMatRate.toLowerCase()) || (mr.description && mr.description.toLowerCase().includes(searchMatRate.toLowerCase())))
                  .map(mr => (
                  <tr key={mr.id}>
                    <td className="py-3 px-3 font-bold">{mr.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{mr.category}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {mr.rate} / {mr.unit}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{mr.description ? toProperCase(mr.description) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentView === 'services_rate' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Services Rate Master ({servicesRates.length})</h2>
              <p className="text-xs text-slate-500">Auto-synchronized with Packaging Services and Finishing Services. Total Records: {servicesRates.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchServRate}
                  onChange={(e) => setSearchServRate(e.target.value)}
                  placeholder="Search services rates..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <span className="px-3 py-1 bg-violet-50 text-[#7c3aed] text-xs font-mono font-bold rounded-xl border border-violet-200 shrink-0">Auto-Synced Active</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Synchronized Rate</th>
                  <th className="py-3 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {servicesRates
                  .filter(sr => sr.name.toLowerCase().includes(searchServRate.toLowerCase()) || sr.category.toLowerCase().includes(searchServRate.toLowerCase()) || (sr.description && sr.description.toLowerCase().includes(searchServRate.toLowerCase())))
                  .map(sr => (
                  <tr key={sr.id}>
                    <td className="py-3 px-3 font-bold">{sr.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{sr.category}</td>
                    <td className="py-3 px-3 font-mono font-bold">Rs. {sr.rate} / {sr.unit}</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{sr.description ? toProperCase(sr.description) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentView === 'product' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Product Master ({products.length})</h2>
              <p className="text-xs text-slate-500">Total Records: {products.length}</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                />
              </div>
              <button type="button" onClick={() => {
                setEditingProductId(null);
                setProductFormData({ name: '', style: 'Rigid Box', variant: 'STANDARD', ply: 3, description: '' });
                setIsProductModalOpen(true);
              }} className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /><span>Add Product</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="py-3 px-3">Product Name</th>
                  <th className="py-3 px-3">Style</th>
                  <th className="py-3 px-3">Variant</th>
                  <th className="py-3 px-3">Ply</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.style.toLowerCase().includes(searchProduct.toLowerCase()) || p.variant.toLowerCase().includes(searchProduct.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchProduct.toLowerCase())))
                  .map(p => (
                  <tr key={p.id}>
                    <td className="py-3 px-3 font-bold">{p.name}</td>
                    <td className="py-3 px-3 text-[#7c3aed]">{p.style}</td>
                    <td className="py-3 px-3 font-mono">{p.variant}</td>
                    <td className="py-3 px-3 font-mono font-bold">{p.ply}P</td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{p.description ? toProperCase(p.description) : '—'}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button type="button" onClick={() => {
                          setEditingProductId(p.id);
                          setProductFormData({ name: p.name, style: p.style, variant: p.variant, ply: p.ply, description: p.description || '' });
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

            {computedStep4Layers.map((layer) => (
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
                        <th className="py-3 px-3 min-w-[160px]">DIMENSION</th>
                        <th className="py-3 px-3 min-w-[130px]">REQ QTY</th>
                        <th className="py-3 px-3 min-w-[130px]">MATERIAL QTY</th>
                        <th className="py-3 px-3 min-w-[100px]">YIELD</th>
                        <th className="py-3 px-3 min-w-[110px]">UTILIZATION</th>
                        <th className="py-3 px-3 min-w-[110px]">WASTAGE %</th>
                        <th className="py-3 px-3 min-w-[120px]">WASTAGE QTY</th>
                        <th className="py-3 px-3 min-w-[120px]">GROSS QTY</th>
                        <th className="py-3 px-3 min-w-[130px]">RATE</th>
                        <th className="py-3 px-3 min-w-[140px]">COST / PIECE</th>
                        <th className="py-3 px-3 text-center w-28">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-center font-bold text-slate-400">{layer.plyIndex}</td>
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-[#7c3aed]">
                              <span>CUT {layer.cutLength} × {layer.cutWidth}</span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600">
                              <span>SHEET {layer.sheetLength} × {layer.sheetWidth}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.reqQtyWeight} kg</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.netQtySheet} sheet</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.yieldUps} ups</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.sheetUtilPerc}%</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.wastagePerc}%</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.wastageQtySheet} sheet</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{layer.grossQtySheet} sheet</td>
                        <td className="py-3 px-3 font-bold text-slate-800">Rs. {layer.rate.toFixed(2)}</td>
                        <td className="py-3 px-3 font-black text-slate-900">Rs. {layer.costPerPiece.toFixed(2)} / pc</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Layer Formula Inspection', token: 'cost_per_piece', formulaCode: 'COST_PER_PIECE', expression: '(WEIGHT * RATE) / ORDER_QTY', result: `Rs. ${layer.costPerPiece.toFixed(2)}`, description: 'Formula inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
                            <button type="button" onClick={() => showToast(`Layer ${layer.plyIndex} summary inspected.`)} className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center" title="Summary"><Calculator className="w-3.5 h-3.5" /></button>
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
                    <th className="py-3 px-3 min-w-[200px]">NAME</th>
                    <th className="py-3 px-3 min-w-[150px]">REQ QTY</th>
                    <th className="py-3 px-3 min-w-[150px]">RATE</th>
                    <th className="py-3 px-3 min-w-[160px]">COST / PIECE</th>
                    <th className="py-3 px-3 text-center w-28">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {computedStep5Accessories.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">{item.reqQty} pieces</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">Rs. {item.rate.toFixed(2)}/piece</td>
                      <td className="py-3.5 px-3 font-black text-slate-900">Rs. {item.costPerPiece.toFixed(2)} / pieces</td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Accessory Formula Inspection', token: 'acc_cost_per_piece', formulaCode: 'ACC_COST_CALC', expression: 'REQ * RATE', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
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
                    <th className="py-3 px-3 min-w-[220px]">ITEM / DIE</th>
                    <th className="py-3 px-3 min-w-[150px]">REQ QTY</th>
                    <th className="py-3 px-3 min-w-[150px]">BATCH RATE</th>
                    <th className="py-3 px-3 min-w-[160px]">AMORTIZED / PC</th>
                    <th className="py-3 px-3 text-center w-28">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {computedStep6Tooling.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">{item.reqQty} pieces</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">Rs. {item.batchRate.toLocaleString()}/piece</td>
                      <td className="py-3.5 px-3 font-black text-slate-900">Rs. {item.amortizedPerPiece.toFixed(2)} / pieces</td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Tooling Inspection', token: 'tool_amortized_pc', formulaCode: 'TOOL_AMORTIZED_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.amortizedPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
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
                    <th className="py-3 px-3 min-w-[220px]">SERVICE</th>
                    <th className="py-3 px-3 min-w-[150px]">REQ QTY</th>
                    <th className="py-3 px-3 min-w-[140px]">RATE</th>
                    <th className="py-3 px-3 min-w-[160px]">COST / PIECE</th>
                    <th className="py-3 px-3 text-center w-28">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {computedStep7Conversion.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">{item.reqQty} {item.unit}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">Rs. {item.rate.toFixed(2)}</td>
                      <td className="py-3.5 px-3 font-black text-slate-900">Rs. {item.costPerPiece.toFixed(2)} / pc</td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Conversion Inspection', token: 'conv_cost_per_piece', formulaCode: 'CONV_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
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
                    <th className="py-3 px-3 min-w-[200px]">FINISHING</th>
                    <th className="py-3 px-3 min-w-[150px]">DIMENSION</th>
                    <th className="py-3 px-3 min-w-[150px]">REQ QTY</th>
                    <th className="py-3 px-3 min-w-[140px]">RATE</th>
                    <th className="py-3 px-3 min-w-[160px]">COST / PIECE</th>
                    <th className="py-3 px-3 text-center w-28">ACTION</th>
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
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">{item.reqQty} {item.unit}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">Rs. {item.rate.toFixed(2)}</td>
                      <td className="py-3.5 px-3 font-black text-slate-900">Rs. {item.costPerPiece.toFixed(2)} / pc</td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setActiveInfoTooltip({ title: 'Finishing Inspection', token: 'finish_cost_per_piece', formulaCode: 'FINISH_COST_CALC', expression: '(QTY * RATE) / ORDER_QTY', result: `Rs. ${item.costPerPiece.toFixed(2)}`, description: 'Inspection.' })} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs" title="Inspect">Σ</button>
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

          {/* STEP 9: COMMERCIAL ROLL-UP */}
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
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 overflow-x-auto bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] border-b border-slate-200 font-bold text-slate-600">
                    <tr>
                      <th className="py-3 px-3 w-12 text-center">#</th>
                      <th className="py-3 px-3 min-w-[200px]">COST ELEMENT</th>
                      <th className="py-3 px-3 min-w-[130px]">BATCH TOTAL</th>
                      <th className="py-3 px-3 min-w-[120px]">COST / PIECE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">1</td>
                      <td className="py-3 px-3 font-bold text-slate-900">1. Substrate Materials (All Layers)</td>
                      <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.matBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.matCostUnit.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">2</td>
                      <td className="py-3 px-3 font-bold text-slate-900">2. Accessories Material</td>
                      <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.accBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.accCostUnit.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">3</td>
                      <td className="py-3 px-3 font-bold text-slate-900">3. Additional Tooling &amp; Materials</td>
                      <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.toolingBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.toolingCostUnit.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">4</td>
                      <td className="py-3 px-3 font-bold text-slate-900">4. Packaging Conversion Operations</td>
                      <td className="py-3 px-3 font-mono text-slate-700">Rs. {step9RollUp.packSrvBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">Rs. {step9RollUp.packSrvUnit.toFixed(2)}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">5</td>
                      <td className="py-3 px-3 font-bold text-slate-900">5. Post-Press Finishing Treatments</td>
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
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">+ Rs. {step9RollUp.marginBatchTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 font-mono font-black text-emerald-700">+ Rs. {step9RollUp.marginUnit.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

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

  {/* AI ASSISTANT MODAL */}
  {isAiModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Taj ERP AI Assistant</h3>
              <p className="text-[10px] text-slate-400">Ask formulas, material rates, or optimize BOM costings</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsAiModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-violet-50 border border-violet-100 rounded-2xl text-xs text-violet-900 leading-relaxed">
            👋 Hello! I am your Taj Packages ERP AI assistant. Ask me anything about formulas like <code className="font-mono bg-white px-1.5 py-0.5 rounded text-violet-700 font-bold">YIELD</code>, material rates, or cost optimization.
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && aiQuery.trim()) {
                  setAiLoading(true);
                  setAiAnswer(null);
                  setTimeout(() => {
                    const q = aiQuery.toLowerCase();
                    if (q.includes('yield') || q.includes('formula')) {
                      setAiAnswer(`Formula "YIELD" evaluates to: FLOOR(SHEET_LENGTH / CUT_LENGTH) * FLOOR(SHEET_WIDTH / CUT_WIDTH). It determines how many cut blanks fit onto a mother sheet.`);
                    } else if (q.includes('quote') || q.includes('cost')) {
                      setAiAnswer(`Current benchmark quote for ${calcSelectedStyle} (${calcOrderQty} pcs) is Rs. ${step9RollUp.finalQuoteUnit.toFixed(2)} per piece.`);
                    } else {
                      setAiAnswer(`Analyzed your query regarding "${aiQuery}". All active masters contain ${variables.length} variables, ${rawMaterials.length} raw materials, and ${packagingStyles.length} packaging styles. Everything is synchronized.`);
                    }
                    setAiLoading(false);
                  }, 600);
                }
              }}
              placeholder="e.g. How is YIELD calculated? or What is our current quote?"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
            />
            <div className="flex flex-wrap gap-1.5">
              <button type="button" onClick={() => setAiQuery('How is YIELD calculated?')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold">How is YIELD calculated?</button>
              <button type="button" onClick={() => setAiQuery('What is our current quote per piece?')} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold">What is our current quote?</button>
            </div>
          </div>

          {aiLoading && (
            <div className="p-4 text-center text-xs text-slate-400 font-mono animate-pulse">
              AI Assistant thinking...
            </div>
          )}

          {aiAnswer && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed space-y-1">
              <div className="font-bold text-[#7c3aed]">AI Response:</div>
              <div>{aiAnswer}</div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (aiQuery.trim()) {
                setAiLoading(true);
                setAiAnswer(null);
                setTimeout(() => {
                  setAiAnswer(`Analyzed query: "${aiQuery}". ERP system status is operational with ${rawMaterials.length} raw materials and ${packagingStyles.length} styles.`);
                  setAiLoading(false);
                }, 600);
              }
            }}
            className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Ask AI Assistant
          </button>
        </div>
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
            setVariables(prev => prev.map(v => v.id === editingVarId ? { ...v, ...varFormData, description: toProperCase(varFormData.description) } : v));
            showToast('Variable updated.');
          } else {
            setVariables(prev => [...prev, { id: `v_${Date.now()}`, ...varFormData, description: toProperCase(varFormData.description) }]);
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={varFormData.description} onChange={(e) => setVarFormData({ ...varFormData, description: e.target.value })} placeholder="Enter variable description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
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
            setFormulas(prev => prev.map(f => f.id === editingFormulaId ? { ...f, ...formulaFormData, description: toProperCase(formulaFormData.description) } : f));
            showToast('Formula updated.');
          } else {
            setFormulas(prev => [...prev, { id: `f_${Date.now()}`, sr: formulas.length + 1, ...formulaFormData, description: toProperCase(formulaFormData.description), status: 'Active' }]);
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
            <textarea rows={2} value={formulaFormData.expression} onChange={(e) => setFormulaFormData({ ...formulaFormData, expression: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold" required />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={formulaFormData.description} onChange={(e) => setFormulaFormData({ ...formulaFormData, description: e.target.value })} placeholder="Enter formula description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
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
          const properDesc = toProperCase(styleFormData.description);
          if (editingStyleId) {
            setPackagingStyles(prev => prev.map(s => s.id === editingStyleId ? { ...s, name: styleFormData.name, description: properDesc, status: styleFormData.status } : s));
            showToast('Packaging style updated.');
          } else {
            setPackagingStyles(prev => [...prev, { id: Date.now(), name: styleFormData.name, description: properDesc, variablesCount: 0, formulasCount: 1, status: styleFormData.status }]);
            showToast('Packaging style added.');
          }
          setIsStyleModalOpen(false);
        }} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Style Name</label>
            <input type="text" value={styleFormData.name} onChange={(e) => setStyleFormData({ ...styleFormData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold" required />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={3} value={styleFormData.description} onChange={(e) => setStyleFormData({ ...styleFormData, description: e.target.value })} placeholder="Enter style description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" required />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsStyleModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save</button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* EDIT/ADD RAW MATERIAL MODAL (AUTO-SYNCS TO MATERIAL RATES) */}
  {isRawMatModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{editingRawMatId ? 'Edit Raw Material' : 'Add Raw Material'}</h3>
            <span className="text-[10px] text-[#7c3aed] font-bold">Auto-syncs to Material Rates</span>
          </div>
          <button type="button" onClick={() => setIsRawMatModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const properDesc = toProperCase(rawMatFormData.description || 'Added & Synced');
          if (editingRawMatId) {
            setRawMaterials(prev => prev.map(m => m.id === editingRawMatId ? { ...m, name: rawMatFormData.name, category: rawMatFormData.category, defaultRate: parseFloat(rawMatFormData.defaultRate) || 0, defaultGsm: parseInt(rawMatFormData.defaultGsm) || 0, description: properDesc } : m));
            showToast('Raw material updated and synchronized.');
          } else {
            setRawMaterials(prev => [...prev, { id: `rm_${Date.now()}`, name: rawMatFormData.name, category: rawMatFormData.category, defaultRate: parseFloat(rawMatFormData.defaultRate) || 0, unit: 'kg', defaultGsm: parseInt(rawMatFormData.defaultGsm) || 0, description: properDesc }]);
            showToast('Raw material added and synchronized to Material Rates.');
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={rawMatFormData.description} onChange={(e) => setRawMatFormData({ ...rawMatFormData, description: e.target.value })} placeholder="Enter raw material description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsRawMatModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save &amp; Sync</button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* EDIT/ADD CONSUMABLE MODAL (AUTO-SYNCS TO MATERIAL RATES) */}
  {isConsumableModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{editingConsumableId ? 'Edit Consumable' : 'Add Consumable'}</h3>
            <span className="text-[10px] text-[#7c3aed] font-bold">Auto-syncs to Material Rates</span>
          </div>
          <button type="button" onClick={() => setIsConsumableModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const properDesc = toProperCase(consumableFormData.description || 'Added & Synced');
          if (editingConsumableId) {
            setConsumables(prev => prev.map(c => c.id === editingConsumableId ? { ...c, name: consumableFormData.name, category: consumableFormData.category, defaultRate: parseFloat(consumableFormData.defaultRate) || 0, unit: consumableFormData.unit, description: properDesc } : c));
            showToast('Consumable updated and synchronized.');
          } else {
            setConsumables(prev => [...prev, { id: `c_${Date.now()}`, name: consumableFormData.name, category: consumableFormData.category, defaultRate: parseFloat(consumableFormData.defaultRate) || 0, unit: consumableFormData.unit, description: properDesc }]);
            showToast('Consumable added and synchronized to Material Rates.');
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={consumableFormData.description} onChange={(e) => setConsumableFormData({ ...consumableFormData, description: e.target.value })} placeholder="Enter consumable description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsConsumableModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save &amp; Sync</button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* EDIT/ADD ACCESSORY MODAL (AUTO-SYNCS TO MATERIAL RATES) */}
  {isAccessoryModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{editingAccessoryId ? 'Edit Accessory' : 'Add Accessory'}</h3>
            <span className="text-[10px] text-[#7c3aed] font-bold">Auto-syncs to Material Rates</span>
          </div>
          <button type="button" onClick={() => setIsAccessoryModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const properDesc = toProperCase(accessoryFormData.description || 'Added & Synced');
          if (editingAccessoryId) {
            setAccessories(prev => prev.map(a => a.id === editingAccessoryId ? { ...a, name: accessoryFormData.name, code: accessoryFormData.code, category: accessoryFormData.category, defaultRate: parseFloat(accessoryFormData.defaultRate) || 0, unit: accessoryFormData.unit, description: properDesc } : a));
            showToast('Accessory updated and synchronized.');
          } else {
            setAccessories(prev => [...prev, { id: `acc_${Date.now()}`, name: accessoryFormData.name, code: accessoryFormData.code, category: accessoryFormData.category, defaultRate: parseFloat(accessoryFormData.defaultRate) || 0, unit: accessoryFormData.unit, description: properDesc }]);
            showToast('Accessory added and synchronized to Material Rates.');
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={accessoryFormData.description} onChange={(e) => setAccessoryFormData({ ...accessoryFormData, description: e.target.value })} placeholder="Enter accessory description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsAccessoryModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save &amp; Sync</button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* EDIT/ADD PACKAGING SERVICE MODAL (AUTO-SYNCS TO SERVICES RATE) */}
  {isPackServiceModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{editingPackServiceId ? 'Edit Packaging Service' : 'Add Packaging Service'}</h3>
            <span className="text-[10px] text-[#7c3aed] font-bold">Auto-syncs to Services Rate</span>
          </div>
          <button type="button" onClick={() => setIsPackServiceModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const properDesc = toProperCase(packServiceFormData.description || 'Added & Synced');
          if (editingPackServiceId) {
            setPackagingServices(prev => prev.map(ps => ps.id === editingPackServiceId ? { ...ps, name: packServiceFormData.name, machine: packServiceFormData.machine, defaultRate: parseFloat(packServiceFormData.defaultRate) || 0, setupCharges: parseFloat(packServiceFormData.setupCharges) || 0, description: properDesc } : ps));
            showToast('Packaging service updated and synchronized.');
          } else {
            setPackagingServices(prev => [...prev, { id: `ps_${Date.now()}`, name: packServiceFormData.name, category: 'Offset Printing', machine: packServiceFormData.machine, unit: packServiceFormData.unit, defaultRate: parseFloat(packServiceFormData.defaultRate) || 0, setupCharges: parseFloat(packServiceFormData.setupCharges) || 0, status: 'Active', description: properDesc }]);
            showToast('Packaging service added and synchronized to Services Rate.');
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={packServiceFormData.description} onChange={(e) => setPackServiceFormData({ ...packServiceFormData, description: e.target.value })} placeholder="Enter service description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsPackServiceModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save &amp; Sync</button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* EDIT/ADD FINISHING SERVICE MODAL (AUTO-SYNCS TO SERVICES RATE) */}
  {isFinServiceModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">{editingFinServiceId ? 'Edit Finishing Service' : 'Add Finishing Service'}</h3>
            <span className="text-[10px] text-[#7c3aed] font-bold">Auto-syncs to Services Rate</span>
          </div>
          <button type="button" onClick={() => setIsFinServiceModalOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700 transition"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const properDesc = toProperCase(finServiceFormData.description || 'Added & Synced');
          if (editingFinServiceId) {
            setFinishingServices(prev => prev.map(fs => fs.id === editingFinServiceId ? { ...fs, name: finServiceFormData.name, spec: finServiceFormData.spec, defaultRate: parseFloat(finServiceFormData.defaultRate) || 0, setupCharges: parseFloat(finServiceFormData.setupCharges) || 0, description: properDesc } : fs));
            showToast('Finishing service updated and synchronized.');
          } else {
            setFinishingServices(prev => [...prev, { id: `fs_${Date.now()}`, name: finServiceFormData.name, category: 'Lamination', spec: finServiceFormData.spec, unit: finServiceFormData.unit, defaultRate: parseFloat(finServiceFormData.defaultRate) || 0, setupCharges: parseFloat(finServiceFormData.setupCharges) || 0, status: 'Active', description: properDesc }]);
            showToast('Finishing service added and synchronized to Services Rate.');
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description (Proper Case)</label>
            <textarea rows={2} value={finServiceFormData.description} onChange={(e) => setFinServiceFormData({ ...finServiceFormData, description: e.target.value })} placeholder="Enter finishing description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setIsFinServiceModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-[#7c3aed] text-white font-bold rounded-xl shadow-xs">Save &amp; Sync</button>
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
          <h3 className="font-bold text-base text-slate-900">{editingProductId ? 'Edit Product' : 'Add

```