import type { Lang } from "@/lib/i18n";

// WhatsApp & contact numbers, used by the page and by the structured data in seo.ts
export const WHATSAPP_IT = "393466023270";
export const WHATSAPP_DE = "4915123706891";
export const PHONE_IT_DISPLAY = "+39 346 6023270";
export const PHONE_DE_DISPLAY = "+49 151 23706891";

// Codice Identificativo Nazionale, required by law on every listing, website included.
// TODO: placeholder until the owner provides the real CIN (bdsr.ministeroturismo.gov.it).
export const CIN = "IT027008C2XXXXXXXX";

/** WhatsApp chat link: the German page writes to the German number, the others to the Italian one. */
export function whatsappUrl(lang: Lang, message: string) {
  const number = lang === "de" ? WHATSAPP_DE : WHATSAPP_IT;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
