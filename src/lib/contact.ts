import { projects } from '../data/projects';

/**
 * Número de WhatsApp da equipe comercial.
 * Este é um PROTÓTIPO: nenhum número real foi configurado.
 * Com valor vazio, o link abre o WhatsApp para o visitante escolher o contato.
 * Para produção, informe apenas dígitos com DDI e DDD (ex.: '55DDDNUMERO').
 */
export const WHATSAPP_NUMBER = '';

export const PROJECT_OPTIONS = [
  ...projects.map((p) => ({ value: p.slug, label: p.name })),
  { value: 'indefinido', label: 'Ainda estou decidindo' },
] as const;

export interface ContactInput {
  project: string;
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

/** Remove caracteres de controle e marcação, normaliza espaços. */
export function sanitize(value: string, { multiline = false } = {}): string {
  // eslint-disable-next-line no-control-regex
  let v = value.normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/[<>]/g, '');
  if (multiline) {
    v = v.replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
    return v.split('\n').map((l) => l.trim()).join('\n').trim();
  }
  return v.replace(/\s+/g, ' ').trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\p{M}' .-]*$/u;

export const LIMITS = { name: 80, email: 120, message: 1000 } as const;

export function validateContact(raw: ContactInput): { data: ContactInput; errors: ContactErrors } {
  const data: ContactInput = {
    project: sanitize(raw.project),
    name: sanitize(raw.name),
    email: sanitize(raw.email).toLowerCase(),
    message: sanitize(raw.message, { multiline: true }),
  };
  const errors: ContactErrors = {};

  if (!PROJECT_OPTIONS.some((o) => o.value === data.project)) errors.project = 'Escolha um empreendimento ou a opção "Ainda estou decidindo".';

  if (!data.name) errors.name = 'Informe seu nome.';
  else if (data.name.length < 2) errors.name = 'O nome precisa ter pelo menos 2 letras.';
  else if (data.name.length > LIMITS.name) errors.name = `Use até ${LIMITS.name} caracteres.`;
  else if (!NAME_RE.test(data.name)) errors.name = 'Use apenas letras, espaços, hífen ou apóstrofo.';

  if (!data.email) errors.email = 'Informe seu e-mail.';
  else if (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email)) errors.email = 'Confira o e-mail. Exemplo: nome@dominio.com';

  if (!data.message) errors.message = 'Conte um pouco sobre o que você procura.';
  else if (data.message.length < 10) errors.message = 'Escreva pelo menos 10 caracteres.';
  else if (data.message.length > LIMITS.message) errors.message = `Use até ${LIMITS.message} caracteres.`;

  return { data, errors };
}

export function buildWhatsAppMessage(d: ContactInput): string {
  const project = PROJECT_OPTIONS.find((o) => o.value === d.project)?.label ?? 'Não informado';
  return [
    'Olá, equipe ATRIUM.',
    '',
    `Tenho interesse em: ${project}`,
    `Nome: ${d.name}`,
    `E-mail: ${d.email}`,
    '',
    d.message,
  ].join('\n');
}

export function whatsAppUrl(text: string, number: string = WHATSAPP_NUMBER): string {
  const digits = number.replace(/\D/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}
