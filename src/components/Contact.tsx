import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Copy, MessageCircle, Send } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  buildWhatsAppMessage,
  LIMITS,
  PROJECT_OPTIONS,
  validateContact,
  WHATSAPP_NUMBER,
  whatsAppUrl,
  type ContactErrors,
  type ContactInput,
} from '../lib/contact';
import { EASE_OUT, FadeIn, RevealLines } from './Reveal';
import s from './Contact.module.css';

const EMPTY: ContactInput = { project: '', name: '', email: '', message: '' };
const ORDER: (keyof ContactInput)[] = ['project', 'name', 'email', 'message'];

export function Contact() {
  const [params] = useSearchParams();
  const pre = params.get('empreendimento');
  const [values, setValues] = useState<ContactInput>(() => ({
    ...EMPTY,
    project: PROJECT_OPTIONS.some((o) => o.value === pre) ? (pre as string) : '',
  }));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [prepared, setPrepared] = useState<{ text: string; url: string } | null>(null);
  const [copy, setCopy] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [summary, setSummary] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (pre && PROJECT_OPTIONS.some((o) => o.value === pre)) setValues((v) => ({ ...v, project: pre }));
  }, [pre]);

  const id = (k: string) => `${uid}-${k}`;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const k = e.target.name as keyof ContactInput;
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    setPrepared(null);
    if (touched[k]) setErrors((prev) => ({ ...prev, [k]: validateContact(next).errors[k] }));
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const k = e.target.name as keyof ContactInput;
    setTouched((t) => ({ ...t, [k]: true }));
    if (values[k]) setErrors((prev) => ({ ...prev, [k]: validateContact(values).errors[k] }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { data, errors: errs } = validateContact(values);
    setErrors(errs);
    setTouched({ project: true, name: true, email: true, message: true });
    const invalid = ORDER.filter((k) => errs[k]);
    if (invalid.length) {
      setPrepared(null);
      setSummary(`${invalid.length === 1 ? 'Um campo precisa' : `${invalid.length} campos precisam`} de revisão.`);
      formRef.current?.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus();
      return;
    }
    setSummary('');
    setValues(data);
    const text = buildWhatsAppMessage(data);
    setPrepared({ text, url: whatsAppUrl(text) });
    setCopy('idle');
    window.setTimeout(() => resultRef.current?.focus(), 80);
  };

  const onCopy = async () => {
    if (!prepared) return;
    try {
      await navigator.clipboard.writeText(prepared.text);
      setCopy('ok');
    } catch {
      setCopy('fail');
    }
  };

  const field = (k: keyof ContactInput) => ({
    id: id(k),
    name: k,
    value: values[k],
    onChange,
    onBlur,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? id(`${k}-err`) : k === 'message' ? id('message-hint') : undefined,
  });

  const renderErr = (k: keyof ContactInput) => (
    <AnimatePresence initial={false}>
      {errors[k] && (
        <motion.p
          id={id(`${k}-err`)}
          className={s.error}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          {errors[k]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <section id="contato" className={s.section} aria-labelledby="contact-title">
      <div className={`container ${s.grid}`}>
        <div className={s.side}>
          <RevealLines id="contact-title" className={s.title} lines={['O próximo', 'capítulo', 'começa aqui.']} />
          <FadeIn delay={0.1}>
            <p className={s.lead}>
              Conte o que você procura. Preparamos uma mensagem com seus dados para você enviar à equipe comercial pelo WhatsApp.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className={s.direct}>
            <a
              className="btn btn--light"
              href={whatsAppUrl('Olá, equipe ATRIUM. Gostaria de conversar sobre os empreendimentos.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden />
              Conversar pelo WhatsApp
            </a>
            <p className={s.directNote}>
              {WHATSAPP_NUMBER
                ? 'Abre uma conversa com a equipe comercial em uma nova aba.'
                : 'Protótipo sem número comercial configurado: o WhatsApp abrirá para você escolher o contato.'}
            </p>
          </FadeIn>
        </div>

        <div className={s.formWrap}>
          <form ref={formRef} className={s.form} noValidate onSubmit={onSubmit} aria-describedby={id('form-note')}>
            <p id={id('form-note')} className={s.formNote}>
              Formulário demonstrativo. Nenhum dado é armazenado ou enviado a servidores.
            </p>

            <div className={s.field}>
              <label htmlFor={id('project')}>Empreendimento de interesse</label>
              <select {...field('project')} required>
                <option value="" disabled>
                  Selecione uma opção
                </option>
                {PROJECT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {renderErr('project')}
            </div>

            <div className={s.row}>
              <div className={s.field}>
                <label htmlFor={id('name')}>Nome</label>
                <input {...field('name')} type="text" autoComplete="name" maxLength={LIMITS.name} required />
                {renderErr('name')}
              </div>
              <div className={s.field}>
                <label htmlFor={id('email')}>E-mail</label>
                <input {...field('email')} type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} required />
                {renderErr('email')}
              </div>
            </div>

            <div className={s.field}>
              <div className={s.labelRow}>
                <label htmlFor={id('message')}>Mensagem</label>
                <span id={id('message-hint')} className={s.count} aria-live="off">
                  {values.message.length}/{LIMITS.message}
                </span>
              </div>
              <textarea {...field('message')} rows={5} maxLength={LIMITS.message} required />
              {renderErr('message')}
            </div>

            <div className={s.submitRow}>
              <button type="submit" className="btn">
                Preparar mensagem
                <Send aria-hidden />
              </button>
              <p role="status" className={s.summary}>
                {summary}
              </p>
            </div>
          </form>

          <AnimatePresence>
            {prepared && (
              <motion.div
                ref={resultRef}
                tabIndex={-1}
                className={s.result}
                role="region"
                aria-label="Mensagem preparada"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE_OUT }}
              >
                <p className={s.resultTitle}>Mensagem pronta. Ainda não foi enviada.</p>
                <p className={s.resultText}>Revise o texto abaixo e envie pelo WhatsApp, ou copie para usar em outro canal.</p>
                <pre className={s.preview}>{prepared.text}</pre>
                <div className={s.resultActions}>
                  <a className="btn" href={prepared.url} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden />
                    Abrir no WhatsApp
                  </a>
                  <button type="button" className="btn btn--ghost" onClick={onCopy}>
                    {copy === 'ok' ? <Check aria-hidden /> : <Copy aria-hidden />}
                    {copy === 'ok' ? 'Texto copiado' : 'Copiar texto'}
                  </button>
                </div>
                <p role="status" className={s.copyStatus}>
                  {copy === 'fail' ? 'Não foi possível copiar automaticamente. Selecione o texto acima e copie manualmente.' : ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
