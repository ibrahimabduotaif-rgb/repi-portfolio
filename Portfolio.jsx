import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Database, BarChart2, Building2, LineChart as LineIcon, FileSpreadsheet, Mail, Phone, Linkedin } from "lucide-react";

const TS_RECENT = [
  { period: "2023 Q3", overall: 99.98, residential: 99.77, commercial: 100.23, agricultural: 104.64 },
  { period: "2023 Q4", overall: 100.59, residential: 99.28, commercial: 104.3, agricultural: 102.08 },
  { period: "2024 Q1", overall: 100.59, residential: 99.18, commercial: 104.6, agricultural: 102.02 },
  { period: "2024 Q2", overall: 101.79, residential: 101.13, commercial: 103.57, agricultural: 103.52 },
  { period: "2024 Q3", overall: 102.56, residential: 101.35, commercial: 106.67, agricultural: 95.54 },
  { period: "2024 Q4", overall: 104.18, residential: 102.35, commercial: 109.54, agricultural: 104.89 },
  { period: "2025 Q1", overall: 104.93, residential: 104.26, commercial: 107.2, agricultural: 100.87 },
  { period: "2025 Q2", overall: 105.00, residential: 101.57, commercial: 115.69, agricultural: 102.63 },
];

const REGIONS_Q2_2025 = [
  { region: "الرياض", index: 111.35, qoq: -3.1, yoy: 3.6 },
  { region: "مكة المكرمة", index: 102.07, qoq: 2.0, yoy: 3.9 },
  { region: "المدينة المنورة", index: 96.03, qoq: -2.5, yoy: -3.2 },
  { region: "القصيم", index: 97.48, qoq: 0.6, yoy: 1.1 },
  { region: "المنطقة الشرقية", index: 98.17, qoq: 7.3, yoy: 4.2 },
  { region: "عسير", index: 89.04, qoq: 1.7, yoy: -3.9 },
  { region: "تبوك", index: 104.4, qoq: 3.9, yoy: 4.7 },
  { region: "حائل", index: 102.65, qoq: -1.0, yoy: 2.9 },
  { region: "الحدود الشمالية", index: 99.29, qoq: -7.2, yoy: -1.3 },
  { region: "جازان", index: 99.18, qoq: -2.5, yoy: -2.8 },
  { region: "نجران", index: 100.61, qoq: -1.4, yoy: 0.4 },
  { region: "الباحة", index: 80.16, qoq: -4.4, yoy: -1.7 },
  { region: "الجوف", index: 96.93, qoq: -0.1, yoy: -0.7 },
];

const COMP_Q2_2025 = [
  { category: "الرقم القياسي العام", weight: 100.0, q2_2024: 101.79, q1_2025: 104.93, q2_2025: 105.00, yoy: 3.2 },
  { category: "سكني", weight: 72.661, q2_2024: 101.13, q1_2025: 104.26, q2_2025: 101.57, yoy: 0.4 },
  { category: "قطعة أرض سكنية", weight: 45.849, q2_2024: 101.13, q1_2025: 105.56, q2_2025: 101.30, yoy: 0.2 },
  { category: "فيلا", weight: 10.455, q2_2024: 101.82, q1_2025: 103.21, q2_2025: 105.03, yoy: 3.2 },
  { category: "شقة", weight: 14.989, q2_2024: 101.07, q1_2025: 101.58, q2_2025: 100.32, yoy: -0.7 },
  { category: "تجاري", weight: 25.404, q2_2024: 103.57, q1_2025: 107.20, q2_2025: 115.69, yoy: 11.7 },
  { category: "قطعة أرض تجارية", weight: 22.836, q2_2024: 103.40, q1_2025: 107.36, q2_2025: 116.56, yoy: 12.7 },
  { category: "عمارة", weight: 2.015, q2_2024: 107.32, q1_2025: 106.99, q2_2025: 110.22, yoy: 2.7 },
  { category: "معرض / محل", weight: 0.553, q2_2024: 97.42, q1_2025: 101.58, q2_2025: 101.37, yoy: 4.1 },
  { category: "زراعي", weight: 1.935, q2_2024: 103.52, q1_2025: 100.87, q2_2025: 102.63, yoy: -0.9 },
  { category: "أرض زراعية", weight: 1.935, q2_2024: 103.52, q1_2025: 100.87, q2_2025: 102.63, yoy: -0.9 },
];

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#eab308', '#64748b', '#d946ef', '#06b6d4', '#22c55e', '#f59e0b', '#7e22ce', '#be123c'];

