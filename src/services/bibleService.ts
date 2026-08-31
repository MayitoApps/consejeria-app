import { BiblePassageLookup } from '../types';

export interface LblaVerseItem {
  type: 'heading1' | 'heading2' | 'verse' | 'paragraph';
  verse_numbers: number[];
  lines: string[];
}

export interface LblaChapter {
  chapter_usfm: string;
  current: { usfm: string; human: string };
  previous: { usfm: string; human: string } | null;
  next: { usfm: string; human: string } | null;
  items: LblaVerseItem[];
}

export interface LblaBook {
  book_usfm: string;
  name: string;
  chapters: LblaChapter[];
}

export interface LblaBibleData {
  version_id: number;
  local_abbreviation: string;
  local_title: string;
  publisher: { name: string };
  copyright: { text: string };
  books: LblaBook[];
}

export interface BibleCategoryGroup {
  name: string;
  testament: 'Antiguo' | 'Nuevo';
  books: string[];
}

export const BIBLE_CATEGORIES: BibleCategoryGroup[] = [
  {
    name: 'Pentateuco / La Ley',
    testament: 'Antiguo',
    books: ['Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio']
  },
  {
    name: 'Libros Históricos',
    testament: 'Antiguo',
    books: ['Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester']
  },
  {
    name: 'Poéticos y Sabiduría',
    testament: 'Antiguo',
    books: ['Job', 'Salmo', 'Proverbios', 'Eclesiastés', 'Cantares']
  },
  {
    name: 'Profetas Mayores',
    testament: 'Antiguo',
    books: ['Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel']
  },
  {
    name: 'Profetas Menores',
    testament: 'Antiguo',
    books: ['Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías']
  },
  {
    name: 'Evangelios y Hechos',
    testament: 'Nuevo',
    books: ['Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos']
  },
  {
    name: 'Epístolas Paulinas',
    testament: 'Nuevo',
    books: ['Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón']
  },
  {
    name: 'Epístolas Generales y Profecía',
    testament: 'Nuevo',
    books: ['Hebreos', 'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis']
  }
];

