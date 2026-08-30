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
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 animate-fade-in space-y-8">
      
      {/* Hero Welcome Banner - Expansivo y Luminoso */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-500/20 shadow-navy-md relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/20">
        <div className="max-w-4xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biblioteca Pastoral de Consejería Bíblica</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text tracking-tight leading-tight">
            Estudios Bíblicos & Hermenéuticos
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1 max-w-3xl">
            Guías doctrinales y exegéticas integrales para abordar las problemáticas del corazón con fidelidad escritural, discernimiento pastoral y planes prácticos de santificación.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-amber-500/15 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, versículo, pecado raíz o término teológico..."
              className="w-full pl-11 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-amber-400 flex-shrink-0 ml-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-gold-sm border border-amber-500'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Studies Grid - Espacioso, adaptable a toda la pantalla */}
      {filteredStudies.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl p-8 border border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-300">No se encontraron estudios</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Intenta con otros términos de búsqueda o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => onSelectStudy(study)}
              className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-amber-500/20 cursor-pointer group flex flex-col justify-between transition-all hover:border-amber-500/40 shadow-sm"
            >
              <div className="space-y-4">
                {/* Header de la Tarjeta */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    {study.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{study.readTime}</span>
                  </div>
                </div>

                {/* Título y Subtítulo */}
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug break-words">
                    {study.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200/80 italic font-serif break-words">
                    {study.subtitle}
                  </p>
                </div>

                {/* Resumen */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4 break-words">
                  {study.summary}
                </p>

                {/* Pasajes Clave Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                    <Bookmark className="w-3 h-3" />
                    <span>{study.sections.verses.length} Pasajes Bíblicos Incluidos</span>
                  </span>
                  <p className="text-xs text-slate-300 truncate">
                    {study.sections.verses.map(v => v.reference).join(' • ')}
                  </p>
                </div>
              </div>

              {/* Footer de la Tarjeta */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-400">
                <span>Abrir Estudio Completo</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
