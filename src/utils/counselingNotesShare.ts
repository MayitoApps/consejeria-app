import html2canvas from 'html2canvas';
import { CounselingNoteCard } from '../types/notes';

/**
 * Genera el enlace directo a la nota en la aplicación web
 */
export const generateWhatsAppShareLink = (card: CounselingNoteCard): string => {
  const origin = window.location.origin;
  const path = window.location.pathname;
  return `${origin}${path}?tab=notes&nota=${card.number}`;
};

/**
 * Genera el texto con formato para WhatsApp con mensaje personalizado y link directo
 */
export const generateWhatsAppText = (card: CounselingNoteCard): string => {
  const shareUrl = generateWhatsAppShareLink(card);
  const parts: string[] = [];

  if (card.isIntro) {
    parts.push(`📖 *INTRODUCCIÓN A LA CONSEJERÍA BÍBLICA* 🕊️`);
    parts.push(``);
    parts.push(`_Si existe un ministerio que es vital para la salud espiritual de una iglesia local es el de discipular y aconsejar bíblicamente._`);
    parts.push(``);
    parts.push(`El Señor Jesucristo nos llama a *‘Hacer discípulos… enseñándoles a guardar todo lo que os he mandado...’*, este es el ministerio que *Efesios 4:12* nos apunta:`);
    parts.push(`« 12 a fin de capacitar a los santos para la obra del ministerio, para la edificación del cuerpo de Cristo. »`);
    parts.push(``);
    parts.push(`*La importancia del ministerio al que Dios nos ha llamado:*`);
    parts.push(`1️⃣ Reconociendo siempre que el Consejero detrás de toda su consejería es el *Espíritu Santo*.`);
    parts.push(`2️⃣ El aconsejado y el consejero tienen un trabajo que hacer, entendiendo y actuando de acuerdo a la *Biblia*.`);
    parts.push(`3️⃣ El ministerio de la palabra pública (predicación expositiva), así como la ministración de la palabra en privado, uno a uno, son la base de una iglesia sana bíblicamente.`);
    parts.push(``);
    parts.push(`De este ministerio depende el crecimiento espiritual de cada uno de nosotros al conocer y vivir lo que Dios pide a su iglesia.`);
    parts.push(``);
    parts.push(`📜 *Efesios 4:13*:`);
    parts.push(`« 13 hasta que todos lleguemos a la unidad de la fe y del conocimiento pleno del Hijo de Dios, a la condición de un hombre maduro, a la medida de la estatura de la plenitud de Cristo; »`);
    parts.push(``);
    parts.push(`────────────────────────`);
    parts.push(`*Consejería bíblica es la aplicación del ministerio uno a uno modelado por Cristo, usando la sabiduría de su Palabra para guiar a la persona en el proceso de cambio bíblico y experimentar la transformación en su caminar que dé gloria a Dios.*`);
    parts.push(`────────────────────────`);
    parts.push(``);
    parts.push(`📜 *Colosenses 1:28*:`);
    parts.push(`« 28 A Él nosotros proclamamos, amonestando a todos los hombres, y enseñando a todos los hombres con toda sabiduría, a fin de poder presentar a todo hombre perfecto en Cristo. »`);
    parts.push(``);
    parts.push(`👉 *Puedes ver la nota interactiva completa aquí:*`);
    parts.push(shareUrl);
    parts.push(``);
    parts.push(`────────────────────────`);
    parts.push(`🕊️ _Ancla Consejería Bíblica_`);
    return parts.join('\n');
  }

  parts.push(`¡Hola! Mira esta nota sobre *${card.title}* 📖`);
  parts.push(``);
  parts.push(`💡 *${card.category}*:`);
  parts.push(`"${card.coreTeaching}"`);

  if (card.biblicalPassages && card.biblicalPassages.length > 0) {
    parts.push(``);
    parts.push(`📜 *${card.biblicalPassages[0].reference}*`);
    parts.push(`"${card.biblicalPassages[0].text}"`);
  }

  if (card.quote) {
    parts.push(``);
    parts.push(`💬 «${card.quote.text}» — _${card.quote.author}_`);
  }

  parts.push(``);
  parts.push(`👉 *Puedes ver la nota completa en la página aquí:*`);
  parts.push(shareUrl);
  parts.push(``);
  parts.push(`────────────────────────`);
  parts.push(`🕊️ _Ancla Consejería Bíblica_`);

  return parts.join('\n');
};

/**
 * Abre WhatsApp directamente con el texto formateado y el enlace
 */
export const shareToWhatsApp = (card: CounselingNoteCard): void => {
  const text = generateWhatsAppText(card);
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Copia el texto formateado completo al portapapeles
 */
export const copyCardToClipboard = async (card: CounselingNoteCard): Promise<boolean> => {
  try {
    const text = generateWhatsAppText(card);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
};

/**
 * Copia solo el enlace directo a la nota al portapapeles
 */
export const copyDirectLinkToClipboard = async (card: CounselingNoteCard): Promise<boolean> => {
  try {
    const link = generateWhatsAppShareLink(card);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(link);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = link;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('Error al copiar enlace directo:', err);
    return false;
  }
};

/**
 * Descarga el elemento HTML de la tarjeta como imagen PNG de alta resolución
 */
export const downloadCardAsImage = async (
  elementId: string, 
  title: string
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Elemento con id ${elementId} no encontrado`);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f2f4ee',
      logging: false,
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);
    link.download = `nota-consejeria-${cleanTitle}.png`;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (err) {
    console.error('Error al capturar imagen de nota:', err);
    return false;
  }
};
