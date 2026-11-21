import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { Symbol, Wordmark } from './Logo';
import { NAV_LINKS } from './Nav';
import s from './Footer.module.css';

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div className={s.brand}>
          <Wordmark className={s.word} title="ATRIUM" />
          <p className={s.sub}>Engenharia & Incorporação</p>
        </div>

        <nav className={s.cols} aria-label="Rodapé">
          <div>
            <h2 className={s.colTitle}>Navegação</h2>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <Link to={{ pathname: '/', hash: `#${l.id}` }} className="link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={s.colTitle}>Empreendimentos</h2>
            <ul>
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link to={`/empreendimentos/${p.slug}`} className="link-underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={s.colTitle}>Institucional</h2>
            <ul>
              <li>
                <Link to="/privacidade" className="link-underline">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/creditos" className="link-underline">
                  Créditos e licenças
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className={s.disclaimer}>
          <Symbol className={s.symbol} />
          <p>
            Protótipo conceitual. ATRIUM é uma marca fictícia criada para demonstração comercial. Empreendimentos, localizações, status,
            indicadores e textos são ilustrativos e não representam projetos, empresas ou ofertas reais.
          </p>
        </div>

        <div className={s.bottom}>
          <p>© {new Date().getFullYear()} ATRIUM. Conteúdo demonstrativo.</p>
          <a className={s.or7} href="https://or7.dev" target="_blank" rel="noopener noreferrer">
            <span className={s.or7Label}>Experiência digital por</span>
            <span className={s.or7Mark}>Or7.dev</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
