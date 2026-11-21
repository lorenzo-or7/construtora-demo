import { describe, expect, it } from 'vitest';
import { buildWhatsAppMessage, sanitize, validateContact, whatsAppUrl } from './contact';

const valid = { project: 'aura-residence', name: 'Ana Souza', email: 'ana@exemplo.com', message: 'Gostaria de conhecer o projeto.' };

describe('sanitize', () => {
  it('remove marcação e caracteres de controle', () => {
    expect(sanitize('  <b>Ana</b>\u0007  ')).toBe('bAna/b');
  });
  it('preserva quebras de linha em texto multilinha', () => {
    expect(sanitize('linha 1\r\n\r\n\r\n  linha 2  ', { multiline: true })).toBe('linha 1\n\nlinha 2');
  });
});

describe('validateContact', () => {
  it('aceita dados válidos', () => {
    expect(validateContact(valid).errors).toEqual({});
  });
  it('rejeita campos vazios com mensagens específicas', () => {
    const { errors } = validateContact({ project: '', name: '', email: '', message: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'project']);
  });
  it('rejeita e-mail inválido e empreendimento inexistente', () => {
    const { errors } = validateContact({ ...valid, email: 'ana@', project: 'torre-x' });
    expect(errors.email).toBeDefined();
    expect(errors.project).toBeDefined();
  });
  it('rejeita nome com números', () => {
    expect(validateContact({ ...valid, name: 'Ana 123' }).errors.name).toBeDefined();
  });
  it('normaliza e-mail para minúsculas', () => {
    expect(validateContact({ ...valid, email: ' ANA@Exemplo.COM ' }).data.email).toBe('ana@exemplo.com');
  });
});

describe('WhatsApp', () => {
  it('monta mensagem com o nome do empreendimento', () => {
    expect(buildWhatsAppMessage(valid)).toContain('Tenho interesse em: AURA Residence');
  });
  it('sem número configurado, usa wa.me sem destinatário', () => {
    expect(whatsAppUrl('Olá & até')).toBe('https://wa.me/?text=Ol%C3%A1%20%26%20at%C3%A9');
  });
  it('com número, usa apenas dígitos', () => {
    expect(whatsAppUrl('x', '+55 (00) 0000-0000')).toBe('https://wa.me/550000000000?text=x');
  });
});
