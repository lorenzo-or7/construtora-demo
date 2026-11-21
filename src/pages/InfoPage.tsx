import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RevealLines } from '../components/Reveal';
import meta from '../data/image-meta.json';
import s from './InfoPage.module.css';

type Kind = 'privacidade' | 'creditos' | '404';

const TITLES: Record<Kind, string[]> = {
  privacidade: ['Privacidade'],
  creditos: ['Créditos', 'e licenças'],
  '404': ['Página não', 'encontrada'],
};

export default function InfoPage({ kind }: { kind: Kind }) {
  useEffect(() => {
    document.title = `${TITLES[kind].join(' ')} | ATRIUM, protótipo conceitual`;
  }, [kind]);

  return (
    <article className={`container ${s.page}`} aria-labelledby="info-title">
      <RevealLines as="h1" id="info-title" className={s.title} lines={TITLES[kind]} immediate />
      <div className={s.body}>
        {kind === 'privacidade' && (
          <>
            <p>
              Este site é um protótipo conceitual desenvolvido pela Or7.dev para demonstração comercial. ATRIUM é uma marca fictícia.
            </p>
            <h2>Dados do formulário</h2>
            <p>
              O formulário de interesse funciona apenas no seu navegador. Os dados digitados não são armazenados nem enviados a servidores.
              Ao escolher “Abrir no WhatsApp”, o texto preparado é passado ao WhatsApp, onde você decide se envia ou não.
            </p>
            <h2>Preferências locais</h2>
            <p>A única informação guardada no seu dispositivo é a preferência de tema claro ou escuro, para manter sua escolha entre visitas.</p>
            <h2>Cookies e rastreamento</h2>
            <p>Este protótipo não utiliza cookies de rastreamento, pixels de publicidade ou ferramentas de análise.</p>
          </>
        )}

        {kind === 'creditos' && (
          <>
            <p>
              Marca, textos, empreendimentos e indicadores são fictícios e foram criados para demonstração. As fotografias são de
              autores da Unsplash, publicadas sob a{' '}
              <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="link-underline">
                Licença Unsplash
              </a>
              , que permite uso gratuito. Elas ilustram conceitos e não retratam empreendimentos da ATRIUM.
            </p>
            <h2>Fotografias utilizadas</h2>
            <ul className={s.credits}>
              {Object.entries(meta).map(([key, m]) => (
                <li key={key}>
                  <span>{key}</span>
                  <a href={m.source} target="_blank" rel="noopener noreferrer" className="link-underline">
                    Arquivo original na Unsplash
                  </a>
                </li>
              ))}
            </ul>
            <h2>Tipografia e ícones</h2>
            <p>Instrument Serif e Manrope (SIL Open Font License). Ícones Lucide (licença ISC).</p>
            <h2>Desenvolvimento</h2>
            <p>
              Experiência digital por{' '}
              <a href="https://or7.dev" target="_blank" rel="noopener noreferrer" className="link-underline">
                Or7.dev
              </a>
              .
            </p>
          </>
        )}

        {kind === '404' && <p>O endereço acessado não existe neste protótipo. Volte ao início para conhecer os empreendimentos.</p>}

        <Link to="/" className="btn">
          Voltar ao início
        </Link>
      </div>
    </article>
  );
}
