import { Locale } from '@/lib/i18n/config';

export interface CookiesTranslations {
  backToDownloader: string;
  title: string;
  lastUpdated: string;
  intro: string;
  sec1Title: string;
  cookieTechTitle: string;
  cookieTechDesc: string;
  cookiePrefTitle: string;
  cookiePrefDesc: string;
  cookieHistoryTitle: string;
  cookieHistoryDesc: string;
  cookieAdsTitle: string;
  cookieAdsDesc: string;
  sec2Title: string;
  sec2Desc: string;
  chromeDesc: string;
  firefoxDesc: string;
  safariDesc: string;
  edgeDesc: string;
  contactTitle: string;
  contactDesc: string;
}

export interface PrivacyTranslations {
  backToDownloader: string;
  title: string;
  lastUpdated: string;
  guaranteeTitle: string;
  guaranteeDesc: string;
  sec1Title: string;
  sec1Sub1Title: string;
  noAccountsTitle: string;
  noAccountsDesc: string;
  noStorageTitle: string;
  noStorageDesc: string;
  noSellingTitle: string;
  noSellingDesc: string;
  localHistoryTitle: string;
  localHistoryDesc: string;
  sec1Sub2Title: string;
  sec1Sub2Desc: string;
  urlPublicTitle: string;
  urlPublicDesc: string;
  userAgentTitle: string;
  userAgentDesc: string;
  ipAnonTitle: string;
  ipAnonDesc: string;
  sec2Title: string;
  sec2Desc: string;
  dartCookieTitle: string;
  dartCookieItem1: string;
  dartCookieItem2: string;
  dartCookieItem3: string;
  dartCookieLink1: string;
  dartCookieItem4: string;
  dartCookieLink2: string;
  sec3Title: string;
  thCategory: string;
  thPurpose: string;
  thTypeDuration: string;
  row1Cat: string;
  row1Pur: string;
  row1Dur: string;
  row2Cat: string;
  row2Pur: string;
  row2Dur: string;
  row3Cat: string;
  row3Pur: string;
  row3Dur: string;
  row4Cat: string;
  row4Pur: string;
  row4Dur: string;
  sec4Title: string;
  sec4Desc: string;
  rightAccessTitle: string;
  rightAccessDesc: string;
  rightDeleteTitle: string;
  rightDeleteDesc: string;
  rightObjectTitle: string;
  rightObjectDesc: string;
  rightPurgeTitle: string;
  rightPurgeDesc: string;
  sec5Title: string;
  sec5Desc: string;
  contactButton: string;
  contactFormButton: string;
  responseTime: string;
}

export interface TermsTranslations {
  backToDownloader: string;
  title: string;
  lastUpdated: string;
  importantNoticeTitle: string;
  importantNoticeDesc: string;
  sec1Title: string;
  sec1Desc: string;
  sec2Title: string;
  sec2Desc: string;
  itemOwnContentTitle: string;
  itemOwnContentDesc: string;
  itemPrivateUseTitle: string;
  itemPrivateUseDesc: string;
  itemResearchTitle: string;
  itemResearchDesc: string;
  itemPublicDomainTitle: string;
  itemPublicDomainDesc: string;
  sec3Title: string;
  sec3Desc: string;
  prohibited1: string;
  prohibited2: string;
  prohibited3: string;
  prohibited4: string;
  sec4Title: string;
  sec4Desc: string;
  sec5Title: string;
  sec5Desc: string;
  sec6Title: string;
  sec6Desc: string;
  helpDeskButton: string;
}

export interface CopyrightTranslations {
  backToDownloader: string;
  title: string;
  lastUpdated: string;
  sec1Title: string;
  sec1Desc: string;
  sec2Title: string;
  sec2Desc: string;
  fairUseItem1: string;
  fairUseItem2: string;
  fairUseItem3: string;
  fairUseItem4: string;
  sec3Title: string;
  sec3Desc: string;
  dmcaItem1: string;
  dmcaItem2: string;
  dmcaItem3: string;
  dmcaItem4: string;
  dmcaItem5: string;
  dmcaButtonText: string;
}

