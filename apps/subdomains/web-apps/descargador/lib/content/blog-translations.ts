import { BlogPost } from '@/types/blog';
import { Locale } from '@/lib/i18n/config';

export interface LocalizedBlogItem {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string;
}

export const blogPostTranslations: Record<'en' | 'pt', Record<string, LocalizedBlogItem>> = {
  en: {
    'post-1-volument-guia-pro': {
      title: 'The Ultimate Digital Backup Guide',
      excerpt: 'Complete guide on how to safeguard your most valuable files against technical failures and cyber threats in 2026.',
      category: 'Mega Guide',
      readTime: '45 min',
      content: `
        <h2>Why is a Digital Backup Vital in 2026?</h2>
        <p>In the era of massive data streams, losing your digital files can mean losing years of hard work, irreplaceable personal memories, or critical business assets. A <strong>digital backup</strong> is not just a secondary copy; it is your ultimate digital insurance policy.</p>
        
        <h3>The Golden Rule: 3-2-1 Strategy</h3>
        <p>To guarantee that your content is always recoverable, we recommend following the classic 3-2-1 rule adapted to modern high-speed cloud technologies:</p>
        <ul>
          <li><strong>3 Copies of your data:</strong> The original master file and at least two distinct backups.</li>
          <li><strong>2 Different storage media:</strong> For example, a local high-speed SSD/NAS and encrypted cloud storage.</li>
          <li><strong>1 Off-site copy:</strong> Critical in cases of physical hardware damage, theft, or local disasters.</li>
        </ul>

        <h2>Recommended Tools for Digital Backups</h2>
        <p>Depending on your storage volume and workflow, consider these top-tier automation tools:</p>
        <ul>
          <li><strong>Cloud Synchronization:</strong> Google Drive, Dropbox, and OneDrive with geographic redundancy.</li>
          <li><strong>Local Network Attached Storage (NAS):</strong> Essential for content creators working with high-bitrate 4K files.</li>
          <li><strong>Descargador Pro:</strong> Our verified utility to ensure saved online videos and audio retain complete metadata and pristine original quality.</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Prevention is always your strongest defense against data loss. Implementing a reliable, automated backup workflow today will save hours of downtime tomorrow. Stay safe and keep your digital assets protected.</p>
      `
    },
    'descarga-facebook-hd-4k': {
      title: 'How to Download Facebook Videos in HD/4K',
      excerpt: 'Discover how to download Facebook videos at maximum available resolution (Full HD and 4K) safely and quickly in 2026.',
      category: 'Tutorials',
      readTime: '10 min',
      content: `
        <h2>Complete Guide: Downloading Facebook Videos in High Resolution</h2>
        <p>Facebook hosts millions of hours of rich video content. However, the native platform doesn't allow saving videos for offline viewing. In this guide, you will learn how to use <strong>Descargador Pro</strong> to save any public Facebook video at maximum fidelity.</p>

        <h3>Why Choose 4K Resolution?</h3>
        <p>Most social media videos are heavily compressed for mobile feeds. If you need to replay the video on high-definition displays or repurpose it for professional editing, you need the original uncompressed stream.</p>

        <h2>Step-by-Step Instructions</h2>
        <ul>
          <li><strong>Find the video:</strong> Open Facebook and click on the three dots or share menu to "Copy Link".</li>
          <li><strong>Paste the URL:</strong> Open Descargador Pro and paste the URL into the search field.</li>
          <li><strong>Choose your format:</strong> Select MP4 and your preferred quality tier (720p, 1080p, or 4K UHD).</li>
          <li><strong>Download:</strong> Click Download and save the video directly to your device storage.</li>
        </ul>

        <h3>Privacy & Security Tips</h3>
        <p>Never share your social media account passwords. Our service fetches public video streams externally, keeping your account 100% secure.</p>

        <h2>Summary</h2>
        <p>Saving videos from Facebook is effortless with the right tools. Always respect the intellectual property and copyright of the original content creators.</p>
      `
    },
    'tiktok-sin-marca-de-agua': {
      title: 'TikTok Video Downloader Without Watermark',
      excerpt: 'Download TikTok videos in full resolution without the annoying bouncing watermark or logo.',
      category: 'Tutorials',
      readTime: '15 min',
      content: `
        <h2>How to Download TikTok Videos Without Watermarks in 2026</h2>
        <p>TikTok is the premier source of viral short-form video. However, downloading directly through the mobile app inserts a bouncing watermark. If you want clean videos for offline archiving or multiplatform curation, you need the watermark-free file.</p>
        
        <h3>Steps for High Resolution Clean Downloads</h3>
        <ul>
          <li><strong>Copy link:</strong> Open TikTok, find the clip, and tap "Share" > "Copy link".</li>
          <li><strong>Paste into Descargador Pro:</strong> Insert the copied URL into our input bar.</li>
          <li><strong>Select No Watermark:</strong> Choose the HD MP4 option that strips away watermarks and metadata cleanly.</li>
        </ul>

        <h3>Why Remove the Watermark?</h3>
        <p>Social algorithms often demote cross-posted content that displays third-party branding. Clean clips maintain high visual appeal and organic reach.</p>
      `
    },
    'formatos-video-2026-guia': {
      title: '2026 Video Formats: Complete Technical Guide',
      excerpt: 'Understand the differences between MP4, WebM, AV1, and next-generation codecs for high-efficiency digital media.',
      category: 'Technical',
      readTime: '20 min',
      content: `
        <h2>Evolution of Video Formats in 2026</h2>
        <p>Digital video standards have evolved dramatically. With codecs like AV1 and H.265 becoming mainstream, high-resolution streaming requires less bandwidth than ever before while preserving frame-level detail.</p>
        
        <h3>MP4 vs WebM: Which one should you pick?</h3>
        <ul>
          <li><strong>MP4 (H.264/H.265):</strong> The global gold standard for universal compatibility across iPhones, Android, smart TVs, and editing suites.</li>
          <li><strong>WebM (VP9/AV1):</strong> Open-source, lightweight web format ideal for browser embedding and ultra-fast loading.</li>
        </ul>
      `
    },
    'herramientas-creadores-2026': {
      title: '7 Essential Tools for Content Creators in 2026',
      excerpt: 'Top software and platforms to boost your multimedia creation, editing, and distribution workflow this year.',
      category: 'Productivity',
      readTime: '18 min',
      content: `
        <h2>The Creator Tech Stack for 2026</h2>
        <p>Modern creators need agility, fast media ingestion, and automated workflows to stay ahead of short-form trends across TikTok, YouTube Shorts, and Instagram Reels.</p>
        <h3>Top Recommendations</h3>
        <ul>
          <li><strong>Descargador Pro:</strong> Instant asset extraction and backup without loss of quality.</li>
          <li><strong>CapCut & DaVinci Resolve:</strong> Industry standard vertical video editing with AI captions.</li>
          <li><strong>Notion:</strong> Editorial calendar management and script drafting.</li>
        </ul>
      `
    },
    'optimizacion-redes-2026': {
      title: 'Social Media Optimization: Complete 2026 Guide',
      excerpt: 'How to format, compress, and publish your videos for maximum organic reach on Instagram, TikTok, and YouTube.',
      category: 'Marketing',
      readTime: '25 min',
      content: `
        <h2>Mastering Video Optimization for Social Algorithms</h2>
        <p>Social media algorithms prioritize high watch times and retention rates. Uploading videos in the correct aspect ratio (9:16) with crisp audio is essential to avoid automatic platform downscaling.</p>
      `
    },
    'mega-guia-post-7': {
      title: 'Digital Copyright & Fair Use in 2026',
      excerpt: 'A comprehensive review of copyright laws, DMCA guidelines, and fair use practices for content creators and editors.',
      category: 'Legal',
      readTime: '30 min',
      content: `
        <h2>Understanding Digital Copyright in the Streaming Age</h2>
        <p>As media sharing expands, understanding fair use, transformative commentary, and safe media curation ensures your channels stay protected from DMCA strikes.</p>
      `
    },
    'guia-audio-mp3-hd': {
      title: 'High-Quality MP3 Audio Extraction Guide',
      excerpt: 'Learn how to extract crystal-clear 320kbps MP3 audio from online videos for offline listening and podcasting.',
      category: 'Audio',
      readTime: '12 min',
      content: `
        <h2>Extracting Studio-Quality Audio from Videos</h2>
        <p>Whether you want to listen to a conference offline or extract sound effects for editing, Descargador Provides lossless 320kbps MP3 conversions in seconds.</p>
      `
    },
    'mega-guia-post-9': {
      title: 'Troubleshooting Common Video Download Issues',
      excerpt: 'Quick fixes for expired links, private post restrictions, and slow download speeds across major platforms.',
      category: 'Support',
      readTime: '15 min',
      content: `
        <h2>How to Solve Common Download Errors</h2>
        <p>If a link fails to resolve, verify that the target post is set to Public visibility and that the URL includes the complete video identifier.</p>
      `
    },
    'ciberseguridad-descargas-guia-seguridad-2026': {
      title: 'Cybersecurity & Media Downloads: Staying Safe in 2026',
      excerpt: 'How to protect your devices from malware, phishing redirects, and suspicious ads when downloading media online.',
      category: 'Security',
      readTime: '22 min',
      content: `
        <h2>Safe Downloading Practices in 2026</h2>
        <p>Legitimate tools never ask for passwords or require you to install shady third-party browser extensions. Always verify SSL certificates and rely on clean web downloaders.</p>
      `
    },
    'estrategias-monetizacion-tiktok-2026-guia-completa': {
      title: 'TikTok Monetization Strategies 2026: The Ultimate Guide',
      excerpt: 'Proven tactics to monetize short-form video through creator rewards, brand deals, and digital product sales.',
      category: 'Business',
      readTime: '35 min',
      content: `
        <h2>Monetizing Short-Form Video Content in 2026</h2>
        <p>Discover how top creators build multi-channel revenue streams by combining high-engagement TikTok clips with affiliate offers and newsletter funnels.</p>
      `
    },
    'guia-meta-facebook-ads-negocios-2026': {
      title: 'Meta (Facebook) Ads Masterclass for Business 2026',
      excerpt: 'Complete tutorial on running high-ROI video ad campaigns on Facebook and Instagram using AI audience targeting.',
      category: 'Marketing',
      readTime: '40 min',
      content: `
        <h2>Scaling Your Business with Meta Video Ads</h2>
        <p>Short, punchy video creatives with clear call-to-actions consistently outperform static images in modern Facebook ad algorithms.</p>
      `
    },
    'editar-reels-capcut-profesional-2026': {
      title: 'How to Edit Reels with CapCut Like a Pro in 2026',
      excerpt: 'Step-by-step masterclass on keyframing, trending audio transitions, and automated captions in CapCut.',
      category: 'Video Editing',
      readTime: '28 min',
      content: `
        <h2>Professional Vertical Editing Workflow</h2>
        <p>Learn the exact pacing, sound design, and text animation techniques used by top creators to keep viewer retention above 80%.</p>
      `
    },
    'futuro-descarga-videos-tendencias-2026-2030': {
      title: 'The Future of Video Downloads: Trends 2026–2030',
      excerpt: 'Analysis of decentralized storage, ultra-fast 6G streaming, and AI-powered multimedia format conversion.',
      category: 'Future Tech',
      readTime: '30 min',
      content: `
        <h2>Where Multimedia Consumption is Heading</h2>
        <p>As media resolutions expand into 8K and spatial video formats, offline storage and edge-cached downloads will remain vital for high-fidelity consumption.</p>
      `
    },
    'futuro-video-corto-2026': {
      title: 'The Future of Short-Form Video in 2026',
      excerpt: 'How algorithms, interactive features, and AI voiceovers are reshaping vertical entertainment globally.',
      category: 'Trends',
      readTime: '20 min',
      content: `
        <h2>Why Short-Form Video Continues to Dominate</h2>
        <p>Vertical video has become the default content format worldwide. Platforms are now introducing longer formats and interactive overlays to boost watch time.</p>
      `
    }
  },
  pt: {
    'post-1-volument-guia-pro': {
      title: 'O Guia Definitivo de Backup Digital',
      excerpt: 'Guia completo sobre como proteger seus arquivos mais valiosos contra falhas técnicas e ataques virtuais em 2026.',
      category: 'Mega Guia',
      readTime: '45 min',
      content: `
        <h2>Por que o Backup Digital é Vital em 2026?</h2>
        <p>Na era da sobrecarga de informações, perder seus arquivos digitais pode significar perder anos de trabalho, lembranças familiares ou dados financeiros cruciais. Um <strong>backup digital</strong> não é apenas uma cópia de segurança; é sua apólice de seguro no ecossistema moderno.</p>
        
        <h3>A Regra de Ouro: Estratégia 3-2-1</h3>
        <p>Para garantir que seus arquivos estejam sempre seguros e recuperáveis, recomendamos seguir a metodologia 3-2-1 adaptada à nuvem:</p>
        <ul>
          <li><strong>3 Cópias dos seus dados:</strong> O arquivo original e pelo menos dois backups diferentes.</li>
          <li><strong>2 Mídias de armazenamento distintas:</strong> Por exemplo, um SSD externo/NAS e a nuvem.</li>
          <li><strong>1 Cópia fora do local:</strong> Fundamental contra roubos, incêndios ou falhas físicas locais.</li>
        </ul>

        <h2>Ferramentas Recomendadas para Backup</h2>
        <p>Dependendo da sua demanda diária, existem excelentes opções para automatizar esse fluxo:</p>
        <ul>
          <li><strong>Sincronização em Nuvem:</strong> Google Drive, Dropbox e OneDrive com redundância geográfica.</li>
          <li><strong>Armazenamento Local (NAS):</strong> Essencial para criadores que lidam com arquivos de vídeo 4K pesados.</li>
          <li><strong>Descargador Pro:</strong> Nossa ferramenta recomendada para baixar e arquivar conteúdos online com fidelidade máxima.</li>
        </ul>

        <h2>Conclusão</h2>
        <p>A prevenção é o melhor escudo contra a perda de arquivos. Estabeleça uma rotina de backup hoje e evite surpresas no futuro.</p>
      `
    },
    'descarga-facebook-hd-4k': {
      title: 'Como Baixar Vídeos do Facebook em HD/4K',
      excerpt: 'Descubra como baixar vídeos do Facebook na máxima resolução disponível (Full HD e 4K) com segurança e rapidez em 2026.',
      category: 'Tutoriais',
      readTime: '10 min',
      content: `
        <h2>Guia Completo: Download de Vídeos do Facebook em Alta Resolução</h2>
        <p>O Facebook é um dos maiores acervos de vídeo do mundo, mas não oferece opção nativa para salvar mídias offline. Neste guia, mostramos como usar o <strong>Descargador Pro</strong> para baixar qualquer vídeo público com máxima qualidade.</p>

        <h3>Por que Escolher a Resolução 4K?</h3>
        <p>A maioria dos vídeos nas redes sociais passa por forte compressão. Para exibir o vídeo em telas grandes ou utilizá-lo em edições profissionais, você precisa do arquivo com a máxima taxa de bits.</p>

        <h2>Passo a Passo para Baixar</h2>
        <ul>
          <li><strong>Encontre o vídeo:</strong> Abra o Facebook e toque nos três pontos para "Copiar link".</li>
          <li><strong>Cole o link:</strong> Acesse o Descargador Pro e insira o link no campo de busca.</li>
          <li><strong>Escolha o formato:</strong> Selecione MP4 e a resolução desejada (720p, 1080p ou 4K).</li>
          <li><strong>Baixar:</strong> Clique no botão e salve o arquivo diretamente no seu celular ou computador.</li>
        </ul>
      `
    },
    'tiktok-sin-marca-de-agua': {
      title: 'Como Baixar Vídeos do TikTok Sem Marca d\'Água',
      excerpt: 'Baixe vídeos do TikTok em alta resolução sem o logotipo saltitante na tela.',
      category: 'Tutoriais',
      readTime: '15 min',
      content: `
        <h2>Como Baixar Vídeos do TikTok Sem Marca d'Água em 2026</h2>
        <p>O TikTok é a principal fonte de conteúdos virais do planeta. Porém, salvar vídeos pelo app insere a marca d'água. Para criadores que fazem repost no Instagram Reels ou YouTube Shorts, o vídeo limpo é fundamental.</p>
        
        <h3>Passos para Baixar em Alta Definição</h3>
        <ul>
          <li><strong>Copie o link:</strong> Abra o TikTok, vá no vídeo e clique em "Compartilhar" > "Copiar link".</li>
          <li><strong>Cole no Descargador Pro:</strong> Cole a URL na nossa barra de busca.</li>
          <li><strong>Selecione Sem Marca d'Água:</strong> Escolha a opção HD limpa para baixar sem logos.</li>
        </ul>
      `
    },
    'formatos-video-2026-guia': {
      title: 'Formatos de Vídeo 2026: Guia Técnico',
      excerpt: 'Entenda as diferenças entre MP4, WebM, AV1 e os novos codecs de alta eficiência para vídeo digital.',
      category: 'Técnico',
      readTime: '20 min',
      content: `
        <h2>Evolução dos Formatos de Vídeo em 2026</h2>
        <p>Os padrões de vídeo digital avançaram significativamente. Novos codecs como AV1 permitem transmitir resoluções altíssimas consumindo muito menos internet.</p>
      `
    },
    'herramientas-creadores-2026': {
      title: '7 Ferramentas Essenciais para Criadores em 2026',
      excerpt: 'Os melhores programas e plataformas para acelerar sua produção de conteúdo e distribuição de vídeos.',
      category: 'Produtividade',
      readTime: '18 min',
      content: `
        <h2>O Arsenal dos Criadores de Sucesso em 2026</h2>
        <p>Criadores modernos precisam de ferramentas ágeis para produzir e arquivar conteúdos multimídia para TikTok, Reels e Shorts.</p>
      `
    },
    'optimizacion-redes-2026': {
      title: 'Otimização para Redes Sociais: Guia 2026',
      excerpt: 'Como formatar, comprimir e publicar seus vídeos para obter o máximo alcance orgânico.',
      category: 'Marketing',
      readTime: '25 min',
      content: `
        <h2>Dominando os Algoritmos das Redes Sociais</h2>
        <p>Os algoritmos priorizam vídeos verticais (9:16) com áudio claro e alta retenção nos primeiros 3 segundos.</p>
      `
    },
    'mega-guia-post-7': {
      title: 'Direitos Autorais Digitais em 2026',
      excerpt: 'Guia completo sobre legislação de direitos autorais, DMCA e uso legítimo para criadores.',
      category: 'Legal',
      readTime: '30 min',
      content: `
        <h2>Entendendo os Direitos Autorais na Era Digital</h2>
        <p>Compreenda as diretrizes de uso justo e curadoria de conteúdo para manter seus canais livres de penalidades.</p>
      `
    },
    'guia-audio-mp3-hd': {
      title: 'Como Extrair Áudio MP3 em Alta Qualidade',
      excerpt: 'Aprenda a converter vídeos em áudio MP3 de 320kbps com som cristalino para ouvir offline.',
      category: 'Áudio',
      readTime: '12 min',
      content: `
        <h2>Extraindo Áudio com Fidelidade de Estúdio</h2>
        <p>Converta vídeos em arquivos MP3 de 320kbps em segundos para podcasts, músicas ou efeitos sonoros.</p>
      `
    },
    'mega-guia-post-9': {
      title: 'Solução de Problemas em Downloads de Vídeo',
      excerpt: 'Dicas rápidas para resolver links expirados, vídeos privados e falhas de conexão.',
      category: 'Suporte',
      readTime: '15 min',
      content: `
        <h2>Como Resolver Falhas Comuns de Download</h2>
        <p>Verifique se o post original está como Público e certifique-se de que o link contém o identificador correto.</p>
      `
    },
    'ciberseguridad-descargas-guia-seguridad-2026': {
      title: 'Cibersegurança e Downloads: Como Navegar com Segurança',
      excerpt: 'Proteja seus aparelhos contra golpes, páginas falsas e anúncios suspeitos ao baixar arquivos.',
      category: 'Segurança',
      readTime: '22 min',
      content: `
        <h2>Práticas Seguras para Baixar Arquivos na Internet</h2>
        <p>Ferramentas confiáveis nunca pedem senhas pessoais nem exigem instalações duvidosas no navegador.</p>
      `
    },
    'estrategias-monetizacion-tiktok-2026-guia-completa': {
      title: 'Estratégias de Monetização no TikTok em 2026',
      excerpt: 'Como gerar renda consistente com vídeos curtos por meio de parcerias e programas de criadores.',
      category: 'Negócios',
      readTime: '35 min',
      content: `
        <h2>Monetizando Conteúdos no TikTok em 2026</h2>
        <p>Descubra como construir múltiplas fontes de receita combinando vídeos virais com links de afiliados.</p>
      `
    },
    'guia-meta-facebook-ads-negocios-2026': {
      title: 'Guia Completo de Anúncios no Facebook e Instagram 2026',
      excerpt: 'Como criar campanhas de anúncios em vídeo com alto retorno sobre o investimento usando IA.',
      category: 'Marketing',
      readTime: '40 min',
      content: `
        <h2>Escalando Vendas com Anúncios em Vídeo</h2>
        <p>Vídeos diretos com chamadas para ação claras geram conversões significativamente maiores no Meta Ads.</p>
      `
    },
    'editar-reels-capcut-profesional-2026': {
      title: 'Como Editar Reels com CapCut como um Profissional em 2026',
      excerpt: 'Aprenda efeitos de transição, legendas automáticas e sincronização de áudio no CapCut.',
      category: 'Edição de Vídeo',
      readTime: '28 min',
      content: `
        <h2>Fluxo de Edição Profissional de Vídeos Curtos</h2>
        <p>Domine o ritmo e a dinâmica de cortes rápidos para manter a taxa de retenção dos vídeos acima de 80%.</p>
      `
    },
    'futuro-descarga-videos-tendencias-2026-2030': {
      title: 'O Futuro do Download de Vídeos: Tendências 2026–2030',
      excerpt: 'Armazenamento descentralizado, conexões 6G e inteligência artificial na conversão de mídias.',
      category: 'Tecnologia',
      readTime: '30 min',
      content: `
        <h2>Para Onde Caminha o Consumo Multimídia</h2>
        <p>Mesmo com o avanço da nuvem e do 6G, ter arquivos salvos localmente continua sendo crucial para criadores e usuários.</p>
      `
    },
    'futuro-video-corto-2026': {
      title: 'O Futuro do Vídeo Curto em 2026',
      excerpt: 'Como os novos formatos verticais e a inteligência artificial estão moldando o consumo de conteúdo.',
      category: 'Tendências',
      readTime: '20 min',
      content: `
        <h2>Por que os Vídeos Verticais Lideram o Mundo</h2>
        <p>O formato vertical se consolidou como o principal canal de descoberta cultural e entretenimento digital.</p>
      `
    }
  }
};

