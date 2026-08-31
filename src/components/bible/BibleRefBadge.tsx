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
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-serif transition-all shadow-sm group ${className}`}
        title={`Abrir ${reference} en Lector Bíblico`}
      >
        <BookOpen className={`${iconSize === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0`} />
        <span className="font-semibold tracking-tight">{reference}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-amber-950/40 border border-white/[0.08] hover:border-amber-400/50 text-slate-200 hover:text-amber-300 text-xs font-medium transition-all shadow-sm group ${className}`}
        title={`Consultar ${reference}`}
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
        <span className="font-serif">{reference}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-white/[0.06] hover:border-amber-400/40 text-amber-300 hover:text-amber-200 text-[11px] font-serif transition-all cursor-pointer group ${className}`}
      title={`Clic para leer ${reference}`}
    >
      <BookOpen className={`${iconSize === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-amber-400/80 group-hover:text-amber-300 flex-shrink-0`} />
      <span className="font-medium underline decoration-amber-500/40 decoration-dotted underline-offset-2">{reference}</span>
    </button>
  );
};