export const cookiesTranslations: Record<Locale, CookiesTranslations> = {
  es: {
    backToDownloader: 'Volver al Descargador',
    title: 'Política de Cookies',
    lastUpdated: 'Última actualización: 1 de Enero de 2026 • Información de Almacenamiento Local',
    intro: 'En FTY Downloader Pro, utilizamos cookies y tecnologías de almacenamiento local en el navegador (como LocalStorage) para que disfrutes de una navegación rápida, segura y adaptada a tus preferencias. Esta política explica qué tecnologías usamos, para qué sirven y cómo puedes configurarlas o desactivarlas.',
    sec1Title: '1. ¿Qué tipos de cookies y almacenamiento utilizamos?',
    cookieTechTitle: 'Cookies Técnicas Esenciales',
    cookieTechDesc: 'Requeridas para la navegación, seguridad de peticiones API y entrega del reproductor de video.',
    cookiePrefTitle: 'Preferencias de Idioma y Tema',
    cookiePrefDesc: 'Permiten que la web recuerde si prefieres Modo Oscuro o Claro y tu idioma (ES, EN, PT) en cada visita.',
    cookieHistoryTitle: 'Historial Local Privado',
    cookieHistoryDesc: 'Almacena el registro de tus descargas únicamente en la memoria local de tu dispositivo, sin enviarlo a la nube.',
    cookieAdsTitle: 'Publicidad (Google AdSense)',
    cookieAdsDesc: 'Google utiliza cookies para medir impresiones y presentar anuncios contextuales de forma segura.',
    sec2Title: '2. ¿Cómo controlar o desactivar las cookies?',
    sec2Desc: 'Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones de tu navegador web:',
    chromeDesc: 'Google Chrome: Configuración > Privacidad y seguridad > Cookies de terceros.',
    firefoxDesc: 'Mozilla Firefox: Opciones > Privacidad y seguridad > Cookies y datos del sitio.',
    safariDesc: 'Apple Safari: Preferencias > Privacidad.',
    edgeDesc: 'Microsoft Edge: Configuración > Cookies y permisos del sitio.',
    contactTitle: '¿Preguntas sobre nuestra política de cookies?',
    contactDesc: 'Puedes escribirnos directamente a:'
  },
  en: {
    backToDownloader: 'Back to Downloader',
    title: 'Cookie Policy',
    lastUpdated: 'Last updated: January 1, 2026 • Local Storage & Cookies Information',
    intro: 'At FTY Downloader Pro, we use cookies and browser local storage technologies (such as LocalStorage) to ensure you enjoy a fast, safe, and personalized browsing experience. This policy explains which technologies we utilize, their purposes, and how you can manage or disable them.',
    sec1Title: '1. What types of cookies and storage do we use?',
    cookieTechTitle: 'Essential Technical Cookies',
    cookieTechDesc: 'Required for core website navigation, API request security, and delivery of the integrated video player.',
    cookiePrefTitle: 'Language & Theme Preferences',
    cookiePrefDesc: 'Allows the platform to remember your preferred Theme (Dark or Light Mode) and Language (ES, EN, PT) on every visit.',
    cookieHistoryTitle: 'Private Local History',
    cookieHistoryDesc: 'Stores your download history exclusively on your device\'s local storage, never uploading it to external cloud servers.',
    cookieAdsTitle: 'Advertising (Google AdSense)',
    cookieAdsDesc: 'Google uses cookies to measure ad impressions and serve contextual advertisements safely and compliantly.',
    sec2Title: '2. How to control or disable cookies?',
    sec2Desc: 'You can allow, block, or delete cookies installed on your computer or mobile device through your browser settings:',
    chromeDesc: 'Google Chrome: Settings > Privacy and security > Third-party cookies.',
    firefoxDesc: 'Mozilla Firefox: Preferences > Privacy & Security > Cookies and Site Data.',
    safariDesc: 'Apple Safari: Preferences > Privacy.',
    edgeDesc: 'Microsoft Edge: Settings > Cookies and site permissions.',
    contactTitle: 'Questions regarding our cookie policy?',
    contactDesc: 'You can reach out directly to:'
  },
  pt: {
    backToDownloader: 'Voltar ao Baixador',
    title: 'Política de Cookies',
    lastUpdated: 'Última atualização: 1 de Janeiro de 2026 • Informações sobre Armazenamento Local',
    intro: 'No FTY Downloader Pro, utilizamos cookies e tecnologias de armazenamento local no navegador (como LocalStorage) para garantir uma navegação rápida, segura e adaptada às suas preferências. Esta política detalha quais tecnologias utilizamos, suas finalidades e como você pode gerenciá-las.',
    sec1Title: '1. Quais tipos de cookies e armazenamento utilizamos?',
    cookieTechTitle: 'Cookies Técnicos Essenciais',
    cookieTechDesc: 'Necessários para navegação, segurança das chamadas de API e execução do reprodutor de vídeo integrado.',
    cookiePrefTitle: 'Preferências de Idioma e Tema',
    cookiePrefDesc: 'Permitem que o site lembre sua escolha de Modo Escuro ou Claro e seu idioma (ES, EN, PT) em cada acesso.',
    cookieHistoryTitle: 'Histórico Local Privado',
    cookieHistoryDesc: 'Armazena seus registros de download exclusivamente na memória local do seu aparelho, sem envio para servidores externos.',
    cookieAdsTitle: 'Publicidade (Google AdSense)',
    cookieAdsDesc: 'O Google utiliza cookies para medir impressões e veicular anúncios contextuais de acordo com as normas de privacidade.',
    sec2Title: '2. Como controlar ou desativar cookies?',
    sec2Desc: 'Você pode permitir, bloquear ou remover os cookies instalados no seu computador ou celular através do seu navegador:',
    chromeDesc: 'Google Chrome: Configurações > Privacidade e segurança > Cookies de terceiros.',
    firefoxDesc: 'Mozilla Firefox: Configurações > Privacidade e Segurança > Cookies e dados de sites.',
    safariDesc: 'Apple Safari: Preferências > Privacidade.',
    edgeDesc: 'Microsoft Edge: Configurações > Cookies e permissões do site.',
    contactTitle: 'Dúvidas sobre nossa política de cookies?',
    contactDesc: 'Você pode entrar em contato diretamente pelo e-mail:'
  }
};

