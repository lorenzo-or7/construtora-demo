import type { ImageKey } from '../components/Img';

/**
 * Empreendimentos FICTÍCIOS para demonstração comercial.
 * Nomes, localizações, status e textos são conceituais.
 * Não há metragens, plantas ou dados comerciais reais.
 */

export type EnvironmentKey = 'fachada' | 'social' | 'interiores' | 'paisagismo';

export interface Environment {
  key: EnvironmentKey;
  label: string;
  image: ImageKey;
  title: string;
  text: string;
}

export interface Project {
  slug: string;
  index: string;
  name: string;
  category: string;
  location: string;
  status: string;
  cover: ImageKey;
  coverAlt: string;
  tagline: string;
  concept: string;
  conceptLong: string[];
  features: { title: string; text: string }[];
  environments: Environment[];
  gallery: { image: ImageKey; alt: string; caption: string }[];
  locationNote: string;
}

export const projects: Project[] = [
  {
    slug: 'aura-residence',
    index: '01',
    name: 'AURA Residence',
    category: 'Residencial contemporâneo',
    location: 'Alameda das Figueiras, Cidade Exemplo',
    status: 'Em concepção',
    cover: 'aura-cover',
    coverAlt: 'Casa contemporânea com volume branco suspenso sobre base de pedra e madeira',
    tagline: 'Volumes leves sobre uma base de pedra.',
    concept:
      'Um volume branco paira sobre uma base de pedra e madeira. Embaixo, a vida social se abre para o jardim. Em cima, os quartos ganham silêncio e luz filtrada.',
    conceptLong: [
      'AURA parte de uma pergunta simples: como uma casa pode ser aberta e reservada ao mesmo tempo? A resposta é uma sobreposição. O térreo é permeável, com grandes vãos e continuidade entre sala, varanda e jardim. O pavimento superior é um volume preciso, quase sem aberturas para a rua, que se volta para o interior do lote.',
      'A materialidade organiza essa leitura. Pedra natural ancora a casa ao terreno, a madeira aquece os acessos e o branco liso define o volume suspenso. Cada material aparece onde tem uma função.',
    ],
    features: [
      { title: 'Térreo integrado', text: 'Sala, cozinha e varanda pensadas como um único espaço contínuo voltado ao jardim.' },
      { title: 'Volume suspenso', text: 'Pavimento íntimo protegido da rua, com aberturas orientadas para o pátio.' },
      { title: 'Base mineral', text: 'Pedra natural e madeira nos acessos, em contraste com o volume branco superior.' },
      { title: 'Luz controlada', text: 'Brises e beirais estudados para reduzir a insolação direta nas horas mais quentes.' },
    ],
    environments: [
      { key: 'fachada', label: 'Fachada', image: 'aura-cover', title: 'O volume que flutua', text: 'O pavimento superior avança sobre a base de pedra e cria uma sombra generosa sobre o acesso principal.' },
      { key: 'social', label: 'Área social', image: 'aura-social', title: 'Uma sala que continua no jardim', text: 'Esquadrias de piso a teto dissolvem o limite entre estar e varanda. A luz atravessa toda a profundidade da casa.' },
      { key: 'interiores', label: 'Interiores', image: 'aura-interior', title: 'Texturas de baixo contraste', text: 'Tecidos naturais, pedra clara e madeira escovada formam uma paleta calma, feita para durar.' },
      { key: 'paisagismo', label: 'Paisagismo', image: 'aura-landscape', title: 'Pátio de estar ao ar livre', text: 'Um caminho de pisantes conduz a um pergolado com banco contínuo, emoldurado por vegetação tropical.' },
    ],
    gallery: [
      { image: 'aura-cover', alt: 'Fachada com volume branco e base de pedra e madeira', caption: 'Fachada principal' },
      { image: 'aura-social', alt: 'Sala de estar ampla com sofá baixo e janelas de piso a teto', caption: 'Estar integrado' },
      { image: 'aura-interior', alt: 'Detalhe de sofá em tecido cinza e mesa de centro escura', caption: 'Detalhe do estar' },
      { image: 'aura-landscape', alt: 'Pátio com pergolado, banco contínuo e vegetação', caption: 'Pátio e paisagismo' },
      { image: 'aura-extra', alt: 'Volume branco de concreto entre árvores', caption: 'Estudo de volumetria' },
    ],
    locationNote: 'Bairro residencial arborizado, com ruas de baixo tráfego e acesso rápido a escolas e comércio de vizinhança.',
  },
  {
    slug: 'vertice-tower',
    index: '02',
    name: 'VÉRTICE Tower',
    category: 'Torre residencial urbana',
    location: 'Distrito Central, Cidade Exemplo',
    status: 'Em desenvolvimento',
    cover: 'vertice-cover',
    coverAlt: 'Torre residencial esbelta contra o céu ao entardecer',
    tagline: 'A cidade vista do alto, com calma.',
    concept:
      'Uma torre esbelta que devolve espaço à cidade. O térreo é praça, os andares são abrigos e o topo é um mirante para quem mora ali.',
    conceptLong: [
      'VÉRTICE nasce da vontade de construir alto sem dar as costas para a rua. A torre ocupa pouco do lote e libera o térreo para uma praça com vegetação, aberta ao bairro durante o dia.',
      'Nos pavimentos, varandas recuadas criam profundidade na fachada e protegem os interiores do sol da tarde. A estrutura fica aparente em pontos escolhidos e conta como o edifício foi feito.',
    ],
    features: [
      { title: 'Térreo como praça', text: 'Projeção reduzida da torre e área livre tratada com paisagismo e permanência.' },
      { title: 'Varandas recuadas', text: 'Profundidade na fachada que sombreia os ambientes e garante privacidade.' },
      { title: 'Mirante coletivo', text: 'Cobertura pensada como espaço de convivência e contemplação da cidade.' },
      { title: 'Mobilidade urbana', text: 'Implantação estudada para favorecer deslocamentos a pé e por transporte coletivo.' },
    ],
    environments: [
      { key: 'fachada', label: 'Fachada', image: 'vertice-facade', title: 'Ritmo de varandas', text: 'Planos de concreto claro avançam e recuam, desenhando sombras que mudam ao longo do dia.' },
      { key: 'social', label: 'Área social', image: 'vertice-social', title: 'Estar sereno no alto', text: 'Iluminação indireta e superfícies foscas tornam o estar um refúgio do movimento da cidade.' },
      { key: 'interiores', label: 'Interiores', image: 'vertice-interior', title: 'Penumbra e textura', text: 'Paredes escuras, madeira no piso e cortinas leves filtram a luz para os quartos.' },
      { key: 'paisagismo', label: 'Paisagismo', image: 'vertice-landscape', title: 'Jardim no térreo', text: 'Vegetação densa e um caminho iluminado conduzem da calçada ao acesso da torre.' },
    ],
    gallery: [
      { image: 'vertice-cover', alt: 'Torre residencial alta e esbelta ao entardecer', caption: 'Silhueta da torre' },
      { image: 'vertice-facade', alt: 'Fachada com varandas em balanço de concreto claro', caption: 'Ritmo de varandas' },
      { image: 'vertice-social', alt: 'Sala com sofá claro e iluminação indireta', caption: 'Estar' },
      { image: 'vertice-interior', alt: 'Quarto com paredes escuras e piso de madeira', caption: 'Suíte' },
      { image: 'vertice-landscape', alt: 'Edifício de concreto com jardim e vegetação pendente', caption: 'Acesso pelo jardim' },
      { image: 'vertice-extra', alt: 'Fachada de concreto branco com janelas em ritmo vertical', caption: 'Estudo de fachada' },
    ],
    locationNote: 'Quadra central com comércio, serviços e transporte coletivo a poucos minutos de caminhada.',
  },
  {
    slug: 'casa-noma',
    index: '03',
    name: 'CASA NOMA',
    category: 'Residências na natureza',
    location: 'Serra do Exemplo, Região Ilustrativa',
    status: 'Lançamento conceitual',
    cover: 'noma-cover',
    coverAlt: 'Casa em aço corten implantada em encosta com vegetação nativa',
    tagline: 'Casas que pedem licença à paisagem.',
    concept:
      'Pequenas residências implantadas na encosta, com o mínimo de movimento de terra. A vegetação nativa permanece e as casas se acomodam entre ela.',
    conceptLong: [
      'NOMA é um conjunto de residências para quem quer viver perto da natureza sem dominá-la. Cada casa ocupa um ponto da encosta escolhido pela vista e pela insolação, preservando a vegetação existente entre elas.',
      'Madeira, aço patinável e vidro compõem uma paleta que envelhece bem e conversa com a paisagem. As coberturas protegem do sol e da chuva e os grandes vãos trazem a mata para dentro.',
    ],
    features: [
      { title: 'Implantação leve', text: 'Casas acomodadas ao relevo, com intervenção mínima no terreno natural.' },
      { title: 'Vegetação preservada', text: 'Espécies nativas mantidas entre as unidades, formando corredores verdes.' },
      { title: 'Materiais que envelhecem bem', text: 'Madeira, aço patinável e pedra local escolhidos pela durabilidade.' },
      { title: 'Conforto passivo', text: 'Orientação solar e ventilação cruzada consideradas desde o primeiro estudo.' },
    ],
    environments: [
      { key: 'fachada', label: 'Fachada', image: 'noma-facade', title: 'Telhados entre a mata', text: 'Coberturas de madeira e grandes planos de vidro se abrem para a floresta ao fundo.' },
      { key: 'social', label: 'Área social', image: 'noma-social', title: 'Cozinha como centro', text: 'Cozinha aberta, mezanino e escada leve organizam a vida da casa em torno da mesa.' },
      { key: 'interiores', label: 'Interiores', image: 'noma-interior', title: 'Madeira e luz', text: 'Paredes revestidas em madeira, pé-direito duplo e iluminação pontual criam acolhimento.' },
      { key: 'paisagismo', label: 'Paisagismo', image: 'noma-landscape', title: 'Gramíneas ao entardecer', text: 'Campos de gramíneas nativas se estendem até a casa e mudam de cor com as estações.' },
    ],
    gallery: [
      { image: 'noma-cover', alt: 'Casa de aço patinável em encosta com agave em primeiro plano', caption: 'Implantação na encosta' },
      { image: 'noma-facade', alt: 'Edifício com telhado de madeira e paredes de vidro diante da floresta', caption: 'Pavilhão principal' },
      { image: 'noma-social', alt: 'Cozinha aberta com mezanino e escada de madeira', caption: 'Cozinha e mezanino' },
      { image: 'noma-interior', alt: 'Interior com paredes de madeira e escada metálica', caption: 'Pé-direito duplo' },
      { image: 'noma-landscape', alt: 'Casa iluminada ao entardecer cercada por gramíneas', caption: 'Paisagem ao entardecer' },
      { image: 'noma-extra', alt: 'Varanda coberta com vegetação e revestimento escuro', caption: 'Varanda' },
    ],
    locationNote: 'Região serrana ilustrativa, a cerca de duas horas de um grande centro urbano fictício.',
  },
];

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug);
