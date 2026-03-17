import type { Lang } from './translations'

export type ModalKey =
  | 'assessment'
  | 'modelo'
  | 'implementacion'
  | 'migracion'
  | 'pack-datos'
  | 'pack-omni'
  | 'pack-beauty'
  | 'pack-health'
  | 'ret-lite'
  | 'ret-std'
  | 'ret-plus'

export interface ModalEntry {
  tag: Record<Lang, string>
  title: Record<Lang, string>
  lead: Record<Lang, string>
  deliverables: Record<Lang, string[]>
  duration: Record<Lang, string>
}

export const modalData: Record<ModalKey, ModalEntry> = {
  assessment: {
    tag: { es: 'Servicio', ca: 'Servei', en: 'Service' },
    title: { es: 'Estrategia & Discovery', ca: 'Estratègia & Discovery', en: 'Strategy & Discovery' },
    lead: {
      es: 'Diagnóstico completo de tu ecosistema de datos de producto y diseño de la hoja de ruta PIM adaptada a tus objetivos de negocio.',
      ca: 'Diagnosi completa del teu ecosistema de dades de producte i disseny de la full de ruta PIM adaptada als teus objectius de negoci.',
      en: 'Complete diagnosis of your product data ecosystem and PIM roadmap design tailored to your business objectives.',
    },
    deliverables: {
      es: [
        'Análisis AS-IS del catálogo y sistemas existentes',
        'Mapa de stakeholders y flujos de datos',
        'Definición de KPIs de calidad de dato',
        'Hoja de ruta PIM priorizada (6-18 meses)',
        'Criterios de selección de plataforma (si aplica)',
        'Informe ejecutivo con quick wins',
      ],
      ca: [
        "Anàlisi AS-IS del catàleg i sistemes existents",
        "Mapa d'stakeholders i fluxos de dades",
        'Definició de KPIs de qualitat de dada',
        'Full de ruta PIM prioritzada (6-18 mesos)',
        'Criteris de selecció de plataforma (si aplica)',
        'Informe executiu amb quick wins',
      ],
      en: [
        'AS-IS analysis of catalog and existing systems',
        'Stakeholder map and data flows',
        'Data quality KPI definition',
        'Prioritized PIM roadmap (6-18 months)',
        'Platform selection criteria (if applicable)',
        'Executive report with quick wins',
      ],
    },
    duration: { es: '4–6 semanas · 8–15 días de consultoría', ca: '4–6 setmanes · 8–15 dies de consultoria', en: '4–6 weeks · 8–15 consulting days' },
  },
  modelo: {
    tag: { es: 'Servicio', ca: 'Servei', en: 'Service' },
    title: { es: 'Modelo de Datos & Gobierno', ca: 'Model de Dades & Govern', en: 'Data Model & Governance' },
    lead: {
      es: 'Diseño y documentación del modelo de datos de producto: taxonomías, familias, atributos, variantes y workflows de enriquecimiento.',
      ca: "Disseny i documentació del model de dades de producte: taxonomies, famílies, atributs, variants i workflows d'enriquiment.",
      en: 'Design and documentation of the product data model: taxonomies, families, attributes, variants and enrichment workflows.',
    },
    deliverables: {
      es: [
        'Taxonomía de categorías y familias de producto',
        'Diccionario de atributos con reglas de validación',
        'Matriz de completitud por canal',
        'Workflows de enriquecimiento y aprobación',
        'Políticas de gobierno de dato',
        'Guía de onboarding para el equipo',
      ],
      ca: [
        "Taxonomia de categories i famílies de producte",
        "Diccionari d'atributs amb regles de validació",
        'Matriu de completitud per canal',
        "Workflows d'enriquiment i aprovació",
        'Polítiques de govern de dada',
        "Guia d'onboarding per a l'equip",
      ],
      en: [
        'Category taxonomy and product families',
        'Attribute dictionary with validation rules',
        'Completeness matrix by channel',
        'Enrichment and approval workflows',
        'Data governance policies',
        'Onboarding guide for the team',
      ],
    },
    duration: { es: '6–10 semanas · 12–25 días de consultoría', ca: '6–10 setmanes · 12–25 dies de consultoria', en: '6–10 weeks · 12–25 consulting days' },
  },
  implementacion: {
    tag: { es: 'Servicio', ca: 'Servei', en: 'Service' },
    title: { es: 'Implementación & Integraciones', ca: 'Implementació & Integracions', en: 'Implementation & Integrations' },
    lead: {
      es: 'Configuración completa del PIM seleccionado, desarrollo de conectores con sistemas externos y automatización de flujos de datos.',
      ca: 'Configuració completa del PIM seleccionat, desenvolupament de connectors amb sistemes externs i automatització de fluxos de dades.',
      en: 'Complete configuration of the selected PIM, development of connectors with external systems and data flow automation.',
    },
    deliverables: {
      es: [
        'Configuración del modelo de datos en el PIM',
        'Conectores ERP, eCommerce y marketplaces',
        'Automatizaciones de enriquecimiento',
        'Tests de integración y UAT',
        'Documentación técnica y funcional',
        'Formación al equipo interno',
      ],
      ca: [
        'Configuració del model de dades al PIM',
        'Connectors ERP, eCommerce i marketplaces',
        "Automatitzacions d'enriquiment",
        "Tests d'integració i UAT",
        'Documentació tècnica i funcional',
        "Formació a l'equip intern",
      ],
      en: [
        'Data model configuration in PIM',
        'ERP, eCommerce and marketplace connectors',
        'Enrichment automations',
        'Integration tests and UAT',
        'Technical and functional documentation',
        'Internal team training',
      ],
    },
    duration: { es: 'Variable · 40–80 días de consultoría', ca: 'Variable · 40–80 dies de consultoria', en: 'Variable · 40–80 consulting days' },
  },
  migracion: {
    tag: { es: 'Servicio', ca: 'Servei', en: 'Service' },
    title: { es: 'Migración & Go-Live', ca: 'Migració & Go-Live', en: 'Migration & Go-Live' },
    lead: {
      es: 'Proceso completo de migración de datos legados al nuevo PIM: extracción, limpieza, transformación, carga y validación final.',
      ca: 'Procés complet de migració de dades llegades al nou PIM: extracció, neteja, transformació, càrrega i validació final.',
      en: 'Complete legacy data migration process to the new PIM: extraction, cleansing, transformation, loading and final validation.',
    },
    deliverables: {
      es: [
        'Análisis y mapeo de datos origen',
        'Scripts de limpieza y transformación',
        'Carga incremental con validaciones',
        'Checklist de go-live',
        'Soporte hipercare post-lanzamiento',
        'Informe de calidad de datos final',
      ],
      ca: [
        "Anàlisi i mapeig de dades origen",
        "Scripts de neteja i transformació",
        "Càrrega incremental amb validacions",
        'Checklist de go-live',
        "Suport hipercare post-llançament",
        "Informe de qualitat de dades final",
      ],
      en: [
        'Source data analysis and mapping',
        'Cleansing and transformation scripts',
        'Incremental loading with validations',
        'Go-live checklist',
        'Post-launch hypercare support',
        'Final data quality report',
      ],
    },
    duration: { es: '1–3 meses · 15–30 días de consultoría', ca: '1–3 mesos · 15–30 dies de consultoria', en: '1–3 months · 15–30 consulting days' },
  },
  'pack-datos': {
    tag: { es: 'Pack', ca: 'Pack', en: 'Pack' },
    title: { es: 'Pack Modelo de Datos + Taxonomía', ca: 'Pack Model de Dades + Taxonomia', en: 'Pack Data Model + Taxonomy' },
    lead: {
      es: 'Entrega rápida de un modelo de datos completo: taxonomía de categorías, familias de producto, atributos y reglas de completitud.',
      ca: "Entrega ràpida d'un model de dades complet: taxonomia de categories, famílies de producte, atributs i regles de completitud.",
      en: 'Fast delivery of a complete data model: category taxonomy, product families, attributes and completeness rules.',
    },
    deliverables: {
      es: [
        'Taxonomía de hasta 3 niveles jerárquicos',
        'Hasta 5 familias de producto configuradas',
        'Diccionario de atributos (hasta 150 atributos)',
        'Reglas de completitud por canal',
        'Documento de gobierno básico',
      ],
      ca: [
        "Taxonomia de fins a 3 nivells jeràrquics",
        "Fins a 5 famílies de producte configurades",
        "Diccionari d'atributs (fins a 150 atributs)",
        'Regles de completitud per canal',
        'Document de govern bàsic',
      ],
      en: [
        'Taxonomy up to 3 hierarchical levels',
        'Up to 5 configured product families',
        'Attribute dictionary (up to 150 attributes)',
        'Completeness rules per channel',
        'Basic governance document',
      ],
    },
    duration: { es: '3–5 semanas · 8–12 días', ca: '3–5 setmanes · 8–12 dies', en: '3–5 weeks · 8–12 days' },
  },
  'pack-omni': {
    tag: { es: 'Pack', ca: 'Pack', en: 'Pack' },
    title: { es: 'Pack Catálogo Omnicanal', ca: 'Pack Catàleg Omnicanal', en: 'Pack Omnichannel Catalogue' },
    lead: {
      es: 'Estructuración y enriquecimiento del catálogo para distribución omnicanal: web, marketplace, retail y exportaciones B2B.',
      ca: "Estructuració i enriquiment del catàleg per a distribució omnicanal: web, marketplace, retail i exportacions B2B.",
      en: 'Catalogue structuring and enrichment for omnichannel distribution: web, marketplace, retail and B2B exports.',
    },
    deliverables: {
      es: [
        'Modelo de datos optimizado por canal',
        'Configuración de canales de distribución',
        'Templates de exportación (hasta 3 canales)',
        'Automatizaciones de publicación',
        'Validaciones de calidad por canal',
      ],
      ca: [
        "Model de dades optimitzat per canal",
        "Configuració de canals de distribució",
        "Templates d'exportació (fins a 3 canals)",
        'Automatitzacions de publicació',
        'Validacions de qualitat per canal',
      ],
      en: [
        'Data model optimized per channel',
        'Distribution channel configuration',
        'Export templates (up to 3 channels)',
        'Publication automations',
        'Quality validations per channel',
      ],
    },
    duration: { es: '4–8 semanas · 10–18 días', ca: '4–8 setmanes · 10–18 dies', en: '4–8 weeks · 10–18 days' },
  },
  'pack-beauty': {
    tag: { es: 'Pack Especializado', ca: 'Pack Especialitzat', en: 'Specialized Pack' },
    title: { es: 'Pack Beauty Syndication / GDSN', ca: 'Pack Beauty Syndication / GDSN', en: 'Pack Beauty Syndication / GDSN' },
    lead: {
      es: 'Solución especializada para el sector belleza: sincronización de datos de producto con GS1, GDSN y retailers específicos del sector.',
      ca: "Solució especialitzada per al sector bellesa: sincronització de dades de producte amb GS1, GDSN i retailers específics del sector.",
      en: 'Specialized solution for the beauty sector: product data synchronization with GS1, GDSN and sector-specific retailers.',
    },
    deliverables: {
      es: [
        'Modelo de datos adaptado a estándares GS1',
        'Configuración de atributos GDSN/beauty',
        'Conectores con plataformas de syndication',
        'Validaciones regulatorias (ingredientes, INCI)',
        'Setup de flujos hacia retailers y farmacias',
        'Documentación de cumplimiento',
      ],
      ca: [
        "Model de dades adaptat a estàndards GS1",
        "Configuració d'atributs GDSN/beauty",
        "Connectors amb plataformes de syndication",
        "Validacions regulatòries (ingredients, INCI)",
        "Setup de fluxos cap a retailers i farmàcies",
        "Documentació de compliment",
      ],
      en: [
        'Data model adapted to GS1 standards',
        'GDSN/beauty attribute configuration',
        'Connectors with syndication platforms',
        'Regulatory validations (ingredients, INCI)',
        'Flow setup to retailers and pharmacies',
        'Compliance documentation',
      ],
    },
    duration: { es: '4–8 semanas · 10–20 días', ca: '4–8 setmanes · 10–20 dies', en: '4–8 weeks · 10–20 days' },
  },
  'pack-health': {
    tag: { es: 'Pack', ca: 'Pack', en: 'Pack' },
    title: { es: 'Pack PIM Health Check', ca: 'Pack PIM Health Check', en: 'Pack PIM Health Check' },
    lead: {
      es: 'Auditoría rápida del estado de tu PIM actual: calidad de datos, governance, integraciones y roadmap de mejoras prioritarias.',
      ca: "Auditoria ràpida de l'estat del teu PIM actual: qualitat de dades, governance, integracions i roadmap de millores prioritàries.",
      en: 'Quick audit of your current PIM state: data quality, governance, integrations and priority improvement roadmap.',
    },
    deliverables: {
      es: [
        'Auditoría de completitud y calidad de datos',
        'Revisión del modelo de datos y taxonomía',
        'Evaluación de integraciones activas',
        'Análisis de workflows y adopción del equipo',
        'Informe de hallazgos con scoring',
        'Plan de acción priorizado (quick wins + largo plazo)',
      ],
      ca: [
        "Auditoria de completitud i qualitat de dades",
        "Revisió del model de dades i taxonomia",
        "Avaluació d'integracions actives",
        "Anàlisi de workflows i adopció de l'equip",
        "Informe de troballes amb scoring",
        "Pla d'acció prioritzat (quick wins + llarg termini)",
      ],
      en: [
        'Completeness and data quality audit',
        'Data model and taxonomy review',
        'Active integrations assessment',
        'Workflows and team adoption analysis',
        'Findings report with scoring',
        'Prioritized action plan (quick wins + long term)',
      ],
    },
    duration: { es: '2–3 semanas · 4–8 días', ca: '2–3 setmanes · 4–8 dies', en: '2–3 weeks · 4–8 days' },
  },
  'ret-lite': {
    tag: { es: 'Retainer', ca: 'Retainer', en: 'Retainer' },
    title: { es: 'Retainer Lite', ca: 'Retainer Lite', en: 'Retainer Lite' },
    lead: {
      es: 'Soporte mensual ligero para equipos con PIM ya implementado. Ideal para resolver dudas puntuales, revisar cambios de modelo o acompañar evoluciones menores.',
      ca: "Suport mensual lleuger per a equips amb PIM ja implementat. Ideal per resoldre dubtes puntuals, revisar canvis de model o acompanyar evolucions menors.",
      en: 'Light monthly support for teams with an already implemented PIM. Ideal for resolving specific questions, reviewing model changes or supporting minor evolutions.',
    },
    deliverables: {
      es: [
        '8–12 horas/mes de consultoría',
        'Canal de comunicación directo (Slack/email)',
        'Revisión de cambios de modelo de datos',
        'Soporte en resolución de incidencias',
        'Informe mensual de actividad',
      ],
      ca: [
        "8–12 hores/mes de consultoria",
        "Canal de comunicació directe (Slack/email)",
        "Revisió de canvis de model de dades",
        "Suport en resolució d'incidències",
        "Informe mensual d'activitat",
      ],
      en: [
        '8–12 hours/month of consulting',
        'Direct communication channel (Slack/email)',
        'Data model change review',
        'Incident resolution support',
        'Monthly activity report',
      ],
    },
    duration: { es: 'Contrato mensual renovable', ca: 'Contracte mensual renovable', en: 'Renewable monthly contract' },
  },
  'ret-std': {
    tag: { es: 'Retainer', ca: 'Retainer', en: 'Retainer' },
    title: { es: 'Retainer Standard', ca: 'Retainer Standard', en: 'Retainer Standard' },
    lead: {
      es: 'Acompañamiento regular para equipos con proyectos PIM en evolución. Cobertura de gobierno de datos, nuevas integraciones y optimización continua.',
      ca: "Acompanyament regular per a equips amb projectes PIM en evolució. Cobertura de govern de dades, noves integracions i optimització contínua.",
      en: 'Regular accompaniment for teams with evolving PIM projects. Coverage of data governance, new integrations and continuous optimization.',
    },
    deliverables: {
      es: [
        '16–24 horas/mes de consultoría',
        'Sesiones quincenales de seguimiento',
        'Gobierno de datos continuo',
        'Soporte en nuevas integraciones',
        'Revisión y optimización del modelo',
        'Informe mensual de KPIs de calidad',
      ],
      ca: [
        "16–24 hores/mes de consultoria",
        "Sessions quinzenals de seguiment",
        "Govern de dades continu",
        "Suport en noves integracions",
        "Revisió i optimització del model",
        "Informe mensual de KPIs de qualitat",
      ],
      en: [
        '16–24 hours/month of consulting',
        'Bi-weekly follow-up sessions',
        'Continuous data governance',
        'New integrations support',
        'Model review and optimization',
        'Monthly quality KPIs report',
      ],
    },
    duration: { es: 'Contrato mensual renovable · Mínimo 3 meses', ca: 'Contracte mensual renovable · Mínim 3 mesos', en: 'Renewable monthly contract · Minimum 3 months' },
  },
  'ret-plus': {
    tag: { es: 'Retainer', ca: 'Retainer', en: 'Retainer' },
    title: { es: 'Retainer Plus', ca: 'Retainer Plus', en: 'Retainer Plus' },
    lead: {
      es: 'Soporte intensivo para entornos complejos, multi-marca o con alta carga de proyecto. Dedicación equivalente a un perfil semi-dedicado.',
      ca: "Suport intensiu per a entorns complexos, multi-marca o amb alta càrrega de projecte. Dedicació equivalent a un perfil semi-dedicat.",
      en: 'Intensive support for complex, multi-brand or high project load environments. Dedication equivalent to a semi-dedicated profile.',
    },
    deliverables: {
      es: [
        '32–48 horas/mes de consultoría',
        'Sesiones semanales de seguimiento',
        'Gestión de proyecto incluida',
        'Gobierno de datos y calidad avanzada',
        'Prioridad en respuesta (<4h en horario laboral)',
        'Acceso a workshops y formaciones',
      ],
      ca: [
        "32–48 hores/mes de consultoria",
        "Sessions setmanals de seguiment",
        "Gestió de projecte inclosa",
        "Govern de dades i qualitat avançada",
        "Prioritat en resposta (<4h en horari laboral)",
        "Accés a workshops i formacions",
      ],
      en: [
        '32–48 hours/month of consulting',
        'Weekly follow-up sessions',
        'Project management included',
        'Advanced data governance and quality',
        'Priority response (<4h during business hours)',
        'Access to workshops and training',
      ],
    },
    duration: { es: 'Contrato mensual renovable · Mínimo 3 meses', ca: 'Contracte mensual renovable · Mínim 3 mesos', en: 'Renewable monthly contract · Minimum 3 months' },
  },
}
