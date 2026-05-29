import { useState } from "react";
import frameworkData from "./framework.json";

export default function FrameworkListSearchFilter() {
    /** STATE **/
    const [dataForm, setDataForm] = useState({
        searchTerm: "",
        selectedTag: "",
    });

    /** HANDLE INPUT **/
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    /** SEARCH & FILTER LOGIC **/
    const _searchTerm = dataForm.searchTerm.toLowerCase();

    const filteredFrameworks = frameworkData.filter((framework) => {
        const fullText = `
            ${framework.name}
            ${framework.description}
            ${framework.tags.join(" ")}
        `.toLowerCase();

        const matchesSearch = fullText.includes(_searchTerm);
        const matchesTag = dataForm.selectedTag
            ? framework.tags.includes(dataForm.selectedTag)
            : true;

        return matchesSearch && matchesTag;
    });

    /** UNIQUE TAGS **/
    const allTags = [...new Set(frameworkData.flatMap((f) => f.tags))];

    /** HIGHLIGHT TEXT **/
    const highlightText = (text, keyword) => {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, "gi");
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === keyword.toLowerCase() ? (
                <mark key={index} className="bg-cyan-500/30 text-cyan-200 rounded px-1 tracking-tight">
                    {part}
                </mark>
            ) : part
        );
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-purple-500/50">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-400 to-slate-700">
                        TECH ARCHIVE <span className="text-cyan-500 not-italic text-4xl block md:inline">2.0</span>
                    </h1>
                    <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold">
                        Database Access Authorized • Protocol v1.9.26
                    </p>
                </header>

                {/* Filter Panel */}
                <div className="bg-white/[0.02] border border-white/10 backdrop-blur-md rounded-3xl p-4 md:p-6 mb-12 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <input
                                type="text"
                                name="searchTerm"
                                value={dataForm.searchTerm}
                                placeholder="Search by name, description, or tags..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-12 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-700"
                                onChange={handleChange}
                            />
                            <span className="absolute left-4 top-4.5 opacity-30 text-cyan-400">🔍</span>
                        </div>
                        <select
                            name="selectedTag"
                            value={dataForm.selectedTag}
                            className="bg-black/40 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all appearance-none cursor-pointer"
                            onChange={handleChange}
                        >
                            <option value="">All Categories</option>
                            {allTags.map((tag) => (
                                <option key={tag} value={tag} className="bg-slate-950">{tag}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Grid Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFrameworks.map((item) => (
                        <div 
                            key={item.id} 
                            className="group relative flex flex-col bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] p-8 transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
                        >
                            {/* Header Card */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                    <span className="text-xl font-bold text-cyan-400">#0{item.id}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Release</p>
                                    <p className="text-sm font-mono font-bold text-purple-400">{item.details.releaseYear}</p>
                                </div>
                            </div>

                            {/* Title & Desc */}
                            <h2 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
                                {highlightText(item.name, dataForm.searchTerm)}
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                                {highlightText(item.description, dataForm.searchTerm)}
                            </p>

                            {/* Info Block */}
                            <div className="space-y-2 mb-8 p-4 bg-black/30 rounded-2xl border border-white/5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500 uppercase font-bold">Developer</span>
                                    <span className="text-slate-200">{item.details.developer}</span>
                                </div>
                            </div>

                            {/* Link Button */}
                            <a 
                                href={item.details.officialWebsite} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-center text-sm font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 active:scale-95"
                            >
                                Visit Website ↗
                            </a>

                            {/* Tags list inside card */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase ${tag === dataForm.selectedTag ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-600'}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredFrameworks.length === 0 && (
                    <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-slate-600 text-xl font-black italic uppercase tracking-[0.2em]">Data not found in archive</p>
                    </div>
                )}
            </div>
        </div>
    );
}