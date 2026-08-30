import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, ArrowRight, Sparkles, Filter, Bookmark } from 'lucide-react';
import { BibleStudy } from '../../types';
import { BIBLE_STUDIES } from '../../data/bibleStudiesData';

interface StudiesListProps {
  onSelectStudy: (study: BibleStudy) => void;
}

export const StudiesList: React.FC<StudiesListProps> = ({ onSelectStudy }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  const categories = useMemo(() => {
    const cats = ['Todas', ...new Set(BIBLE_STUDIES.map(s => s.category))];
    return cats;
  }, []);

  const filteredStudies = useMemo(() => {
    return BIBLE_STUDIES.filter(study => {
      const matchesCategory = selectedCategory === 'Todas' || study.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        study.title.toLowerCase().includes(q) ||
        study.subtitle.toLowerCase().includes(q) ||
        study.summary.toLowerCase().includes(q) ||
        study.tags.some(t => t.toLowerCase().includes(q)) ||
        study.sections.verses.some(v => v.reference.toLowerCase().includes(q) || v.text.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 animate-fade-in space-y-6 sm:space-y-8">
      
      {/* Hero Welcome Banner - Limpio, Espacioso y Refinado */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/[0.08] shadow-navy-md relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-amber-950/15">
        <div className="max-w-3xl relative z-10 space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Biblioteca Pastoral de Consejería Bíblica</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold gold-gradient-text tracking-tight leading-tight">
            Estudios Bíblicos & Hermenéuticos
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-300/90 leading-relaxed max-w-2xl pt-0.5">
            Guías doctrinales y exegéticas integrales para abordar las problemáticas del corazón con fidelidad escritural, discernimiento pastoral y planes prácticos de santificación.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-white/[0.06] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, versículo, pecado raíz o término teológico..."
              className="w-full pl-10 pr-9 py-2 bg-slate-900/70 border border-white/[0.08] rounded-xl text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500/60 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 ml-1 mr-0.5 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all select-none ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-gold-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Studies Grid - Limpio, espacioso y armónico */}
      {filteredStudies.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl p-8 border border-white/[0.05] space-y-2.5">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-serif text-base font-bold text-slate-300">No se encontraron estudios</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Intenta con otros términos de búsqueda o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => onSelectStudy(study)}
              className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 border border-white/[0.07] cursor-pointer group flex flex-col justify-between transition-all hover:border-amber-500/30 shadow-sm"
            >
              <div className="space-y-3.5">
                {/* Header de la Tarjeta */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {study.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-full border border-white/[0.05]">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{study.readTime}</span>
                  </div>
                </div>

                {/* Título y Subtítulo */}
                <div className="space-y-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug break-words">
                    {study.title}
                  </h3>
                  <p className="text-xs text-amber-200/70 italic font-serif break-words">
                    {study.subtitle}
                  </p>
                </div>

                {/* Resumen */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 break-words">
                  {study.summary}
                </p>

                {/* Pasajes Clave Preview */}
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/[0.04] space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 flex items-center space-x-1">
                    <Bookmark className="w-3 h-3" />
                    <span>{study.sections.verses.length} Pasajes Bíblicos</span>
                  </span>
                  <p className="text-[11px] text-slate-400 truncate">
                    {study.sections.verses.map(v => v.reference).join(' • ')}
                  </p>
                </div>
              </div>

              {/* Footer de la Tarjeta */}
              <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-medium text-amber-400/90">
                <span>Abrir Estudio Completo</span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