export const privacyTranslations: Record<Locale, PrivacyTranslations> = {
  es: {
    backToDownloader: 'Volver al Descargador',
    title: 'Política de Privacidad',
    lastUpdated: 'Última actualización: 1 de Enero de 2026 • Cumplimiento RGPD, CCPA y Google AdSense',
    guaranteeTitle: 'Tu privacidad está garantizada al 100%:',
    guaranteeDesc: 'En {siteTitle}, la privacidad es un pilar fundamental. Nuestra herramienta funciona de forma totalmente libre, sin requerir registro de cuenta, sin almacenar videos ajenos en nuestros servidores y sin recopilar datos personales identificables.',
    sec1Title: '1. Información que Recopilamos y Procesamos',
    sec1Sub1Title: '1.1 Lo que NUNCA recopilamos',
    noAccountsTitle: 'Sin Cuentas:',
    noAccountsDesc: 'No solicitamos nombre, correo, contraseñas ni registro de perfiles.',
    noStorageTitle: 'Sin Almacenamiento Permanente:',
    noStorageDesc: 'Los videos se procesan al vuelo y se transmiten directamente al usuario.',
    noSellingTitle: 'No Vendemos Datos:',
    noSellingDesc: 'Jamás comercializamos información de usuarios a agencias o intermediarios.',
    localHistoryTitle: 'Historial en Dispositivo:',
    localHistoryDesc: 'Las descargas guardadas viven únicamente en tu navegador o teléfono.',
    sec1Sub2Title: '1.2 Información técnica procesada en tiempo real',
    sec1Sub2Desc: 'Para garantizar que el convertidor de video y el proxy de descarga funcionen adecuadamente en todas las plataformas (Facebook, TikTok, YouTube, Instagram, Threads, Twitter/𝕏 y WhatsApp), nuestro sistema procesa de forma transitoria:',
    urlPublicTitle: 'URL pública solicitada:',
    urlPublicDesc: 'El enlace público pegado por el usuario se utiliza exclusivamente para consultar los metadatos y enlaces de streaming del video en la red social de origen.',
    userAgentTitle: 'Datos técnicos del agente de usuario (User-Agent):',
    userAgentDesc: 'Tipo de navegador y sistema operativo (Android, iOS, Windows, Mac) para servir el formato de archivo y reproductor óptimo.',
    ipAnonTitle: 'Dirección IP anonimizada:',
    ipAnonDesc: 'Requerida por motivos de seguridad técnica, prevención de abusos por bots (rate limiting) y balanceo de carga.',
    sec2Title: '2. Google AdSense, AdMob y Cookies Publicitarias',
    sec2Desc: 'Para mantener nuestra plataforma 100% gratuita para creadores y usuarios de todo el mundo, mostramos publicidad a través de Google AdSense y Google AdMob.',
    dartCookieTitle: 'Políticas sobre la cookie de DART de Google:',
    dartCookieItem1: 'Google, como proveedor asociado externo, utiliza cookies para publicar anuncios en nuestro sitio web.',
    dartCookieItem2: 'El uso de cookies de publicidad permite a Google y a sus socios presentar anuncios basados en las visitas previas a este o a otros sitios de Internet.',
    dartCookieItem3: 'Puedes inhabilitar en cualquier momento la publicidad personalizada accediendo a la',
    dartCookieLink1: 'Configuración de Anuncios de Google',
    dartCookieItem4: 'Asimismo, puedes informarte sobre cómo gestionar cookies publicitarias globales visitando',
    dartCookieLink2: 'www.aboutads.info',
    sec3Title: '3. Tecnologías de Almacenamiento y Cookies Utilizadas',
    thCategory: 'Categoría',
    thPurpose: 'Propósito',
    thTypeDuration: 'Tipo / Duración',
    row1Cat: 'Técnicas / Esenciales',
    row1Pur: 'Garantizan la entrega fluida de la interfaz y la comunicación con las APIs de descarga.',
    row1Dur: 'Sesión técnica',
    row2Cat: 'Preferencias de Usuario',
    row2Pur: 'Recuerdan tu idioma preferido (ES, EN, PT) y la activación del Modo Oscuro / Claro.',
    row2Dur: 'LocalStorage (1 año)',
    row3Cat: 'Historial de Descargas',
    row3Pur: 'Permite visualizar tus videos descargados y reproducirlos sin conexión en el teléfono.',
    row3Dur: 'Almacenamiento Local Privado',
    row4Cat: 'Publicitarias (Google AdSense)',
    row4Pur: 'Medición de impresiones y prevención de fraudes publicitarios conforme a políticas de Google.',
    row4Dur: 'Variable por proveedor',
    sec4Title: '4. Tus Derechos de Protección de Datos (RGPD y CCPA)',
    sec4Desc: 'De conformidad con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley de Privacidad del Consumidor de California (CCPA), cuentas con los siguientes derechos garantizados:',
    rightAccessTitle: 'Derecho de Acceso y Consulta',
    rightAccessDesc: 'Solicitar confirmación de si tus datos están siendo procesados.',
    rightDeleteTitle: 'Derecho de Supresión (Olvido)',
    rightDeleteDesc: 'Solicitar la eliminación de cualquier dato residual en nuestros servidores.',
    rightObjectTitle: 'Derecho de Oposición',
    rightObjectDesc: 'Rechazar el uso de cookies publicitarias y tecnologías de seguimiento.',
    rightPurgeTitle: 'Limpieza Local Inmediata',
    rightPurgeDesc: 'Puedes borrar todo tu historial con un solo clic desde el modal de Historial.',
    sec5Title: '5. Contacto y Consultas sobre Privacidad',
    sec5Desc: 'Si tienes dudas o inquietudes sobre esta Política de Privacidad o requieres asistencia técnica, puedes comunicarte con nuestro equipo oficial:',
    contactButton: 'Enviar Correo',
    contactFormButton: 'Formulario de Contacto',
    responseTime: 'Plazo de respuesta estimado: 24 a 48 horas hábiles.'
  },
  en: {
    backToDownloader: 'Back to Downloader',
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 1, 2026 • GDPR, CCPA & Google AdSense Compliance',
    guaranteeTitle: 'Your privacy is 100% guaranteed:',
    guaranteeDesc: 'At {siteTitle}, privacy is an uncompromised core principle. Our platform operates 100% free of charge, requiring no user account registration, storing no third-party media on our servers, and collecting zero personally identifiable information.',
    sec1Title: '1. Information We Collect and Process',
    sec1Sub1Title: '1.1 What We NEVER Collect',
    noAccountsTitle: 'No Account Required:',
    noAccountsDesc: 'We do not ask for names, email addresses, passwords, or profile registrations.',
    noStorageTitle: 'No Permanent Media Storage:',
    noStorageDesc: 'All video media is processed on the fly and streamed directly to your client device.',
    noSellingTitle: 'No Data Brokerage:',
    noSellingDesc: 'We never monetize, sell, or license user information to third-party data brokers.',
    localHistoryTitle: 'Device-Only Download Log:',
    localHistoryDesc: 'Saved downloads live exclusively inside your browser or device filesystem.',
    sec1Sub2Title: '1.2 Technical Data Processed in Real Time',
    sec1Sub2Desc: 'To ensure the format converter and download proxy perform reliably across Facebook, TikTok, YouTube, Instagram, Threads, Twitter/𝕏, and WhatsApp, our systems process transiently:',
    urlPublicTitle: 'Requested Public URL:',
    urlPublicDesc: 'The public link submitted by the user is used solely to query stream metadata from the origin platform.',
    userAgentTitle: 'User-Agent Technical Specs:',
    userAgentDesc: 'Browser engine and operating system (Android, iOS, Windows, macOS) to deliver optimal video containers.',
    ipAnonTitle: 'Anonymized IP Address:',
    ipAnonDesc: 'Processed strictly for network routing, bot abuse prevention (rate limiting), and DDoS protection.',
    sec2Title: '2. Google AdSense, AdMob & Advertising Cookies',
    sec2Desc: 'To maintain free access for millions of global users, we display contextual advertisements powered by Google AdSense and Google AdMob.',
    dartCookieTitle: 'Google DART Cookie Guidelines:',
    dartCookieItem1: 'Google, as a third-party vendor, uses cookies to serve ads on our site.',
    dartCookieItem2: 'Google\'s use of advertising cookies enables it and its partners to serve ads based on prior visits to our site or other internet destinations.',
    dartCookieItem3: 'You may opt out of personalized advertising at any time by visiting',
    dartCookieLink1: 'Google Ads Settings',
    dartCookieItem4: 'You can also learn how to manage global advertising cookies by visiting',
    dartCookieLink2: 'www.aboutads.info',
    sec3Title: '3. Storage Technologies & Cookies Deployed',
    thCategory: 'Category',
    thPurpose: 'Purpose',
    thTypeDuration: 'Type / Expiration',
    row1Cat: 'Technical / Essential',
    row1Pur: 'Maintains fluid UI delivery and secure communication with download conversion endpoints.',
    row1Dur: 'Session storage',
    row2Cat: 'User Preferences',
    row2Pur: 'Remembers your chosen language (ES, EN, PT) and Theme Mode (Dark/Light).',
    row2Dur: 'LocalStorage (1 year)',
    row3Cat: 'Download History',
    row3Pur: 'Allows you to review and replay downloaded videos offline inside the browser/app.',
    row3Dur: 'Private Local Storage',
    row4Cat: 'Advertising (Google AdSense)',
    row4Pur: 'Impression verification and ad-fraud prevention according to Google Ad policies.',
    row4Dur: 'Variable by vendor',
    sec4Title: '4. Your Data Protection Rights (GDPR & CCPA)',
    sec4Desc: 'Under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you retain the following guaranteed rights:',
    rightAccessTitle: 'Right to Access & Information',
    rightAccessDesc: 'Request confirmation of whether your data is being processed.',
    rightDeleteTitle: 'Right to Erasure (Forgotten)',
    rightDeleteDesc: 'Request immediate deletion of any residual technical log data.',
    rightObjectTitle: 'Right to Object',
    rightObjectDesc: 'Opt out of advertising cookies and analytics tracking technologies.',
    rightPurgeTitle: 'Instant Local Purge',
    rightPurgeDesc: 'You can wipe your entire history at any moment with 1 click from the History modal.',
    sec5Title: '5. Privacy Inquiries & Official Support',
    sec5Desc: 'If you have questions regarding this Privacy Policy or require technical assistance, our support desk is readily available:',
    contactButton: 'Send Email',
    contactFormButton: 'Contact Form',
    responseTime: 'Estimated response window: 24 to 48 business hours.'
  },
  pt: {
    backToDownloader: 'Voltar ao Baixador',
    title: 'Política de Privacidade',
    lastUpdated: 'Última atualização: 1 de Janeiro de 2026 • Conformidade com RGPD, CCPA e Google AdSense',
    guaranteeTitle: 'Sua privacidade é 100% garantida:',
    guaranteeDesc: 'No {siteTitle}, a privacidade é um pilar fundamental e inegociável. Nossa plataforma funciona de forma totalmente gratuita, sem exigir cadastro de contas, sem hospedar mídias de terceiros em nossos servidores e sem coletar informações de identificação pessoal.',
    sec1Title: '1. Informações que Coletamos e Processamos',
    sec1Sub1Title: '1.1 O que NUNCA coletamos',
    noAccountsTitle: 'Sem Cadastro Obrigatório:',
    noAccountsDesc: 'Não solicitamos nomes, e-mails, senhas nem criação de perfis.',
    noStorageTitle: 'Sem Armazenamento Permanente:',
    noStorageDesc: 'Os vídeos são processados em tempo real e transmitidos diretamente para o seu aparelho.',
    noSellingTitle: 'Não Comercializamos Dados:',
    noSellingDesc: 'Jamais vendemos ou repassamos informações de usuários a intermediários ou agências.',
    localHistoryTitle: 'Histórico Exclusivo no Aparelho:',
    localHistoryDesc: 'Seus registros de download residem estritamente no seu navegador ou telefone celular.',
    sec1Sub2Title: '1.2 Informações técnicas processadas em tempo real',
    sec1Sub2Desc: 'Para assegurar que o conversor e o proxy de download funcionem perfeitamente no Facebook, TikTok, YouTube, Instagram, Threads, Twitter/𝕏 e WhatsApp, nossos sistemas processam temporariamente:',
    urlPublicTitle: 'URL Pública Solicitada:',
    urlPublicDesc: 'O link público colado pelo usuário é utilizado unicamente para consultar os links de streaming da rede social de origem.',
    userAgentTitle: 'Especificações Técnicas (User-Agent):',
    userAgentDesc: 'Tipo de navegador e sistema operacional (Android, iOS, Windows, Mac) para entregar o arquivo no formato ideal.',
    ipAnonTitle: 'Endereço IP Anonimizado:',
    ipAnonDesc: 'Processado exclusivamente para segurança técnica, prevenção de ataques de robôs e balanceamento de tráfego.',
    sec2Title: '2. Google AdSense, AdMob e Cookies Publicitários',
    sec2Desc: 'Para manter nossa ferramenta 100% gratuita para milhões de criadores e usuários, veiculamos anúncios através do Google AdSense e Google AdMob.',
    dartCookieTitle: 'Diretrizes sobre o cookie DART do Google:',
    dartCookieItem1: 'O Google, como fornecedor terceiro, utiliza cookies para veicular anúncios em nosso site.',
    dartCookieItem2: 'O uso de cookies de publicidade permite ao Google e a seus parceiros veicular anúncios com base em visitas anteriores a este ou a outros sites.',
    dartCookieItem3: 'Você pode desativar a publicidade personalizada a qualquer momento visitando as',
    dartCookieLink1: 'Configurações de Anúncios do Google',
    dartCookieItem4: 'Você também pode saber mais sobre o gerenciamento de cookies publicitários em',
    dartCookieLink2: 'www.aboutads.info',
    sec3Title: '3. Tecnologias de Armazenamento e Cookies Utilizados',
    thCategory: 'Categoria',
    thPurpose: 'Finalidade',
    thTypeDuration: 'Tipo / Validade',
    row1Cat: 'Técnicos / Essenciais',
    row1Pur: 'Garantem a navegação fluida da interface e a comunicação com os servidores de download.',
    row1Dur: 'Sessão técnica',
    row2Cat: 'Preferências do Usuário',
    row2Pur: 'Registram o idioma selecionado (ES, EN, PT) e o Modo de Tema (Escuro ou Claro).',
    row2Dur: 'LocalStorage (1 ano)',
    row3Cat: 'Histórico de Downloads',
    row3Pur: 'Permite visualizar os vídeos baixados e reproduzi-los offline no próprio aparelho.',
    row3Dur: 'Armazenamento Local Privado',
    row4Cat: 'Publicitários (Google AdSense)',
    row4Pur: 'Métricas de visualização e combate a fraudes publicitárias conforme regras do Google.',
    row4Dur: 'Variável por provedor',
    sec4Title: '4. Seus Direitos de Proteção de Dados (LGPD e RGPD)',
    sec4Desc: 'Em conformidade com a LGPD (Lei Geral de Proteção de Dados) e o RGPD europeu, você tem os seguintes direitos assegurados:',
    rightAccessTitle: 'Direito de Acesso e Consulta',
    rightAccessDesc: 'Confirmar a existência de qualquer processamento técnico relacionado ao seu acesso.',
    rightDeleteTitle: 'Direito de Eliminação',
    rightDeleteDesc: 'Solicitar a limpeza imediata de registros técnicos temporários.',
    rightObjectTitle: 'Direito de Oposição',
    rightObjectDesc: 'Rejeitar cookies de publicidade personalizada em qualquer momento.',
    rightPurgeTitle: 'Limpeza Local Instantânea',
    rightPurgeDesc: 'Você pode limpar todo o seu histórico com apenas 1 clique pelo modal de Histórico.',
    sec5Title: '5. Dúvidas sobre Privacidade e Contato Oficial',
    sec5Desc: 'Para esclarecer dúvidas sobre esta Política de Privacidade ou solicitar suporte técnico:',
    contactButton: 'Enviar E-mail',
    contactFormButton: 'Formulário de Contato',
    responseTime: 'Prazo estimado de resposta: de 24 a 48 horas úteis.'
  }
};