// Alias y abreviaturas comunes para reconocer cualquier libro ingresado
const BOOK_ALIASES: Record<string, string> = {
  'gn': 'Génesis', 'gen': 'Génesis', 'genesis': 'Génesis',
  'ex': 'Éxodo', 'exo': 'Éxodo', 'exodo': 'Éxodo',
  'lv': 'Levítico', 'lev': 'Levítico', 'levitico': 'Levítico',
  'nm': 'Números', 'num': 'Números', 'numeros': 'Números',
  'dt': 'Deuteronomio', 'deut': 'Deuteronomio', 'deuteronomio': 'Deuteronomio',
  'jos': 'Josué', 'josue': 'Josué',
  'jue': 'Jueces', 'juec': 'Jueces', 'jueces': 'Jueces',
  'rt': 'Rut', 'rut': 'Rut',
  '1s': '1 Samuel', '1sam': '1 Samuel', '1samuel': '1 Samuel', '1 s': '1 Samuel', '1 sam': '1 Samuel',
  '2s': '2 Samuel', '2sam': '2 Samuel', '2samuel': '2 Samuel', '2 s': '2 Samuel', '2 sam': '2 Samuel',
  '1r': '1 Reyes', '1rey': '1 Reyes', '1reyes': '1 Reyes', '1 r': '1 Reyes', '1 rey': '1 Reyes',
  '2r': '2 Reyes', '2rey': '2 Reyes', '2reyes': '2 Reyes', '2 r': '2 Reyes', '2 rey': '2 Reyes',
  '1cr': '1 Crónicas', '1cron': '1 Crónicas', '1cronicas': '1 Crónicas', '1 cr': '1 Crónicas', '1 cron': '1 Crónicas',
  '2cr': '2 Crónicas', '2cron': '2 Crónicas', '2cronicas': '2 Crónicas', '2 cr': '2 Crónicas', '2 cron': '2 Crónicas',
  'esd': 'Esdras', 'esdras': 'Esdras',
  'neh': 'Nehemías', 'nehemias': 'Nehemías',
  'est': 'Ester', 'ester': 'Ester',
  'jb': 'Job', 'job': 'Job',
  'sal': 'Salmo', 'salmo': 'Salmo', 'salmos': 'Salmo', 'ps': 'Salmo', 'psa': 'Salmo',
  'pr': 'Proverbios', 'prov': 'Proverbios', 'proverbios': 'Proverbios',
  'ec': 'Eclesiastés', 'ecl': 'Eclesiastés', 'eclesiastes': 'Eclesiastés',
  'cnt': 'Cantares', 'cant': 'Cantares', 'cantares': 'Cantares',
  'is': 'Isaías', 'isa': 'Isaías', 'isaias': 'Isaías',
  'jr': 'Jeremías', 'jer': 'Jeremías', 'jeremias': 'Jeremías',
  'lm': 'Lamentaciones', 'lam': 'Lamentaciones', 'lamentaciones': 'Lamentaciones',
  'ez': 'Ezequiel', 'eze': 'Ezequiel', 'ezequiel': 'Ezequiel',
  'dn': 'Daniel', 'dan': 'Daniel', 'daniel': 'Daniel',
  'os': 'Oseas', 'ose': 'Oseas', 'oseas': 'Oseas',
  'jl': 'Joel', 'joel': 'Joel',
  'am': 'Amós', 'amos': 'Amós',
  'abd': 'Abdías', 'abdias': 'Abdías',
  'jon': 'Jonás', 'jonas': 'Jonás',
  'miq': 'Miqueas', 'miqueas': 'Miqueas',
  'nah': 'Nahúm', 'nahum': 'Nahúm',
  'hab': 'Habacuc', 'habacuc': 'Habacuc',
  'sof': 'Sofonías', 'sofonias': 'Sofonías',
  'hag': 'Hageo', 'hageo': 'Hageo',
  'zac': 'Zacarías', 'zacarias': 'Zacarías',
  'mal': 'Malaquías', 'malaquias': 'Malaquías',
  'mt': 'Mateo', 'mat': 'Mateo', 'mateo': 'Mateo', 'san mateo': 'Mateo',
  'mc': 'Marcos', 'mr': 'Marcos', 'mar': 'Marcos', 'marcos': 'Marcos', 'san marcos': 'Marcos',
  'lc': 'Lucas', 'luc': 'Lucas', 'lucas': 'Lucas', 'san lucas': 'Lucas',
  'jn': 'Juan', 'juan': 'Juan', 'san juan': 'Juan',
  'hch': 'Hechos', 'hech': 'Hechos', 'hechos': 'Hechos', 'act': 'Hechos',
  'ro': 'Romanos', 'rom': 'Romanos', 'romanos': 'Romanos',
  '1co': '1 Corintios', '1cor': '1 Corintios', '1corintios': '1 Corintios', '1 co': '1 Corintios', '1 cor': '1 Corintios',
  '2co': '2 Corintios', '2cor': '2 Corintios', '2corintios': '2 Corintios', '2 co': '2 Corintios', '2 cor': '2 Corintios',
  'gal': 'Gálatas', 'galatas': 'Gálatas',
  'ef': 'Efesios', 'efe': 'Efesios', 'efesios': 'Efesios', 'eph': 'Efesios',
  'fil': 'Filipenses', 'flp': 'Filipenses', 'filipenses': 'Filipenses',
  'col': 'Colosenses', 'colosenses': 'Colosenses',
  '1ts': '1 Tesalonicenses', '1tes': '1 Tesalonicenses', '1tesalonicenses': '1 Tesalonicenses', '1 ts': '1 Tesalonicenses', '1 tes': '1 Tesalonicenses',
  '2ts': '2 Tesalonicenses', '2tes': '2 Tesalonicenses', '2tesalonicenses': '2 Tesalonicenses', '2 ts': '2 Tesalonicenses', '2 tes': '2 Tesalonicenses',
  '1ti': '1 Timoteo', '1tim': '1 Timoteo', '1timoteo': '1 Timoteo', '1 ti': '1 Timoteo', '1 tim': '1 Timoteo',
  '2ti': '2 Timoteo', '2tim': '2 Timoteo', '2timoteo': '2 Timoteo', '2 ti': '2 Timoteo', '2 tim': '2 Timoteo',
  'tit': 'Tito', 'tito': 'Tito',
  'flm': 'Filemón', 'filemon': 'Filemón',
  'heb': 'Hebreos', 'hebreos': 'Hebreos',
  'stg': 'Santiago', 'sant': 'Santiago', 'santiago': 'Santiago', 'jas': 'Santiago',
  '1p': '1 Pedro', '1pe': '1 Pedro', '1ped': '1 Pedro', '1pedro': '1 Pedro', '1 p': '1 Pedro', '1 pe': '1 Pedro', '1 ped': '1 Pedro',
  '2p': '2 Pedro', '2pe': '2 Pedro', '2ped': '2 Pedro', '2pedro': '2 Pedro', '2 p': '2 Pedro', '2 pe': '2 Pedro', '2 ped': '2 Pedro',
  '1jn': '1 Juan', '1juan': '1 Juan', '1 jn': '1 Juan', '1 juan': '1 Juan',
  '2jn': '2 Juan', '2juan': '2 Juan', '2 jn': '2 Juan', '2 juan': '2 Juan',
  '3jn': '3 Juan', '3juan': '3 Juan', '3 jn': '3 Juan', '3 juan': '3 Juan',
  'jud': 'Judas', 'judas': 'Judas',
  'ap': 'Apocalipsis', 'apoc': 'Apocalipsis', 'apocalipsis': 'Apocalipsis', 'rev': 'Apocalipsis'
};

