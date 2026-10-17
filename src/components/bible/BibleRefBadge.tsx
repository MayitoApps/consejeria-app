import React from 'react';
import { BookOpen } from 'lucide-react';
import { useBible } from '../../context/BibleContext';

interface BibleRefBadgeProps {
  reference: string;
  className?: string;
  variant?: 'subtle' | 'gold' | 'button';
  iconSize?: 'sm' | 'xs';
}

export const BibleRefBadge: React.FC<BibleRefBadgeProps> = ({
  reference,
  className = '',
  variant = 'subtle',
  iconSize = 'xs'
}) => {
  const { openBible } = useBible();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openBible(reference);
  };

  if (variant === 'gold') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200/80 border border-amber-300 hover:border-amber-400 text-amber-900 hover:text-amber-950 text-xs font-serif transition-all shadow-sm group ${className}`}
        title={`Abrir ${reference} en Lector Bíblico`}
      >
        <BookOpen className={`${iconSize === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-700 group-hover:scale-110 transition-transform flex-shrink-0`} />
        <span className="font-semibold tracking-tight">{reference}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-400/50 text-slate-800 hover:text-amber-900 text-xs font-medium transition-all shadow-sm group ${className}`}
        title={`Consultar ${reference}`}
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform flex-shrink-0" />
        <span className="font-serif">{reference}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50/90 hover:bg-amber-100 border border-amber-200/80 hover:border-amber-300 text-amber-900 hover:text-amber-950 text-[11px] font-serif transition-all cursor-pointer group ${className}`}
      title={`Clic para leer ${reference}`}
    >
      <BookOpen className={`${iconSize === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-amber-700 group-hover:text-amber-800 flex-shrink-0`} />
      <span className="font-medium underline decoration-amber-400/60 decoration-dotted underline-offset-2">{reference}</span>
    </button>
  );
};