export const termsTranslations: Record<Locale, TermsTranslations> = {
  es: {
    backToDownloader: 'Volver al Descargador',
    title: 'Términos de Servicio',
    lastUpdated: 'Última actualización: 1 de Enero de 2026 • Condiciones Generales de Uso',
    importantNoticeTitle: 'Aviso Legal Importante:',
    importantNoticeDesc: 'Al acceder y utilizar {siteTitle} (en su versión web o aplicación móvil Android), confirmas que has leído, entendido y aceptado cumplir estos Términos de Servicio y todas las normativas legales aplicables.',
    sec1Title: '1. Naturaleza y Propósito del Servicio',
    sec1Desc: '{siteTitle} es una herramienta tecnológica independiente diseñada para facilitar la descarga, conversión técnica (format-shifting) y respaldo de contenidos multimedia de plataformas públicas (Facebook, TikTok, Instagram, Threads, Twitter/𝕏, YouTube y WhatsApp). Nuestro software actúa exclusivamente como intermediario técnico de transmisión y no almacena copias de videos ajenos en sus servidores.',
    sec2Title: '2. Uso Aceptable y Legítimo',
    sec2Desc: 'Nuestras herramientas deben ser utilizadas únicamente para fines éticos y legales, incluyendo:',
    itemOwnContentTitle: 'Contenido Propio:',
    itemOwnContentDesc: 'Copias de seguridad de videos creados o publicados por ti.',
    itemPrivateUseTitle: 'Uso Personal Privado:',
    itemPrivateUseDesc: 'Visualización sin conexión en dispositivos personales.',
    itemResearchTitle: 'Docencia e Investigación:',
    itemResearchDesc: 'Citas y análisis con la debida atribución al autor original.',
    itemPublicDomainTitle: 'Dominio Público:',
    itemPublicDomainDesc: 'Obras bajo licencias libres o Creative Commons.',
    sec3Title: '3. Usos Prohibidos',
    sec3Desc: 'Queda terminantemente prohibido hacer uso de esta plataforma para:',
    prohibited1: 'Descargar, duplicar o comercializar contenido protegido por derechos de autor con fines lucrativos sin autorización.',
    prohibited2: 'Apropiarse de la autoría de creaciones intelectuales ajenas.',
    prohibited3: 'Difundir contenidos con fines de acoso, difamación, vulneración de intimidad o actividades ilícitas.',
    prohibited4: 'Ejecutar ataques de denegación de servicio (DDoS) o sobrecargar deliberadamente la infraestructura del servidor.',
    sec4Title: '4. Limitación de Responsabilidad ("Tal cual")',
    sec4Desc: 'El servicio se provee "tal cual" y según disponibilidad. {siteTitle} no ofrece garantías explícitas de disponibilidad ininterrumpida ante cambios imprevistos en las plataformas de origen y no se hace responsable del uso final ni la redistribución que los usuarios realicen con los archivos obtenidos.',
    sec5Title: '5. Marcas Registradas de Terceros',
    sec5Desc: 'Facebook, TikTok, Instagram, Threads, YouTube, Twitter/𝕏 y WhatsApp son marcas registradas propiedad de sus correspondientes titulares (Meta Platforms, Inc., ByteDance Ltd., Google LLC, X Corp. y WhatsApp LLC). {siteTitle} es una aplicación técnica independiente sin relación corporativa, patrocinio ni afiliación oficial con ninguna de dichas empresas.',
    sec6Title: '6. Consultas sobre los Términos',
    sec6Desc: 'Para inquietudes respecto a estos términos o peticiones legales:',
    helpDeskButton: 'Mesa de Ayuda'
  },
  en: {
    backToDownloader: 'Back to Downloader',
    title: 'Terms of Service',
    lastUpdated: 'Last updated: January 1, 2026 • General Terms of Use',
    importantNoticeTitle: 'Important Legal Notice:',
    importantNoticeDesc: 'By accessing and utilizing {siteTitle} (via web browser or our native Android mobile application), you confirm that you have read, understood, and consented to comply with these Terms of Service and all applicable international laws.',
    sec1Title: '1. Nature and Purpose of the Service',
    sec1Desc: '{siteTitle} is an independent utility created to facilitate the conversion, format-shifting, and local personal backup of publicly available media from major social networks (Facebook, TikTok, Instagram, Threads, Twitter/𝕏, YouTube, and WhatsApp). Our software operates strictly as a technical transmission conduit and does not maintain third-party media libraries on its servers.',
    sec2Title: '2. Acceptable and Legitimate Use',
    sec2Desc: 'Our tools may only be leveraged for ethical, lawful purposes, including:',
    itemOwnContentTitle: 'Own Created Content:',
    itemOwnContentDesc: 'Personal backup copies of multimedia produced or uploaded by you.',
    itemPrivateUseTitle: 'Private Personal Viewing:',
    itemPrivateUseDesc: 'Offline consumption on your private personal devices.',
    itemResearchTitle: 'Education & Scholarship:',
    itemResearchDesc: 'Academic research, commentary, and criticism with proper source attribution.',
    itemPublicDomainTitle: 'Public Domain:',
    itemPublicDomainDesc: 'Creative works governed by open licenses or Creative Commons.',
    sec3Title: '3. Prohibited Uses',
    sec3Desc: 'It is strictly prohibited to utilize this platform to:',
    prohibited1: 'Download, reproduce, or commercially distribute copyrighted content without explicit owner authorization.',
    prohibited2: 'Misrepresent ownership or claim authorship over intellectual property created by others.',
    prohibited3: 'Disseminate media for defamatory, abusive, privacy-invading, or unlawful purposes.',
    prohibited4: 'Execute distributed denial-of-service (DDoS) attempts or deliberately overload server infrastructure.',
    sec4Title: '4. Limitation of Liability ("As Is")',
    sec4Desc: 'This service is offered on an "as is" and "as available" basis. {siteTitle} provides no express guarantees of continuous uptime against unpredictable API changes on host networks and assumes no liability for the downstream utilization or redistribution of downloaded files.',
    sec5Title: '5. Third-Party Trademarks',
    sec5Desc: 'Facebook, TikTok, Instagram, Threads, YouTube, Twitter/𝕏, and WhatsApp are registered trademarks of their respective holders (Meta Platforms, Inc., ByteDance Ltd., Google LLC, X Corp., and WhatsApp LLC). {siteTitle} is an independent utility without corporate relationship, sponsorship, or official affiliation with any of these companies.',
    sec6Title: '6. Inquiries Regarding Terms',
    sec6Desc: 'For questions regarding these terms or formal legal inquiries:',
    helpDeskButton: 'Help Desk'
  },
  pt: {
    backToDownloader: 'Voltar ao Baixador',
    title: 'Termos de Serviço',
    lastUpdated: 'Última atualização: 1 de Janeiro de 2026 • Condições Gerais de Uso',
    importantNoticeTitle: 'Aviso Legal Importante:',
    importantNoticeDesc: 'Ao acessar e utilizar o {siteTitle} (seja na versão web ou no aplicativo móvel para Android), você confirma que leu, compreendeu e concorda em cumprir estes Termos de Serviço e todas as legislações pertinentes aplicáveis.',
    sec1Title: '1. Natureza e Finalidade do Serviço',
    sec1Desc: 'O {siteTitle} é uma ferramenta técnica independente desenvolvida para viabilizar o download, conversão de formatos (format-shifting) e backup pessoal de mídias de plataformas públicas (Facebook, TikTok, Instagram, Threads, Twitter/𝕏, YouTube e WhatsApp). Nosso software atua exclusivamente como intermediário técnico de transmissão e não armazena vídeos de terceiros em seus servidores.',
    sec2Title: '2. Uso Aceitável e Legítimo',
    sec2Desc: 'Nossos recursos devem ser utilizados unicamente para finalidades éticas e legais, tais como:',
    itemOwnContentTitle: 'Conteúdo Próprio:',
    itemOwnContentDesc: 'Cópias de segurança de vídeos criados ou postados por você.',
    itemPrivateUseTitle: 'Uso Pessoal Privado:',
    itemPrivateUseDesc: 'Visualização offline em aparelhos eletrônicos pessoais.',
    itemResearchTitle: 'Estudo e Pesquisa:',
    itemResearchDesc: 'Citações e análises acadêmicas com a devida atribuição ao autor original.',
    itemPublicDomainTitle: 'Domínio Público:',
    itemPublicDomainDesc: 'Obras sob licenças livres ou Creative Commons.',
    sec3Title: '3. Condutas Proibidas',
    sec3Desc: 'É estritamente proibido utilizar esta plataforma para:',
    prohibited1: 'Baixar, comercializar ou redistribuir conteúdo protegido por direitos autorais sem autorização prévia.',
    prohibited2: 'Atribuir-se falsamente a autoria de criações intelectuais de terceiros.',
    prohibited3: 'Propagar materiais com o propósito de difamação, assédio, violação de privacidade ou ilícitos.',
    prohibited4: 'Executar ataques de negação de serviço (DDoS) ou sobrecarregar propositalmente nossa infraestrutura.',
    sec4Title: '4. Limitação de Responsabilidade ("Como Está")',
    sec4Desc: 'O serviço é fornecido "no estado em que se encontra" e conforme disponibilidade. O {siteTitle} não oferece garantias de funcionamento contínuo diante de atualizações das redes sociais de origem e não assume responsabilidade pelo uso final dado aos arquivos obtidos.',
    sec5Title: '5. Marcas Registradas de Terceiros',
    sec5Desc: 'Facebook, TikTok, Instagram, Threads, YouTube, Twitter/𝕏 e WhatsApp são marcas registradas de seus respectivos titulares (Meta Platforms, Inc., ByteDance Ltd., Google LLC, X Corp. e WhatsApp LLC). O {siteTitle} é um aplicativo técnico independente sem qualquer vínculo societário, patrocínio ou afiliação oficial com as referidas empresas.',
    sec6Title: '6. Dúvidas sobre os Termos',
    sec6Desc: 'Para esclarecimentos sobre estes termos ou solicitações formais:',
    helpDeskButton: 'Central de Ajuda'
  }
};