// Singleton de almacenamiento en memoria de la Biblia LBLA completa
let cachedBibleData: LblaBibleData | null = null;
let loadPromise: Promise<LblaBibleData> | null = null;

function normalizeString(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

/**
 * Carga de forma asíncrona la Biblia LBLA completa desde public/data/lbla.json
 */
export async function loadLblaBible(): Promise<LblaBibleData> {
  if (cachedBibleData) return cachedBibleData;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const response = await fetch('/data/lbla.json');
      if (!response.ok) {
        throw new Error(`Error al cargar LBLA: ${response.statusText}`);
      }
      const data: LblaBibleData = await response.json();
      cachedBibleData = data;
      return data;
    } catch (err) {
      console.error('Error al cargar la Biblia LBLA local:', err);
      // Fallback a URL pública de respaldo si el fetch local fallara
      const fallbackRes = await fetch('https://mrk214.github.io/snapshots/es___spa___spa/LBLA_vid_89.json');
      const data: LblaBibleData = await fallbackRes.json();
      cachedBibleData = data;
      return data;
    }
  })();

  return loadPromise;
}

/**
 * Encuentra un libro de la LBLA por nombre o abreviatura
 */
export function findLblaBook(books: LblaBook[], bookNameOrAbbr: string): LblaBook | null {
  const norm = normalizeString(bookNameOrAbbr.replace(/\.$/, ''));

  // 1. Buscar en diccionario de alias
  if (BOOK_ALIASES[norm]) {
    const targetName = BOOK_ALIASES[norm];
    const found = books.find(b => b.name === targetName);
    if (found) return found;
  }

  // 2. Coincidencia exacta o normalizada
  const exact = books.find(b => normalizeString(b.name) === norm);
  if (exact) return exact;

  // 3. Coincidencia de inicio
  const starts = books.find(b => normalizeString(b.name).startsWith(norm) || norm.startsWith(normalizeString(b.name)));
  if (starts) return starts;

  // 4. Búsqueda por usfm
  const usfmMatch = books.find(b => b.book_usfm.toLowerCase() === norm);
  if (usfmMatch) return usfmMatch;

  return null;
}

/**
 * Normaliza y analiza un string de referencia bíblica
 */
