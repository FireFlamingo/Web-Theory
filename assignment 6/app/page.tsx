"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes, Braces, Check, ChevronDown, Code2, Copy, Download,
  FileCode2, GitBranch, GripVertical, Layers3, Minus, MousePointer2,
  Plus, Redo2, Search, Trash2, Undo2, ZoomIn, ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Field = { visibility: "+" | "-" | "#"; name: string; type: string };
type Method = { visibility: "+" | "-" | "#"; name: string; returnType: string };
type UMLClass = { id: number; name: string; kind: "class" | "abstract" | "interface"; fields: Field[]; methods: Method[]; x: number; y: number };
type Relation = { id: number; from: number; to: number; type: "Association" | "Inheritance" | "Aggregation" | "Composition" };

const initialClasses: UMLClass[] = [
  { id: 1, name: "User", kind: "class", x: 80, y: 90, fields: [{ visibility: "-", name: "id", type: "Long" }, { visibility: "-", name: "email", type: "String" }], methods: [{ visibility: "+", name: "getProfile", returnType: "Profile" }] },
  { id: 2, name: "Admin", kind: "class", x: 390, y: 42, fields: [{ visibility: "-", name: "permissions", type: "List<String>" }], methods: [{ visibility: "+", name: "manageUsers", returnType: "void" }] },
  { id: 3, name: "Profile", kind: "class", x: 405, y: 285, fields: [{ visibility: "-", name: "displayName", type: "String" }, { visibility: "-", name: "avatarUrl", type: "String" }], methods: [{ visibility: "+", name: "update", returnType: "void" }] },
];

const initialRelations: Relation[] = [
  { id: 1, from: 2, to: 1, type: "Inheritance" },
  { id: 2, from: 1, to: 3, type: "Composition" },
];

const javaType = (type: string) => type || "void";
const visibility = (mark: string) => mark === "+" ? "public" : mark === "#" ? "protected" : "private";

function generateJava(cls: UMLClass, relations: Relation[], classes: UMLClass[]) {
  const parentLink = relations.find(r => r.from === cls.id && r.type === "Inheritance");
  const parent = classes.find(c => c.id === parentLink?.to);
  const inheritance = parent ? (cls.kind === "interface" ? ` extends ${parent.name}` : ` extends ${parent.name}`) : "";
  const declaration = cls.kind === "interface" ? `public interface ${cls.name}${inheritance}` : `${cls.kind === "abstract" ? "public abstract" : "public"} class ${cls.name}${inheritance}`;
  const relationFields = relations.filter(r => r.from === cls.id && r.type !== "Inheritance").map(r => classes.find(c => c.id === r.to)).filter(Boolean).map(target => `    private ${target!.name} ${target!.name.charAt(0).toLowerCase() + target!.name.slice(1)};`);
  const ownFields = cls.fields.map(f => `    ${visibility(f.visibility)} ${javaType(f.type)} ${f.name};`);
  const fields = cls.kind === "interface" ? "" : [...ownFields, ...relationFields].join("\n");
  const methods = cls.methods.map(m => {
    if (cls.kind === "interface") return `    ${javaType(m.returnType)} ${m.name}();`;
    if (cls.kind === "abstract") return `    ${visibility(m.visibility)} abstract ${javaType(m.returnType)} ${m.name}();`;
    const body = m.returnType === "void" ? "" : m.returnType === "boolean" ? "return false;" : ["int", "long", "double", "float", "short", "byte"].includes(m.returnType.toLowerCase()) ? "return 0;" : "return null;";
    return `    ${visibility(m.visibility)} ${javaType(m.returnType)} ${m.name}() {\n        ${body}\n    }`;
  }).join("\n\n");
  return `${declaration} {\n${fields}${fields && methods ? "\n\n" : ""}${methods}\n}`;
}

