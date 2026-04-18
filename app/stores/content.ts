// stores/content.ts
// Controls all editable content in the portfolio
// All user-visible strings use MLString { en, tr, de }

// Multi-language string — all user-visible content fields use this type
export type MLString = { en: string; tr: string; de: string }

export interface CaseStudy {
  problem:  MLString
  approach: MLString
  solution: MLString
  result:   MLString
}

export interface Project {
  id:          string
  slug:        string
  title:       MLString
  category:    MLString
  description: MLString
  year:        string
  tags:        string[]       // framework/tool names — not translated
  featured:    boolean
  imageUrl?:   string
  link?:       string
  caseStudy?:  CaseStudy
}

export interface HeroContent {
  name:     MLString
  tagline:  MLString
  subline:  MLString
  ctaLabel: MLString
  ctaLink:  string           // URL — not translated
}

export interface ProcessStep {
  number: string
  title:  MLString
  body:   MLString
}

export interface ProcessContent {
  intro: MLString
  steps: ProcessStep[]
}

export interface AboutContent {
  headline:     MLString
  paragraphs:   MLString[]
  skills:       string[]     // technical skills — not translated
  location:     string       // not translated
  availability: MLString
}

export interface ContactContent {
  headline:         MLString
  subline:          MLString
  email:            string
  socials:          { label: string; url: string }[]
  responseTime:     MLString
  availabilityNote: MLString
  stack:            string   // tech stack — not translated
}

// ── Helper: wrap a plain string as an MLString ──
function ml(en: string, tr = '', de = ''): MLString {
  return { en, tr: tr || en, de: de || en }
}