export function parseBibleReference(rawRef: string): {
  bookName: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
} | null {
  if (!rawRef || typeof rawRef !== 'string') return null;

  const clean = rawRef.trim().replace(/[()[\]]/g, '');
  
  // Ejemplos: "Efesios 4:22-24", "1 Corintios 13:4-7", "Salmos 23", "Rom 8:28", "Juan 3:16"
  const regex = /^([1-3]?\s*[a-záéíóúñA-ZÁÉÍÓÚÑ.]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
  const match = clean.match(regex);

  if (!match) {
    // Si solo viene el nombre del libro (ej: "Romanos", "Salmo")
    const justBook = clean.trim();
    if (justBook.length >= 2) {
      return {
        bookName: justBook,
        chapter: 1
      };
    }
    return null;
  }

  const rawBook = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verseStart = match[3] ? parseInt(match[3], 10) : undefined;
  const verseEnd = match[4] ? parseInt(match[4], 10) : verseStart;

  return {
    bookName: rawBook,
    chapter: isNaN(chapter) ? 1 : chapter,
    verseStart,
    verseEnd
  };
}

/**
 * Obtiene el contenido completo de un capítulo de la LBLA
 */
export async function getLblaChapterData(
  bookName: string, 
  chapterNumber: number
): Promise<{
  book: LblaBook;
  chapter: LblaChapter;
  totalChapters: number;
} | null> {
  const bible = await loadLblaBible();
  const book = findLblaBook(bible.books, bookName);
  if (!book) return null;

  const validChapterNum = Math.max(1, Math.min(chapterNumber, book.chapters.length));
  const chapter = book.chapters[validChapterNum - 1];

  return {
    book,
    chapter,
    totalChapters: book.chapters.length
  };
}

/**
 * Consulta y formatea cualquier pasaje bíblico en La Biblia de las Américas (LBLA)
 */
export async function lookupBiblePassage(referenceText: string): Promise<BiblePassageLookup> {
  const parsed = parseBibleReference(referenceText);
  const bible = await loadLblaBible();

  if (!parsed) {
    return {
      book: referenceText,
      chapter: 1,
      referenceText,
      text: `No se pudo encontrar el pasaje "${referenceText}". Verifica el libro y capítulo.`,
      version: 'La Biblia de las Américas (LBLA)'
    };
  }

  const book = findLblaBook(bible.books, parsed.bookName);
  if (!book) {
    return {
      book: parsed.bookName,
      chapter: parsed.chapter,
      referenceText,
      text: `El libro "${parsed.bookName}" no fue reconocido.`,
      version: 'La Biblia de las Américas (LBLA)'
    };
  }

  const chapterIndex = Math.max(0, Math.min(parsed.chapter - 1, book.chapters.length - 1));
  const chapter = book.chapters[chapterIndex];

  let verses = chapter.items.filter(it => it.type === 'verse');
  let selectedRefText = `${book.name} ${parsed.chapter}`;

  if (parsed.verseStart) {
    const vEnd = parsed.verseEnd || parsed.verseStart;
    verses = verses.filter(v => 
      v.verse_numbers.some(num => num >= parsed.verseStart! && num <= vEnd)
    );
    selectedRefText += `:${parsed.verseStart}${vEnd !== parsed.verseStart ? `-${vEnd}` : ''}`;
  }

  const formattedText = verses
    .map(v => `${v.verse_numbers.join('-')} ${v.lines.join(' ')}`)
    .join('\n\n');

  return {
    book: book.name,
    chapter: parsed.chapter,
    verseStart: parsed.verseStart,
    verseEnd: parsed.verseEnd,
    referenceText: selectedRefText,
    text: formattedText || `(Sin texto disponible para los versículos solicitados)`,
    version: 'La Biblia de las Américas (LBLA)',
    sourceNotes: 'Texto íntegro oficial de La Biblia de las Américas (LBLA) — © The Lockman Foundation'
  };
}

/**
 * Búsqueda de concordancia / texto completo en la Biblia LBLA
 */
export async function searchLblaBible(
  queryText: string, 
  limit: number = 30
): Promise<{
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  reference: string;
  text: string;
}[]> {
  if (!queryText || queryText.trim().length < 2) return [];

  const bible = await loadLblaBible();
  const normQuery = normalizeString(queryText);
  const results: {
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    reference: string;
    text: string;
  }[] = [];

  for (const book of bible.books) {
    for (let cIdx = 0; cIdx < book.chapters.length; cIdx++) {
      const chapter = book.chapters[cIdx];
      const chapterNum = cIdx + 1;

      for (const item of chapter.items) {
        if (item.type === 'verse') {
          const verseText = item.lines.join(' ');
          if (normalizeString(verseText).includes(normQuery)) {
            const verseNum = item.verse_numbers[0] || 1;
            results.push({
              bookName: book.name,
              chapterNumber: chapterNum,
              verseNumber: verseNum,
              reference: `${book.name} ${chapterNum}:${verseNum}`,
              text: verseText
            });

            if (results.length >= limit) return results;
          }
        }
      }
    }
  }

  return results;
}