function ClassCard({ cls, selected, scale, onSelect, onDrag }: { cls: UMLClass; selected: boolean; scale: number; onSelect: () => void; onDrag: (x: number, y: number) => void }) {
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  return (
    <article
      className={`uml-card absolute w-[230px] select-none overflow-hidden rounded-xl border bg-white shadow-[0_12px_30px_rgba(37,31,61,.10)] transition-shadow ${selected ? "border-indigo-500 ring-4 ring-indigo-500/10" : "border-slate-300 hover:border-indigo-300"}`}
      style={{ left: cls.x, top: cls.y }} onClick={onSelect}
    >
      <header
        className="flex cursor-grab items-start justify-between bg-[#222038] px-4 py-3 text-white active:cursor-grabbing"
        onPointerDown={(e) => { drag.current = { px: e.clientX, py: e.clientY, x: cls.x, y: cls.y }; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (drag.current) onDrag(Math.max(8, drag.current.x + (e.clientX - drag.current.px) / scale), Math.max(8, drag.current.y + (e.clientY - drag.current.py) / scale)); }}
        onPointerUp={() => { drag.current = null; }}
      >
        <div><p className="text-[11px] font-medium uppercase tracking-[.16em] text-indigo-200">{cls.kind === "class" ? "Class" : `«${cls.kind}»`}</p><h3 className="mt-0.5 text-base font-semibold tracking-tight">{cls.name}</h3></div>
        <GripVertical className="mt-1 size-4 text-slate-400" />
      </header>
      <div className="border-b border-slate-200 px-4 py-3 font-mono text-[12px] leading-6 text-slate-700">
        {cls.fields.length ? cls.fields.map((f, i) => <div key={i}><span className="mr-2 text-indigo-600">{f.visibility}</span>{f.name}: <span className="text-slate-400">{f.type}</span></div>) : <span className="italic text-slate-400">No attributes</span>}
      </div>
      <div className="px-4 py-3 font-mono text-[12px] leading-6 text-slate-700">
        {cls.methods.length ? cls.methods.map((m, i) => <div key={i}><span className="mr-2 text-indigo-600">{m.visibility}</span>{m.name}(): <span className="text-slate-400">{m.returnType}</span></div>) : <span className="italic text-slate-400">No operations</span>}
      </div>
    </article>
  );
}

