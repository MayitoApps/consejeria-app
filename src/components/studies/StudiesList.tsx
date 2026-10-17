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
      
      {/* Hero Welcome Banner - Verde Salvia & Pergamino Pastoral */}
      <div className="rounded-2xl p-6 sm:p-8 lg:p-10 border border-[#d2daca] shadow-sm relative overflow-hidden bg-gradient-to-r from-[#e8ece2] via-[#f1f3ec] to-[#e4e9dd]">
        <div className="max-w-3xl relative z-10 space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-sage-100 border border-sage-300 text-sage-950 text-[10px] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-sage-700" />
            <span>Biblioteca Pastoral de Consejería Bíblica</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#192722] tracking-tight leading-tight">
            Estudios Bíblicos & Hermenéuticos
          </h1>
          <p className="text-xs sm:text-[13px] text-[#253831] leading-relaxed max-w-2xl pt-0.5">
            Guías doctrinales y exegéticas integrales para abordar las problemáticas del corazón con fidelidad escritural, discernimiento pastoral y planes prácticos de santificación.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#fbfcfa] rounded-2xl p-3.5 sm:p-4 border border-[#d2daca] shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71847a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, versículo, pecado raíz o término teológico..."
              className="w-full pl-10 pr-9 py-2 bg-[#edf2ea] border border-[#d2daca] rounded-xl text-[#192722] placeholder-[#71847a] text-xs focus:outline-none focus:border-sage-600 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#253831] hover:text-black px-1.5 py-0.5 rounded bg-[#dfe8da]"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-sage-700 flex-shrink-0 ml-1 mr-0.5 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all select-none ${
                  selectedCategory === cat
                    ? 'bg-sage-800 text-white shadow-sm'
                    : 'bg-[#edf2ea] text-[#253831] hover:text-sage-950 border border-[#d2daca]'
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
        <div className="text-center py-12 bg-[#fbfcfa] rounded-2xl p-8 border border-[#d2daca] space-y-2.5">
          <BookOpen className="w-10 h-10 text-[#71847a] mx-auto" />
          <h3 className="font-serif text-base font-bold text-[#192722]">No se encontraron estudios</h3>
          <p className="text-xs text-[#56685f] max-w-sm mx-auto">
            Intenta con otros términos de búsqueda o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredStudies.map((study) => (
            <div
              key={study.id}
              onClick={() => onSelectStudy(study)}
              className="bg-[#fbfcfa] rounded-2xl p-5 sm:p-6 border border-[#d2daca] cursor-pointer group flex flex-col justify-between transition-all hover:border-sage-500 shadow-sm hover:shadow-md"
            >
              <div className="space-y-3.5">
                {/* Header de la Tarjeta */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-950 border border-sage-300">
                    {study.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[11px] text-[#253831] bg-[#edf2ea] px-2 py-0.5 rounded-full border border-[#d2daca]">
                    <Clock className="w-3 h-3 text-sage-700" />
                    <span>{study.readTime}</span>
                  </div>
                </div>

                {/* Título y Subtítulo */}
                <div className="space-y-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#192722] group-hover:text-sage-900 transition-colors leading-snug break-words">
                    {study.title}
                  </h3>
                  <p className="text-xs text-sage-800 italic font-serif break-words">
                    {study.subtitle}
                  </p>
                </div>

                {/* Resumen */}
                <p className="text-xs text-[#253831] leading-relaxed line-clamp-3 break-words">
                  {study.summary}
                </p>

                {/* Pasajes Clave Preview */}
                <div className="p-3 rounded-xl bg-[#f0f5ee] border border-[#cfe0cb] space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-950 flex items-center space-x-1">
                    <Bookmark className="w-3 h-3 text-sage-700" />
                    <span>{study.sections.verses.length} Pasajes Bíblicos</span>
                  </span>
                  <p className="text-[11px] text-[#253831] truncate">
                    {study.sections.verses.map(v => v.reference).join(' • ')}
                  </p>
                </div>
              </div>

              {/* Footer de la Tarjeta */}
              <div className="mt-5 pt-3 border-t border-[#e6eae0] flex items-center justify-between text-xs font-medium text-sage-900">
                <span>Abrir Estudio Completo</span>
                <div className="w-7 h-7 rounded-lg bg-sage-100 border border-sage-300 text-sage-900 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-sage-800 group-hover:text-white transition-all">
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