const Card = ({ children, className = "" }) => <div className={`rounded-xl bg-gray-800/50 border border-gray-700 shadow ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`p-4 sm:p-6 ${className}`}>{children}</div>;
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-blue-600 text-white shadow hover:bg-blue-700",
        outline: "border border-gray-600 bg-transparent shadow-sm hover:bg-gray-700 hover:text-gray-100",
    };
    const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs" };
    return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};
const Input = (props) => <input className="flex h-9 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-1 text-sm text-gray-200 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-gray-300 file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" {...props} />;

const ActiveTabsContext = React.createContext();
const Tabs = ({ children, defaultValue }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return <ActiveTabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</ActiveTabsContext.Provider>;
};
const TabsList = ({ children }) => <div className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-800 p-1 text-gray-400">{children}</div>;
const TabsTrigger = ({ children, value }) => {
    const { activeTab, setActiveTab } = React.useContext(ActiveTabsContext);
    const isActive = activeTab === value;
    return <button onClick={() => setActiveTab(value)} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${isActive ? 'bg-gray-900/80 text-white shadow' : 'hover:bg-gray-700/50'}`}>{children}</button>;
};
const TabsContent = ({ children, value }) => {
    const { activeTab } = React.useContext(ActiveTabsContext);
    return activeTab === value ? <div className="mt-4">{children}</div> : null;
};

const ScrollArea = ({ children, style }) => <div style={style} className="overflow-auto">{children}</div>;

const Pill = ({ children }) => (
  <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-200 text-sm">{children}</span>
);