/**
 * Obtiene el post traducido según el idioma activo (es, en, pt)
 */
export function getLocalizedPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale === 'es') {
    return post;
  }

  const langData = blogPostTranslations[locale as 'en' | 'pt'];
  const directMatch = langData?.[post.slug] || langData?.[post.id.toString()];

  if (directMatch) {
    return {
      ...post,
      title: directMatch.title || post.title,
      excerpt: directMatch.excerpt || post.excerpt,
      category: directMatch.category || post.category,
      readTime: directMatch.readTime ? `${directMatch.readTime} ${locale === 'en' ? 'read' : 'de leitura'}` : post.readTime,
      content: directMatch.content || post.content
    };
  }

  // Traducción inteligente para posts genéricos (post-14, post-21, post-22, post-23, etc.)
  const categoryMap: Record<string, { en: string; pt: string }> = {
    'Mega Guía': { en: 'Mega Guide', pt: 'Mega Guia' },
    'Tutoriales': { en: 'Tutorials', pt: 'Tutoriais' },
    'Tutorial': { en: 'Tutorial', pt: 'Tutorial' },
    'General': { en: 'General', pt: 'Geral' },
    'Seguridad': { en: 'Security', pt: 'Segurança' },
    'Audio': { en: 'Audio', pt: 'Áudio' },
    'Tendencias': { en: 'Trends', pt: 'Tendências' },
    'Marketing': { en: 'Marketing', pt: 'Marketing' },
  };

  const localizedCategory = categoryMap[post.category]?.[locale as 'en' | 'pt'] || post.category;
  const readTimeLabel = locale === 'en' ? 'read' : 'de leitura';

  let translatedTitle = post.title;
  let translatedExcerpt = post.excerpt;

  if (locale === 'en') {
    translatedTitle = post.title
      .replace(/^Guía\b/i, 'Guide')
      .replace(/^La Guía Definitiva\b/i, 'The Ultimate Guide')
      .replace(/^Descarga de Videos\b/i, 'Video Download')
      .replace(/^Comparativa de\b/i, 'Comparison of')
      .replace(/^Gestión de\b/i, 'Management of')
      .replace(/^Post (\d+)/i, 'Masterclass Guide $1')
      .replace(/de Alta Calidad/i, 'High Quality');

    translatedExcerpt = post.excerpt
      .replace(/Contenido expandido\./i, 'Comprehensive digital media guide.')
      .replace(/Guía completa sobre cómo/i, 'Complete guide on how to')
      .replace(/Descubre cómo/i, 'Discover how to');
  } else if (locale === 'pt') {
    translatedTitle = post.title
      .replace(/^Guía\b/i, 'Guia')
      .replace(/^La Guía Definitiva\b/i, 'O Guia Definitivo')
      .replace(/^Descarga de Videos\b/i, 'Download de Vídeos')
      .replace(/^Comparativa de\b/i, 'Comparativo de')
      .replace(/^Gestión de\b/i, 'Gestão de')
      .replace(/^Post (\d+)/i, 'Guia Mestre $1')
      .replace(/de Alta Calidad/i, 'de Alta Qualidade');

    translatedExcerpt = post.excerpt
      .replace(/Contenido expandido\./i, 'Conteúdo abrangente de mídia digital.')
      .replace(/Guía completa sobre cómo/i, 'Guia completo sobre como')
      .replace(/Descubre cómo/i, 'Descubra como');
  }

  return {
    ...post,
    title: translatedTitle,
    excerpt: translatedExcerpt,
    category: localizedCategory,
    readTime: `${post.readTime.replace(/\s*de lectura\s*/i, '')} ${readTimeLabel}`,
    content: post.content
  };
}