export const copyrightTranslations: Record<Locale, CopyrightTranslations> = {
  es: {
    backToDownloader: 'Volver al Descargador',
    title: 'Política de Copyright y DMCA',
    lastUpdated: 'Protección de Propiedad Intelectual y Procedimiento de Notificación',
    sec1Title: '1. Respeto por los Derechos de Autor',
    sec1Desc: 'En FTY Downloader Pro, respetamos escrupulosamente los derechos de propiedad intelectual de creadores, productoras y artistas. Nuestra plataforma funciona como una herramienta neutral de procesamiento y conversión de medios (format-shifting) para uso personal privado y legítimo, sin almacenar ni hospedar archivos audiovisuales de terceros en servidores propios.',
    sec2Title: '2. Doctrina de Uso Justo (Fair Use)',
    sec2Desc: 'Recordamos a los usuarios que la descarga de material protegido sin autorización previa puede estar amparada exclusivamente bajo las excepciones de Uso Justo (Fair Use) aplicables en su país, limitadas estrictamente a:',
    fairUseItem1: 'Crítica, reseñas y comentarios académicos o culturales.',
    fairUseItem2: 'Reportajes periodísticos e investigación de noticias.',
    fairUseItem3: 'Enseñanza y actividades educativas sin fines de lucro.',
    fairUseItem4: 'Copias de respaldo de archivos propios para visualización privada offline.',
    sec3Title: '3. Procedimiento de Notificación de Infracción (DMCA)',
    sec3Desc: 'Si eres titular legítimo de derechos de autor (o representante acreditado) y consideras que algún contenido procesado a través de nuestra herramienta infringe tus derechos, puedes remitir una notificación con los siguientes datos:',
    dmcaItem1: 'Identificación precisa de la obra protegida por derechos de autor supuestamente infringida.',
    dmcaItem2: 'La URL exacta del contenido en la red social de origen.',
    dmcaItem3: 'Información de contacto (nombre, dirección, teléfono y correo electrónico corporativo).',
    dmcaItem4: 'Declaración de buena fe donde conste que el uso reclamado no está autorizado por el titular ni por la ley.',
    dmcaItem5: 'Firma física o electrónica del titular o representante acreditado.',
    dmcaButtonText: 'Enviar Notificación DMCA'
  },
  en: {
    backToDownloader: 'Back to Downloader',
    title: 'Copyright & DMCA Policy',
    lastUpdated: 'Intellectual Property Protection & Notice Procedure',
    sec1Title: '1. Respect for Intellectual Property',
    sec1Desc: 'At FTY Downloader Pro, we rigorously respect the intellectual property rights of content creators, studios, and artists. Our service operates strictly as a neutral media processing and format-shifting utility intended for private, non-commercial personal backup, hosting no third-party media files on its servers.',
    sec2Title: '2. Fair Use Doctrine',
    sec2Desc: 'Users are reminded that downloading protected media without prior copyright holder authorization is solely permissible under recognized Fair Use exceptions in their jurisdiction, including:',
    fairUseItem1: 'Criticism, commentary, scholarship, and cultural reviews.',
    fairUseItem2: 'Journalistic reporting and investigative research.',
    fairUseItem3: 'Non-profit teaching and classroom education.',
    fairUseItem4: 'Private personal archival backups for offline consumption.',
    sec3Title: '3. DMCA Takedown Notification Procedure',
    sec3Desc: 'If you are a verified copyright owner (or an authorized legal representative) and believe that any media link handled through our service infringes your rights, please provide a notice containing:',
    dmcaItem1: 'Precise identification of the copyrighted work claimed to have been infringed.',
    dmcaItem2: 'The exact URL of the target material hosted on the origin social network.',
    dmcaItem3: 'Full contact details (full name, address, telephone, and corporate email address).',
    dmcaItem4: 'A statement in good faith that the disputed use is not authorized by the copyright owner, agent, or the law.',
    dmcaItem5: 'A physical or verified electronic signature of the authorized copyright owner.',
    dmcaButtonText: 'Submit DMCA Notice'
  },
  pt: {
    backToDownloader: 'Voltar ao Baixador',
    title: 'Política de Direitos Autorais e DMCA',
    lastUpdated: 'Proteção de Propriedade Intelectual e Procedimento de Notificação',
    sec1Title: '1. Respeito aos Direitos Autorais',
    sec1Desc: 'No FTY Downloader Pro, respeitamos rigorosamente os direitos de propriedade intelectual de criadores, gravadoras e produtoras. Nossa plataforma atua unicamente como uma ferramenta neutra de conversão de mídia e backup pessoal privado, sem hospedar ou armazenar arquivos audiovisuais de terceiros em servidores próprios.',
    sec2Title: '2. Doutrina de Uso Justo (Fair Use)',
    sec2Desc: 'Lembramos a todos os usuários que o download de mídias protegidas sem autorização prévia só é permitido sob as hipóteses legais de Uso Justo previstas na lei, tais como:',
    fairUseItem1: 'Crítica, comentários e análises acadêmicas ou culturais.',
    fairUseItem2: 'Reportagens jornalísticas e pesquisas de interesse público.',
    fairUseItem3: 'Ensino e atividades educacionais sem fins lucrativos.',
    fairUseItem4: 'Cópias de segurança de mídias próprias para visualização pessoal offline.',
    sec3Title: '3. Procedimento de Notificação DMCA',
    sec3Desc: 'Se você é o titular legítimo de direitos autorais (ou procurador legal) e considera que qualquer link processado infringe seus direitos, envie uma notificação com os seguintes elementos:',
    dmcaItem1: 'Identificação exata da obra autoral que teria sido infringida.',
    dmcaItem2: 'A URL completa e precisa do vídeo na rede social de origem.',
    dmcaItem3: 'Dados de contato completos (nome, endereço, telefone e e-mail corporativo).',
    dmcaItem4: 'Declaração de boa-fé afirmando que a utilização reclamada não foi autorizada pelo titular nem pela lei.',
    dmcaItem5: 'Assinatura física ou eletrônica válida do titular dos direitos.',
    dmcaButtonText: 'Enviar Notificação DMCA'
  }
};