const Table = ({ columns, data, height = 360 }) => (
  <div className="border rounded-2xl overflow-hidden bg-gray-800/50 border-gray-700">
    <ScrollArea style={{ height }}>
      <table className="w-full text-sm text-right">
        <thead className="sticky top-0 bg-gray-700/80 backdrop-blur-sm">
          <tr>{columns.map((c) => <th key={c.key} className="p-3 font-semibold text-gray-300">{c.title}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-700/50">
              {columns.map((c) => (
                <td key={c.key} className="p-3 text-gray-300">{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  </div>
);

const CustomLegendWithValue = ({ payload }) => (
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
    {payload.map((entry, index) => (
      <div key={`item-${index}`} className="flex items-center">
        <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: entry.color }} />
        <span>{entry.value}: </span>
        <span className="font-semibold mr-1">{entry.payload.value.toFixed(2)}</span>
      </div>
    ))}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg text-sm text-gray-200">
                {label && <p className="label font-bold mb-1">{label}</p>}
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value.toFixed(2)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Portfolio() {
  const headline = useMemo(() => {
    const last = TS_RECENT[TS_RECENT.length - 1];
    return {
      overall: last.overall,
      residential: last.residential,
      commercial: last.commercial,
      agricultural: last.agricultural,
      yoy: COMP_Q2_2025.find(x => x.category === "الرقم القياسي العام")?.yoy
    };
  }, []);

  const qoq = useMemo(() => {
    const a = TS_RECENT[TS_RECENT.length - 2]?.overall;
    const b = TS_RECENT[TS_RECENT.length - 1]?.overall;
    return a && b ? Number(((b - a) / a * 100).toFixed(2)) : null;
  }, []);

  const [sortKey, setSortKey] = useState("index");
  const regionsSorted = useMemo(() => {
    return [...REGIONS_Q2_2025].sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0));
  }, [sortKey]);

  const [csvRows, setCsvRows] = useState([]);
  const [csvCols, setCsvCols] = useState([]);
  const [csvName, setCsvName] = useState("");
  function handleUpload(file) {
    if (!file) return;
    setCsvName(file.name);
    const ext = file.name.toLowerCase().split(".").pop();
    if (["xlsx", "xls"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = window.XLSX.read(new Uint8Array(e.target.result), { type: "array" });
        const sheet = wb.SheetNames[0];
        const data = window.XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
        setCsvRows(data);
        setCsvCols(Object.keys(data[0] || {}).map(k => ({ key: k, title: k })));
      };
      reader.readAsArrayBuffer(file);
    } else {
      window.Papa.parse(file, {
        header: true, skipEmptyLines: true, complete: (res) => {
          const rows = res.data;
          setCsvRows(rows);
          setCsvCols(Object.keys(rows[0] || {}).map(k => ({ key: k, title: k })));
        }
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200" dir="rtl">
      <header className="sticky top-0 z-20 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><Database className="w-6 h-6 text-blue-400" /><span className="font-bold text-white">REPI — بورتوفوليو إبراهيم عطيف</span></div>
          <nav className="hidden md:flex gap-4 text-sm">
            {[ ["hero", "الرئيسية"], ["about", "نبذة"], ["ts", "السلاسل"], ["regions", "المناطق"], ["mix", "مزيج الأنواع"], ["forecast", "تنبؤ"], ["tables", "جداول"], ["uploader", "رفع ملفات"], ["contact", "تواصل"] ].map(([id, l]) => <a key={id} href={`#${id}`} className="text-gray-300 hover:text-blue-400">{l}</a>)}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <section id="hero" className="grid md:grid-cols-2 gap-8 py-16 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">مرصد العقار — REPI (الهيئة العامة للإحصاء)</motion.h1>
            <p className="mt-3 text-gray-400 text-sm">ملخّص أحدث قراءة (الربع الثاني 2025): المؤشر العام {headline.overall.toFixed(2)} نقطة — على أساس سنوي {headline.yoy?.toFixed(1)}%، وعلى أساس ربعي {qoq?.toFixed(1)}%.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>سكني: {headline.residential.toFixed(2)}</Pill>
              <Pill>تجاري: {headline.commercial.toFixed(2)}</Pill>
              <Pill>زراعي: {headline.agricultural.toFixed(2)}</Pill>
            </div>
            <div className="mt-6 flex gap-2">
              <a href="#ts"><Button size="sm"><LineIcon className="w-4 h-4 ml-2" />السلاسل الزمنية</Button></a>
              <a href="#regions"><Button size="sm" variant="outline"><BarChart2 className="w-4 h-4 ml-2" />المناطق</Button></a>
            </div>
          </div>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={TS_RECENT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#d1d5db' }} />
                  <Line type="monotone" dataKey="overall" name="العام" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="residential" name="سكني" stroke="#10b981" />
                  <Line type="monotone" dataKey="commercial" name="تجاري" stroke="#f97316" />
                  <Line type="monotone" dataKey="agricultural" name="زراعي" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section id="about" className="py-6">
          <h2 className="text-2xl font-bold mb-2 text-white">نبذة وهدف البورتوفوليو</h2>
          <p className="text-sm text-gray-400">هذا البورتوفوليو يقدّم لوحات تفاعلية مبنية على <b>الأرقام القياسية لأسعار العقارات REPI</b> من الهيئة العامة للإحصاء في السعودية، مع أمثلة على تنظيف البيانات، التحليل، والنمذجة التنبؤية الخفيفة. يمكن استبدال مصادر البيانات أو توسيع اللوحات حسب الحاجة.</p>
        </section>

        <section id="ts" className="py-6">
          <h2 className="text-2xl font-bold mb-3 flex items, gap-2 text-white"><LineIcon className="w-6 h-6 text-blue-400" />السلاسل الزمنية — سكني/تجاري/زراعي</h2>
          <Card>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={TS_RECENT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#d1d5db' }} />
                  <Line dataKey="overall" name="العام" stroke="#3b82f6" />
                  <Line dataKey="residential" name="سكني" stroke="#10b981" />
                  <Line dataKey="commercial" name="تجاري" stroke="#f97316" />
                  <Line dataKey="agricultural" name="زراعي" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section id="regions" className="py-6">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><Building2 className="w-6 h-6 text-blue-400" />المناطق (الربع الثاني 2025)</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">ترتيب حسب:</span>
              <Button size="sm" variant={sortKey === "index" ? "default" : "outline"} onClick={() => setSortKey("index")}>المؤشر</Button>
              <Button size="sm" variant={sortKey === "yoy" ? "default" : "outline"} onClick={() => setSortKey("yoy")}>التغير السنوي</Button>
              <Button size="sm" variant={sortKey === "qoq" ? "default" : "outline"} onClick={() => setSortKey("qoq")}>التغير الربعي</Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={regionsSorted} dataKey="index" nameKey="region" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
                    {regionsSorted.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegendWithValue />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
            <Card><CardContent>
              <h3 className="font-semibold mb-2 text-white">أعلى/أدنى المناطق</h3>
              <div className="flex flex-wrap gap-2 text-sm mb-4">
                <Pill>أعلى مؤشر: {regionsSorted[0].region} ({regionsSorted[0].index})</Pill>
                <Pill>أدنى مؤشر: {regionsSorted[regionsSorted.length - 1].region} ({regionsSorted[regionsSorted.length - 1].index})</Pill>
                <Pill>أعلى نمو سنوي: {REGIONS_Q2_2025.slice().sort((a, b) => b.yoy - a.yoy)[0].region}</Pill>
              </div>
              <Table columns={[{ key: "region", title: "المنطقة" }, { key: "index", title: "المؤشر" }, { key: "qoq", title: "ربعي %" }, { key: "yoy", title: "سنوي %" }]} data={regionsSorted} height={280} />
            </CardContent></Card>
          </div>
        </section>

        <section id="mix" className="py-6">
          <h2 className="text-2xl font-bold mb-3 text-white">مزيج الأنواع — أوزان السوق وأداء Q2 2025</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardContent>
                <h3 className="font-semibold mb-2 text-white text-center">أداء المؤشر حسب النوع</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie data={COMP_Q2_2025.filter(d => d.category !== "الرقم القياسي العام")} dataKey="q2_2025" nameKey="category" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
                        {COMP_Q2_2025.filter(d => d.category !== "الرقم القياسي العام").map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegendWithValue />} verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
            <Card><CardContent>
              <h3 className="font-semibold mb-2 text-white text-center">الأوزان النسبية للقطاعات</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={COMP_Q2_2025.filter(d => ["سكني", "تجاري", "زراعي"].includes(d.category))} dataKey="weight" nameKey="category" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={false}>
                    <Cell fill="#10b981" /><Cell fill="#f97316" /><Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend payload={
                      COMP_Q2_2025.filter(d => ["سكني", "تجاري", "زراعي"].includes(d.category))
                      .map((entry, index) => ({
                          value: `${entry.category} (${entry.weight.toFixed(1)}%)`,
                          type: 'square',
                          color: ["#10b981", "#f97316", "#8b5cf6"][index]
                      }))
                  } />
                </PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>
        </section>

        <section id="forecast" className="py-6">
          <h2 className="text-2xl font-bold mb-2 text-white">تنبؤ مبسّط (خطّي) للمؤشر العام</h2>
          <p className="text-sm text-gray-400 mb-3">تنبيه: نموذج توضيحي فقط. للاستخدام الفعلي يُفضّل تجارب نماذج زمنية وتقييم MAE/RMSE.</p>
          <Card>
            <CardContent>
              {(() => {
                const y = TS_RECENT.map(d => d.overall);
                const x = TS_RECENT.map((_, i) => i + 1);
                const n = x.length;
                const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
                const xbar = mean(x), ybar = mean(y);
                const num = x.reduce((s, xi, i) => s + (xi - xbar) * (y[i] - ybar), 0);
                const den = x.reduce((s, xi) => s + (xi - xbar) * (xi - xbar), 0);
                const b1 = num / den; const b0 = ybar - b1 * xbar;
                const withForecast = TS_RECENT.map((d, i) => ({ ...d, forecast: b0 + b1 * (i + 1) }));
                withForecast.push({ period: "2025 Q3*", forecast: b0 + b1 * (n + 1) });
                withForecast.push({ period: "2025 Q4*", forecast: b0 + b1 * (n + 2) });
                return (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={withForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="period" stroke="#9ca3af" />
                      <YAxis domain={['auto', 'auto']} stroke="#9ca3af" tickFormatter={(tick) => tick.toFixed(1)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#d1d5db' }} />
                      <Line dataKey="overall" name="فعلي" stroke="#3b82f6" />
                      <Line dataKey="forecast" name="تنبؤ" stroke="#eab308" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>
        </section>

        <section id="tables" className="py-6">
          <h2 className="text-2xl font-bold mb-3 text-white">جداول ملخّصة</h2>
          <Tabs defaultValue="ts">
            <TabsList>
              <TabsTrigger value="ts">آخر 8 أرباع</TabsTrigger>
              <TabsTrigger value="regions">المناطق — Q2 2025</TabsTrigger>
              <TabsTrigger value="mix">مزيج الأنواع</TabsTrigger>
            </TabsList>
            <TabsContent value="ts">
              <Table columns={[{ key: "period", title: "الفترة" }, { key: "overall", title: "العام" }, { key: "residential", title: "سكني" }, { key: "commercial", title: "تجاري" }, { key: "agricultural", title: "زراعي" }]} data={TS_RECENT} />
            </TabsContent>
            <TabsContent value="regions">
              <Table columns={[{ key: "region", title: "المنطقة" }, { key: "index", title: "المؤشر" }, { key: "qoq", title: "ربعي %" }, { key: "yoy", title: "سنوي %" }]} data={REGIONS_Q2_2025} />
            </TabsContent>
            <TabsContent value="mix">
              <Table columns={[{ key: "category", title: "الفئة" }, { key: "weight", title: "الوزن" }, { key: "q2_2024", title: "Q2 2024" }, { key: "q1_2025", title: "Q1 2025" }, { key: "q2_2025", title: "Q2 2025" }, { key: "yoy", title: "YoY %" }]} data={COMP_Q2_2025} />
            </TabsContent>
          </Tabs>
        </section>

        <section id="uploader" className="py-6">
          <h2 className="text-2l font-bold mb-2 flex items, gap-2 text-white"><FileSpreadsheet className="w-6 h-6 text-blue-400" />ارفع ملفك (CSV/Excel) — EDA سريع</h2>
          <div className="flex items-center gap-3">
            <Input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => handleUpload(e.target.files?.[0])} />
            {csvName && <Pill>{csvName}</Pill>}
          </div>
          {csvRows.length > 0 ? (
            <Tabs defaultValue="data" className="mt-4">
              <TabsList>
                <TabsTrigger value="data">البيانات</TabsTrigger>
                <TabsTrigger value="profile">تحليل سريع</TabsTrigger>
              </TabsList>
              <TabsContent value="data">
                <Table columns={csvCols} data={csvRows.slice(0, 200)} />
              </TabsContent>
              <TabsContent value="profile">
                <Profile rows={csvRows} />
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-sm text-gray-400 mt-3">ارفع ملف الأسعار/الصفقات العقارية وستظهر جداول وملامح سريعة تلقائيًا.</p>
          )}
        </section>

        <section className="py-6">
          <h2 className="text-2xl font-bold mb-2 text-white">منهجية سريعة</h2>
          <ul className="list-disc pr-6 text-sm text-gray-400 space-y-1">
            <li>الأرقام مُستخلصة من جداول REPI الرسمية (Q2 2025) — مؤشرات مرجّحة بالأنواع.</li>
            <li>التنبؤ خطّي تمهيدي؛ للاستخدام المهني: اختبار نماذج زمنية وتقييم MAE/RMSE.</li>
            <li>يمكن ربط البورتوفوليو بواجهات بيانات رسمية أو لوحات Power BI عند الطلب.</li>
          </ul>
        </section>

        <section id="contact" className="py-10">
          <h2 className="text-2l font-bold mb-4 text-white">تواصل</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <Card><CardContent>
              <div className="grid gap-3">
                <a href="mailto:Ibrahimabduotaif@gmail.com" className="text-gray-300 hover:text-blue-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Ibrahimabduotaif@gmail.com</a>
                <a href="tel:+966561992496" className="text-gray-300 hover:text-blue-400 flex items-center gap-2"><Phone className="w-4 h-4" /> +966 56 199 2496</a>
                <a href="https://www.linkedin.com/in/ebrahimotaif24" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 flex items, gap-2"><Linkedin className="w-4 h-4" /> linkedin.com/in/ebrahimotaif24</a>
              </div>
            </CardContent></Card>
            <Card><CardContent>
              <p className="text-gray-400">جاهز لربط هذه اللوحات بمصادرك الداخلية أو بناء API مصغر لسحب آخر نشرات REPI وتحديث الموقع تلقائيًا.</p>
            </CardContent></Card>
          </div>
        </section>

        <footer className="py-12 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ibrahim Otayf — REPI Portfolio. Built with React, Tailwind, shadcn/ui, Recharts.
        </footer>
      </main>
    </div>
  );
}

function Profile({ rows }) {
  const cols = Object.keys(rows[0] || {});
  const stats = cols.map((c) => {
    const vals = rows.map(r => r[c]).filter(v => v !== undefined && v !== null && v !== "");
    const missing = rows.length - vals.length;
    const nums = vals
      .map(v => Number(String(v).replace(/,/g, '')))
      .filter(n => !isNaN(n));
    const mean = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length) : null;
    return {
      column: c,
      count: rows.length,
      missing,
      numeric_count: nums.length,
      mean: mean === null ? "-" : Number(mean.toFixed(2)),
    };
  });
  return <Table columns={[{ key: "column", title: "العمود" }, { key: "count", title: "السجلات" }, { key: "missing", title: "قيم ناقصة" }, { key: "numeric_count", title: "قيم رقمية" }, { key: "mean", title: "متوسط (رقمي)" }]} data={stats} />;
}