export const useContentStore = defineStore('content', () => {
  const hero = ref<HeroContent>({
    name:     ml('Your Name'),
    tagline:  ml('Crafting experiences\nthat endure.', 'Sonsuza kalan\ndeneyimler.', 'Erlebnisse schaffen\ndie bleiben.'),
    subline:  ml(
      'Designer & Engineer — Building at the intersection of precision and feeling.',
      'Tasarımcı & Mühendis — Hassasiyet ve hissin kesişiminde.',
      'Designer & Ingenieur — An der Schnittstelle von Präzision und Gefühl.'
    ),
    ctaLabel: ml('View Work', 'Çalışmaları Gör', 'Arbeiten ansehen'),
    ctaLink:  '#work'
  })

  const projects = ref<Project[]>([
    {
      id:          '1',
      slug:        'horizon-interface',
      title:       ml('Horizon Interface'),
      category:    ml('Design System', 'Tasarım Sistemi', 'Design System'),
      description: ml(
        'A comprehensive design system built for scale — 120+ components, token-driven, accessible by default.',
        'Ölçek için inşa edilmiş kapsamlı bir tasarım sistemi — 120+ bileşen, token tabanlı.',
        'Ein umfassendes Design-System — 120+ Komponenten, tokenbasiert und standardmäßig zugänglich.'
      ),
      year:     '2024',
      tags:     ['Design Systems', 'Figma', 'Vue'],
      featured: true,
      imageUrl: '',
      link:     '',
      caseStudy: {
        problem:  ml(
          'A fast-growing product team was shipping inconsistent UI across five products, slowing development and harming trust.',
          'Hızla büyüyen bir ürün ekibi, beş ürün genelinde tutarsız UI sunuyor, geliştirmeyi yavaşlatıyor ve güveni zedeliyordu.',
          'Ein schnell wachsendes Produktteam lieferte inkonsistente UIs über fünf Produkte hinweg.'
        ),
        approach: ml(
          'Audited all existing components, established a token system in Figma, then built a Vue 3 component library with automated accessibility checks.',
          'Tüm mevcut bileşenler denetlendi, Figma\'da bir token sistemi kuruldu ve Vue 3 ile erişilebilirlik kontrollü bir kütüphane inşa edildi.',
          'Alle bestehenden Komponenten wurden geprüft, ein Token-System in Figma etabliert und eine Vue 3 Bibliothek mit automatisierten Zugänglichkeitsprüfungen aufgebaut.'
        ),
        solution: ml(
          '120+ components with full Figma-to-code parity, storybook documentation, and a contribution guide. Zero-config dark mode via CSS tokens.',
          '120+ bileşen, Figma\'dan koda tam uyum, Storybook dokümantasyonu ve katkı rehberi. CSS token\'ları ile sıfır konfigürasyonlu karanlık mod.',
          '120+ Komponenten mit voller Figma-zu-Code-Parität, Storybook-Dokumentation und einem Beitragsleitfaden.'
        ),
        result: ml(
          'Design-to-development time cut by 40%. All five products unified under one visual language within one quarter.',
          'Tasarımdan geliştirmeye süre %40 kısaldı. Beş ürün bir çeyrek içinde tek bir görsel dil altında birleştirildi.',
          'Die Design-to-Development-Zeit wurde um 40% reduziert. Alle fünf Produkte wurden innerhalb eines Quartals vereinheitlicht.'
        )
      }
    },
    {
      id:          '2',
      slug:        'ember-commerce',
      title:       ml('Ember Commerce'),
      category:    ml('E-Commerce'),
      description: ml(
        'A boutique fashion platform reimagined — editorial photography meets fluid interactions.',
        'Yeniden hayal edilen bir butik moda platformu — editoryal fotoğrafçılık akıcı etkileşimlerle buluşuyor.',
        'Eine neu gedachte Boutique-Modeplattform — redaktionelle Fotografie trifft auf flüssige Interaktionen.'
      ),
      year:     '2024',
      tags:     ['Nuxt', 'Motion', 'Shopify'],
      featured: true,
      imageUrl: '',
      link:     '',
      caseStudy: {
        problem:  ml(
          'An established fashion brand felt invisible online — generic Shopify template, no brand personality, high bounce rate.',
          'Köklü bir moda markası çevrimiçi görünmez hissediyordu — jenerik Shopify şablonu, marka kişiliği yok, yüksek çıkış oranı.',
          'Eine etablierte Modemarke fühlte sich online unsichtbar — generisches Shopify-Template, keine Markenpersönlichkeit.'
        ),
        approach: ml(
          'Designed a completely bespoke editorial layout system, integrating Shopify Storefront API with Nuxt for SSR performance.',
          'SSR performansı için Shopify Storefront API\'sini Nuxt ile entegre ederek tamamen özel bir editoryal düzen sistemi tasarlandı.',
          'Ein komplett maßgeschneidertes redaktionelles Layout-System wurde entwickelt, mit Shopify Storefront API und Nuxt für SSR-Performance.'
        ),
        solution: ml(
          'A custom-built storefront with editorial grid, cinematic photography presentation, fluid cart, and 98 Lighthouse score.',
          'Editoryal grid, sinematik fotoğraf sunumu, akıcı sepet ve 98 Lighthouse skoru ile özel inşa edilmiş bir mağaza.',
          'Ein maßgeschneidertes Storefront mit redaktionellem Grid, kinematografischer Fotopräsentation und einem Lighthouse-Score von 98.'
        ),
        result: ml(
          'Bounce rate dropped 28%. Average session time doubled. Conversion rate improved 18% in the first month.',
          'Çıkış oranı %28 düştü. Ortalama oturum süresi iki katına çıktı. Dönüşüm oranı ilk ayda %18 arttı.',
          'Die Absprungrate sank um 28%. Die durchschnittliche Sitzungsdauer verdoppelte sich. Die Konversionsrate verbesserte sich im ersten Monat um 18%.'
        )
      }
    },
    {
      id:          '3',
      slug:        'lumen-dashboard',
      title:       ml('Lumen Dashboard'),
      category:    ml('SaaS'),
      description: ml(
        'Real-time analytics platform for media studios. Dark mode first, data-dense but never cluttered.',
        'Medya stüdyoları için gerçek zamanlı analitik platform. Önce karanlık mod, veri yoğun ama asla dağınık değil.',
        'Echtzeit-Analyseplattform für Medienstudios. Dark Mode zuerst, datendicht aber niemals überladen.'
      ),
      year:     '2023',
      tags:     ['Vue', 'D3.js', 'WebSocket'],
      featured: false,
      imageUrl: '',
      link:     '',
      caseStudy: {
        problem:  ml(
          'Media studio teams had no unified view of live broadcast metrics — multiple disconnected tools, lag, and constant tab-switching.',
          'Medya stüdyosu ekiplerinin canlı yayın metrikleri için birleşik bir görünümü yoktu.',
          'Medienstudio-Teams hatten keine einheitliche Ansicht der Live-Broadcast-Metriken.'
        ),
        approach: ml(
          'Designed an information hierarchy that surfaces critical metrics instantly, with progressive disclosure for detail.',
          'Kritik metrikleri anında ortaya çıkaran ve ayrıntılar için aşamalı açıklama sunan bir bilgi hiyerarşisi tasarlandı.',
          'Eine Informationshierarchie wurde entwickelt, die kritische Metriken sofort sichtbar macht.'
        ),
        solution: ml(
          'Real-time WebSocket dashboard with D3.js visualisations, alert system, and configurable widget grid.',
          'D3.js görselleştirmeleri, uyarı sistemi ve yapılandırılabilir widget grid ile gerçek zamanlı WebSocket panosu.',
          'Echtzeit-WebSocket-Dashboard mit D3.js-Visualisierungen, Alarmsystem und konfigurierbarem Widget-Grid.'
        ),
        result: ml(
          'Teams reduced monitoring overhead by 35%. Incident detection time dropped from 8 minutes to under 90 seconds.',
          'Ekipler izleme yükünü %35 azalttı. Olay tespit süresi 8 dakikadan 90 saniyenin altına düştü.',
          'Teams reduzierten den Überwachungsaufwand um 35%. Die Vorfallserkennungszeit sank von 8 Minuten auf unter 90 Sekunden.'
        )
      }
    },
    {
      id:          '4',
      slug:        'archive-studio',
      title:       ml('Archive Studio'),
      category:    ml('Photography', 'Fotoğrafçılık', 'Fotografie'),
      description: ml(
        'Portfolio site for a documentary photographer — cinematic grid, no distractions.',
        'Bir belgesel fotoğrafçı için portföy sitesi — sinematik grid, dikkat dağıtıcı yok.',
        'Portfolio-Seite für einen Dokumentarfotografen — kinematografisches Grid, keine Ablenkungen.'
      ),
      year:     '2023',
      tags:     ['Nuxt', 'GSAP', 'Photography'],
      featured: false,
      imageUrl: '',
      link:     '',
      caseStudy: {
        problem:  ml(
          'A celebrated photographer had work worth seeing but a site that undermined it.',
          'Ünlü bir fotoğrafçının görmeye değer eserleri vardı ama site bunları zayıflatıyordu.',
          'Ein gefeierter Fotograf hatte sehenswerte Werke, aber eine Website, die ihnen schadete.'
        ),
        approach: ml(
          'Designed around the images: maximum whitespace, lazy loading, full-screen presentation with minimal chrome.',
          'Görseller etrafında tasarlandı: maksimum beyaz alan, lazy loading, minimal chrome ile tam ekran sunum.',
          'Rund um die Bilder gestaltet: maximaler Weißraum, Lazy Loading, Vollbild-Präsentation mit minimalem Chrome.'
        ),
        solution: ml(
          'A Nuxt-powered portfolio with cinematic image grid, smooth transitions, and print-ready contact sheet export.',
          'Sinematik görsel grid, yumuşak geçişler ve baskıya hazır iletişim sayfası dışa aktarımı ile Nuxt tabanlı portföy.',
          'Ein Nuxt-Portfolio mit kinematografischem Bild-Grid, sanften Übergängen und druckfertigem Kontaktbogenexport.'
        ),
        result: ml(
          'Three gallery inquiries within the first week of launch. Site featured in Awwwards honorable mentions.',
          'Lansmanın ilk haftasında üç galeri sorgusu. Site, Awwwards\'da itinayla belirtildi.',
          'Drei Galerieanfragen in der ersten Woche nach dem Launch. Website bei Awwwards ehrenhalber erwähnt.'
        )
      }
    }
  ])

  const process = ref<ProcessContent>({
    intro: ml('A simple, honest approach to every engagement.', 'Her iş için basit ve dürüst bir yaklaşım.', 'Ein einfacher, ehrlicher Ansatz für jedes Engagement.'),
    steps: [
      {
        number: '01',
        title:  ml('Discovery', 'Keşif', 'Entdeckung'),
        body:   ml(
          'Understanding the problem before touching a pixel. I ask questions most skip.',
          'Bir piksele dokunmadan önce sorunu anlamak. Çoğunun atladığı soruları soruyorum.',
          'Das Problem verstehen, bevor ich einen Pixel anfasse. Ich stelle Fragen, die die meisten überspringen.'
        )
      },
      {
        number: '02',
        title:  ml('Direction', 'Yön', 'Richtung'),
        body:   ml(
          'One clear creative direction, not three options. Decisive, reasoned, open to challenge.',
          'Üç seçenek değil, tek net bir yaratıcı yön. Kararlı, gerekçeli, tartışmaya açık.',
          'Eine klare kreative Richtung, nicht drei Optionen. Entschlossen, begründet, offen für Herausforderungen.'
        )
      },
      {
        number: '03',
        title:  ml('Craft', 'Zanaat', 'Handwerk'),
        body:   ml(
          'Design and engineering together from day one. No throwing over the fence.',
          'Tasarım ve mühendislik, birinci günden itibaren birlikte. Duvar üzerinden atma yok.',
          'Design und Engineering gemeinsam von Tag eins. Kein Überwerfen über den Zaun.'
        )
      },
      {
        number: '04',
        title:  ml('Deliver', 'Teslim', 'Liefern'),
        body:   ml(
          'Shipped work. Documented. Handed over properly. No loose ends.',
          'Gönderilmiş iş. Belgelenmiş. Doğru şekilde teslim edilmiş. Sarkık uç yok.',
          'Gelieferte Arbeit. Dokumentiert. Ordentlich übergeben. Keine losen Enden.'
        )
      }
    ]
  })

  const about = ref<AboutContent>({
    headline:   ml('Details\nmake the\ndifference.', 'Detaylar\nfark\nyaratır.', 'Details\nmachen den\nUnterschied.'),
    paragraphs: [
      ml(
        'I design and build digital experiences with intention — every decision deliberate, every detail earned.',
        'Dijital deneyimler tasarlıyorum ve inşa ediyorum — her karar kasıtlı, her detay kazanılmış.',
        'Ich gestalte und baue digitale Erlebnisse mit Absicht — jede Entscheidung bewusst, jedes Detail verdient.'
      ),
      ml(
        'With a background spanning interface design, design systems, and full-stack development, I bring both a designer\'s eye and an engineer\'s precision.',
        'Arayüz tasarımı, tasarım sistemleri ve full-stack geliştirme geçmişiyle hem tasarımcının bakışını hem de mühendis hassasiyetini getiriyorum.',
        'Mit einem Hintergrund in Interface-Design, Design-Systemen und Full-Stack-Entwicklung bringe ich sowohl das Auge eines Designers als auch die Präzision eines Ingenieurs mit.'
      )
    ],
    skills:       ['Interface Design', 'Design Systems', 'Vue / Nuxt', 'Motion Design', 'Typescript', 'Art Direction'],
    location:     'Remote, Worldwide',
    availability: ml('Available for select engagements', 'Seçili projeler için müsait', 'Verfügbar für ausgewählte Projekte')
  })

  const contact = ref<ContactContent>({
    headline:         ml('Let\'s make\nsomething real.', 'Gerçek bir şey\nyapalım.', 'Lass uns etwas\nEchtes schaffen.'),
    subline:          ml('Have a project in mind? I\'d love to hear about it.', 'Aklınızda bir proje mi var? Duymak isterim.', 'Haben Sie ein Projekt im Sinn? Ich würde es gerne hören.'),
    email:            'hello@yourname.com',
    socials:          [
      { label: 'GitHub',     url: 'https://github.com' },
      { label: 'LinkedIn',   url: 'https://linkedin.com' },
      { label: 'Twitter / X', url: 'https://x.com' }
    ],
    responseTime:     ml('Usually within 24 hours', 'Genellikle 24 saat içinde', 'Normalerweise innerhalb von 24 Stunden'),
    availabilityNote: ml('Open to new projects from Q3 2025', 'Q3 2025\'ten itibaren yeni projelere açık', 'Offen für neue Projekte ab Q3 2025'),
    stack:            'Vue · Nuxt · TypeScript · Figma · Node.js'
  })

  // ── Actions ──

  function updateHero(data: Partial<HeroContent>) {
    Object.assign(hero.value, data)
  }

  function updateAbout(data: Partial<AboutContent>) {
    Object.assign(about.value, data)
  }

  function updateContact(data: Partial<ContactContent>) {
    Object.assign(contact.value, data)
  }

  function updateProcess(data: Partial<ProcessContent>) {
    Object.assign(process.value, data)
  }

  function addProject(project: Omit<Project, 'id'>) {
    projects.value.push({ ...project, id: Date.now().toString() })
  }

  function updateProject(id: string, data: Partial<Project>) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      const p = projects.value[idx]
      if (p) Object.assign(p, data)
    }
  }

  function deleteProject(id: string) {
    projects.value = projects.value.filter(p => p.id !== id)
  }

  function reorderProjects(from: number, to: number) {
    const arr = [...projects.value]
    const [item] = arr.splice(from, 1)
    if (!item) return
    arr.splice(to, 0, item)
    projects.value = arr
  }

  // ── DB integration ──

  function loadFromConfig(config: Record<string, unknown>) {
    if (config.hero)     Object.assign(hero.value,    config.hero)
    if (config.projects) projects.value = config.projects as Project[]
    if (config.about)    Object.assign(about.value,   config.about)
    if (config.contact)  Object.assign(contact.value, config.contact)
    if (config.process)  Object.assign(process.value, config.process)
  }

  function getConfig() {
    return {
      hero:     hero.value,
      projects: projects.value,
      about:    about.value,
      contact:  contact.value,
      process:  process.value
    }
  }

  return {
    hero, projects, process, about, contact,
    updateHero, updateAbout, updateContact, updateProcess,
    addProject, updateProject, deleteProject, reorderProjects,
    loadFromConfig, getConfig
  }
})