export default function Home() {
  const [classes, setClasses] = useState(initialClasses);
  const [relations, setRelations] = useState(initialRelations);
  const [selectedId, setSelectedId] = useState(1);
  const [scale, setScale] = useState(1);
  const [tab, setTab] = useState("diagram");
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [relationType, setRelationType] = useState<Relation["type"]>("Association");
  const [relationFrom, setRelationFrom] = useState(1);
  const [relationTo, setRelationTo] = useState(3);
  const selected = classes.find(c => c.id === selectedId) ?? classes[0];
  const allCode = useMemo(() => classes.map(c => `// ${c.name}.java\n${generateJava(c, relations, classes)}`).join("\n\n"), [classes, relations]);
  const updateSelected = (patch: Partial<UMLClass>) => setClasses(prev => prev.map(c => c.id === selectedId ? { ...c, ...patch } : c));
  const addClass = () => { const id = Math.max(0, ...classes.map(c => c.id)) + 1; setClasses([...classes, { id, name: `NewClass${id}`, kind: "class", fields: [], methods: [], x: 140 + classes.length * 35, y: 140 + classes.length * 28 }]); setSelectedId(id); };
  const deleteClass = () => { if (classes.length <= 1) return; const next = classes.filter(c => c.id !== selectedId); setClasses(next); setRelations(r => r.filter(x => x.from !== selectedId && x.to !== selectedId)); setSelectedId(next[0].id); };
  const copyCode = async () => { await navigator.clipboard.writeText(allCode); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => { const url = URL.createObjectURL(new Blob([allCode], { type: "text/plain" })); const a = document.createElement("a"); a.href = url; a.download = "uml-java-classes.txt"; a.click(); URL.revokeObjectURL(url); };

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = context.registerTool({
      name: "add_uml_class",
      title: "Add UML class",
      description: "Add a class, abstract class, or interface to the current UML diagram.",
      inputSchema: { type: "object", properties: { name: { type: "string", minLength: 1 }, kind: { type: "string", enum: ["class", "abstract", "interface"] } }, required: ["name"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const value = input as { name?: string; kind?: UMLClass["kind"] };
        const name = value.name?.trim().replace(/\s/g, "");
        if (!name || !/^[A-Za-z_$][\w$]*$/.test(name)) throw new Error("name must be a valid Java identifier");
        const id = Math.max(0, ...classes.map(c => c.id)) + 1;
        const kind = value.kind ?? "class";
        setClasses(current => [...current, { id, name, kind, fields: [], methods: [], x: 120 + current.length * 32, y: 120 + current.length * 24 }]);
        setSelectedId(id);
        return { id, name, kind };
      },
    }, { signal: lifecycle.signal });
    Promise.resolve(register).catch(() => undefined);
    return () => lifecycle.abort();
  }, [classes]);

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-slate-900">
      <header className="flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><Boxes className="size-5" /></div><div><h1 className="font-semibold tracking-tight">ClassForge</h1><p className="text-xs text-slate-500">UML to Java workspace</p></div></div>
        <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 md:flex"><Button variant="ghost" size="icon-sm" aria-label="Undo" disabled><Undo2 /></Button><Button variant="ghost" size="icon-sm" aria-label="Redo" disabled><Redo2 /></Button><span className="mx-1 h-5 w-px bg-slate-200" /><span className="px-2 text-xs font-medium text-slate-500">Current session</span></div>
        <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={download}><Download /> <span className="hidden sm:inline">Export Java</span></Button></div>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="gap-0">
        <div className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <TabsList className="h-9 bg-slate-100"><TabsTrigger value="diagram"><GitBranch /> Diagram</TabsTrigger><TabsTrigger value="code"><Code2 /> Java code</TabsTrigger></TabsList>
          <div className="flex items-center gap-2 text-xs text-slate-500"><span>{classes.length} classes</span><span className="text-slate-300">•</span><span>{relations.length} relationships</span></div>
        </div>

        <TabsContent value="diagram" className="m-0">
          <div className="grid min-h-[calc(100vh-116px)] grid-cols-1 lg:grid-cols-[280px_minmax(520px,1fr)_300px]">
            <aside className="border-b border-slate-200 bg-white p-4 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Diagram classes</h2><Button size="icon-sm" onClick={addClass} aria-label="Add class"><Plus /></Button></div>
              <div className="relative mb-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e=>setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" placeholder="Find a class" /></div>
              <div className="space-y-2">{classes.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())).map(c => <button key={c.id} onClick={() => setSelectedId(c.id)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${selectedId === c.id ? "border-indigo-200 bg-indigo-50" : "border-transparent hover:bg-slate-50"}`}><span className={`grid size-8 place-items-center rounded-lg ${selectedId === c.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}><Braces className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{c.name}</span><span className="block text-xs capitalize text-slate-500">{c.kind}</span></span><ChevronDown className="size-4 -rotate-90 text-slate-400" /></button>)}</div>
              <div className="mt-6 rounded-xl bg-[#222038] p-4 text-white"><Layers3 className="size-5 text-indigo-300" /><p className="mt-3 text-sm font-semibold">Quick start</p><p className="mt-1 text-xs leading-5 text-slate-300">Select a class to edit it. Drag its dark header to rearrange your diagram.</p></div>
            </aside>

            <section className="relative min-h-[620px] overflow-hidden bg-canvas">
              <div className="absolute left-4 top-4 z-20 flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm"><Button variant="ghost" size="icon-sm" onClick={() => setScale(Math.min(1.3, scale + .1))} aria-label="Zoom in"><ZoomIn /></Button><span className="w-12 text-center text-xs font-semibold">{Math.round(scale * 100)}%</span><Button variant="ghost" size="icon-sm" onClick={() => setScale(Math.max(.65, scale - .1))} aria-label="Zoom out"><ZoomOut /></Button></div>
              <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm"><MousePointer2 className="ml-1 size-4 text-indigo-600" /><span className="pr-1 text-xs font-semibold text-slate-600">Select & move</span></div>
              <div className="relative h-[620px] w-[850px] origin-top-left transition-transform" style={{ transform: `scale(${scale})` }}>
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#7069a8" /></marker><marker id="diamond" viewBox="0 0 14 10" refX="13" refY="5" markerWidth="11" markerHeight="8" orient="auto"><path d="M 1 5 L 7 1 L 13 5 L 7 9 z" fill="#7069a8" /></marker></defs>{relations.map(r => { const a = classes.find(c => c.id === r.from); const b = classes.find(c => c.id === r.to); if (!a || !b) return null; return <g key={r.id}><line x1={a.x + 115} y1={a.y + 90} x2={b.x + 115} y2={b.y + 90} stroke="#7069a8" strokeWidth="2" strokeDasharray={r.type === "Association" ? "6 5" : undefined} markerEnd={r.type === "Inheritance" ? "url(#arrow)" : r.type === "Composition" ? "url(#diamond)" : undefined} /><rect x={(a.x+b.x)/2 + 70} y={(a.y+b.y)/2 + 74} width={r.type.length*6.5+14} height="22" rx="6" fill="white" stroke="#d9d8e7" /><text x={(a.x+b.x)/2 + 77} y={(a.y+b.y)/2 + 89} fontSize="10" fill="#5d597b">{r.type}</text></g>})}</svg>
                {classes.map(c => <ClassCard key={c.id} cls={c} selected={c.id === selectedId} scale={scale} onSelect={() => setSelectedId(c.id)} onDrag={(x,y) => setClasses(p => p.map(v => v.id === c.id ? {...v,x,y} : v))} />)}
              </div>
            </section>

            {selected && <aside className="border-t border-slate-200 bg-white p-4 lg:border-l lg:border-t-0">
              <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-wider text-indigo-600">Inspector</p><h2 className="mt-1 text-base font-semibold">{selected.name}</h2></div><Button variant="ghost" size="icon-sm" onClick={deleteClass} aria-label="Delete class" disabled={classes.length <= 1}><Trash2 className="text-rose-500" /></Button></div>
              <label className="field-label">Class name<input value={selected.name} onChange={e => updateSelected({name:e.target.value.replace(/\s/g,"")})} /></label>
              <label className="field-label">Type<select value={selected.kind} onChange={e => updateSelected({kind:e.target.value as UMLClass["kind"]})}><option value="class">Class</option><option value="abstract">Abstract class</option><option value="interface">Interface</option></select></label>
              <div className="mt-6 flex items-center justify-between"><h3 className="text-sm font-semibold">Attributes</h3><Button variant="ghost" size="xs" onClick={() => updateSelected({fields:[...selected.fields,{visibility:"-",name:"field",type:"String"}]})}><Plus /> Add</Button></div>
              <div className="mt-2 space-y-2">{selected.fields.map((f,i) => <div key={i} className="grid grid-cols-[42px_1fr_78px_28px] gap-1"><select value={f.visibility} onChange={e => updateSelected({fields:selected.fields.map((x,j)=>j===i?{...x,visibility:e.target.value as Field["visibility"]}:x)})}><option>+</option><option>-</option><option>#</option></select><input value={f.name} onChange={e=>updateSelected({fields:selected.fields.map((x,j)=>j===i?{...x,name:e.target.value}:x)})}/><input value={f.type} onChange={e=>updateSelected({fields:selected.fields.map((x,j)=>j===i?{...x,type:e.target.value}:x)})}/><button className="text-slate-400 hover:text-rose-500" onClick={()=>updateSelected({fields:selected.fields.filter((_,j)=>j!==i)})}><Minus className="size-4" /></button></div>)}</div>
              <div className="mt-6 flex items-center justify-between"><h3 className="text-sm font-semibold">Operations</h3><Button variant="ghost" size="xs" onClick={() => updateSelected({methods:[...selected.methods,{visibility:"+",name:"method",returnType:"void"}]})}><Plus /> Add</Button></div>
              <div className="mt-2 space-y-2">{selected.methods.map((m,i)=><div key={i} className="grid grid-cols-[42px_1fr_72px_28px] gap-1"><select value={m.visibility} onChange={e=>updateSelected({methods:selected.methods.map((x,j)=>j===i?{...x,visibility:e.target.value as Method["visibility"]}:x)})}><option>+</option><option>-</option><option>#</option></select><input value={m.name} onChange={e=>updateSelected({methods:selected.methods.map((x,j)=>j===i?{...x,name:e.target.value}:x)})}/><input value={m.returnType} onChange={e=>updateSelected({methods:selected.methods.map((x,j)=>j===i?{...x,returnType:e.target.value}:x)})}/><button className="text-slate-400 hover:text-rose-500" onClick={()=>updateSelected({methods:selected.methods.filter((_,j)=>j!==i)})}><Minus className="size-4" /></button></div>)}</div>
              <div className="mt-7 border-t border-slate-200 pt-5"><h3 className="text-sm font-semibold">Add relationship</h3><div className="mt-3 grid grid-cols-2 gap-2"><label className="mini-label">From<select value={relationFrom} onChange={e=>setRelationFrom(+e.target.value)}>{classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label className="mini-label">To<select value={relationTo} onChange={e=>setRelationTo(+e.target.value)}>{classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><label className="mini-label mt-2">Relationship<select value={relationType} onChange={e=>setRelationType(e.target.value as Relation["type"])}>{["Association","Inheritance","Aggregation","Composition"].map(x=><option key={x}>{x}</option>)}</select></label><Button className="mt-3 w-full" size="sm" disabled={relationFrom===relationTo} onClick={()=>setRelations([...relations,{id:Date.now(),from:relationFrom,to:relationTo,type:relationType}])}><GitBranch /> Connect classes</Button></div>
            </aside>}
          </div>
        </TabsContent>

        <TabsContent value="code" className="m-0">
          <div className="grid min-h-[calc(100vh-116px)] grid-cols-1 bg-[#171624] lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-white/10 bg-[#1e1d2d] p-4 text-white lg:border-b-0 lg:border-r"><p className="px-2 text-xs font-medium uppercase tracking-[.14em] text-slate-400">Generated files</p><div className="mt-3 space-y-1">{classes.map(c=><button key={c.id} onClick={()=>setSelectedId(c.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${selectedId===c.id?"bg-indigo-500/20 text-indigo-200":"text-slate-300 hover:bg-white/5"}`}><FileCode2 className="size-4" />{c.name}.java</button>)}</div></aside>
            <section className="min-w-0 p-4 sm:p-6"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-medium text-indigo-400">JAVA 21</p><h2 className="mt-1 text-lg font-semibold text-white">Live source preview</h2></div><div className="flex gap-2"><Button variant="outline" size="sm" className="border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={copyCode}>{copied?<Check />:<Copy />}{copied?"Copied":"Copy all"}</Button><Button size="sm" onClick={download}><Download /> Download</Button></div></div><pre className="min-h-[560px] overflow-auto rounded-xl border border-white/10 bg-[#11101b] p-5 font-mono text-[13px] leading-6 text-slate-300"><code>{allCode}</code></pre></section>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
