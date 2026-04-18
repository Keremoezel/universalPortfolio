<template>
  <div class="content-editor">

    <!-- ── Content language switcher ── -->
    <div class="admin-lang-bar">
      <span class="admin-lang-label">Edit language:</span>
      <div class="admin-lang-tabs">
        <button
          v-for="l in adminLangs"
          :key="l.code"
          class="admin-lang-btn"
          :class="{ active: adminLang === l.code }"
          @click="adminLang = l.code as Lang"
        >
          {{ l.label }}
        </button>
      </div>
    </div>

    <!-- Tab nav -->
    <div class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── HERO ── -->
    <div v-if="activeTab === 'hero'" class="tab-content">
      <div class="form-grid">
        <div class="form-field full">
          <label class="form-label">Your Name — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(heroForm.name)" type="text" class="form-input" @change="e => { heroForm.name = mlSet(heroForm.name, (e.target as HTMLInputElement).value); saveHero() }" />
        </div>
        <div class="form-field full">
          <label class="form-label">Tagline (use ↵ for line breaks) — {{ adminLang.toUpperCase() }}</label>
          <textarea :value="mlGet(heroForm.tagline)" class="form-textarea" rows="3" @change="e => { heroForm.tagline = mlSet(heroForm.tagline, (e.target as HTMLTextAreaElement).value); saveHero() }" />
        </div>
        <div class="form-field full">
          <label class="form-label">Subline — {{ adminLang.toUpperCase() }}</label>
          <textarea :value="mlGet(heroForm.subline)" class="form-textarea" rows="2" @change="e => { heroForm.subline = mlSet(heroForm.subline, (e.target as HTMLTextAreaElement).value); saveHero() }" />
        </div>
        <div class="form-field">
          <label class="form-label">CTA Button Label — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(heroForm.ctaLabel)" type="text" class="form-input" @change="e => { heroForm.ctaLabel = mlSet(heroForm.ctaLabel, (e.target as HTMLInputElement).value); saveHero() }" />
        </div>
        <div class="form-field">
          <label class="form-label">CTA Link (URL, not translated)</label>
          <input v-model="heroForm.ctaLink" type="text" class="form-input" @change="saveHero" />
        </div>
      </div>
      <button class="save-btn" @click="saveHero">Save Hero</button>
    </div>

    <!-- ── PROJECTS ── -->
    <div v-if="activeTab === 'projects'" class="tab-content">
      <div class="projects-list">
        <div
          v-for="project in contentStore.projects"
          :key="project.id"
          class="project-item"
          :class="{ expanded: expandedProject === project.id }"
        >
          <div class="project-item-header" @click="toggleProject(project.id)">
            <div class="project-item-info">
              <div class="project-item-badges">
                <span v-if="project.featured" class="badge badge-featured">Featured</span>
              </div>
              <span class="project-item-title">{{ mlGet(project.title) }}</span>
              <span class="project-item-cat">{{ mlGet(project.category) }} · {{ project.year }}</span>
            </div>
            <div class="project-item-actions">
              <button class="icon-btn danger" title="Delete" @click.stop="deleteProject(project.id)">✕</button>
              <span class="expand-icon">{{ expandedProject === project.id ? '−' : '+' }}</span>
            </div>
          </div>

          <div v-if="expandedProject === project.id" class="project-item-form">

            <!-- Core info -->
            <div class="form-section-label">Core Info</div>
            <div class="form-grid">
              <div class="form-field">
                <label class="form-label">Title — {{ adminLang.toUpperCase() }}</label>
                <input :value="mlGet(project.title)" type="text" class="form-input" @change="e => patchMLProject(project.id, 'title', (e.target as HTMLInputElement).value)" />
              </div>
              <div class="form-field">
                <label class="form-label">Slug (URL — not translated)</label>
                <input :value="project.slug" type="text" class="form-input" placeholder="my-project-name" @change="e => patchProject(project.id, 'slug', (e.target as HTMLInputElement).value)" />
              </div>
              <div class="form-field">
                <label class="form-label">Category — {{ adminLang.toUpperCase() }}</label>
                <input :value="mlGet(project.category)" type="text" class="form-input" @change="e => patchMLProject(project.id, 'category', (e.target as HTMLInputElement).value)" />
              </div>
              <div class="form-field">
                <label class="form-label">Year</label>
                <input :value="project.year" type="text" class="form-input" @change="e => patchProject(project.id, 'year', (e.target as HTMLInputElement).value)" />
              </div>
              <div class="form-field full">
                <label class="form-label">Description — {{ adminLang.toUpperCase() }}</label>
                <textarea :value="mlGet(project.description)" class="form-textarea" rows="3" @change="e => patchMLProject(project.id, 'description', (e.target as HTMLTextAreaElement).value)" />
              </div>
              <div class="form-field">
                <label class="form-label">Tags (comma separated)</label>
                <input :value="project.tags.join(', ')" type="text" class="form-input" @change="e => patchProject(project.id, 'tags', (e.target as HTMLInputElement).value.split(',').map(t => t.trim()))" />
              </div>
              <div class="form-field form-field-toggle">
                <label class="form-label">Featured Project</label>
                <label class="toggle-switch">
                  <input
                    type="checkbox"
                    :checked="project.featured"
                    @change="e => patchProject(project.id, 'featured', (e.target as HTMLInputElement).checked)"
                  />
                  <span class="toggle-track">
                    <span class="toggle-thumb" />
                  </span>
                  <span class="toggle-label">{{ project.featured ? 'Yes — shown prominently' : 'No — shown in grid' }}</span>
                </label>
              </div>
            </div>

            <!-- Media & links -->
            <div class="form-section-label">Media & Links</div>
            <div class="form-grid">
              <div class="form-field full">
                <label class="form-label">Image URL</label>
                <input :value="project.imageUrl ?? ''" type="url" class="form-input" placeholder="https://..." @change="e => patchProject(project.id, 'imageUrl', (e.target as HTMLInputElement).value)" />
              </div>
              <div class="form-field full">
                <label class="form-label">Live Project Link</label>
                <input :value="project.link ?? ''" type="url" class="form-input" placeholder="https://..." @change="e => patchProject(project.id, 'link', (e.target as HTMLInputElement).value)" />
              </div>
              <div class="form-field full">
                <label class="form-label">Case Study Route Preview</label>
                <div class="route-preview">/project/{{ project.slug || 'your-slug' }}</div>
              </div>
            </div>

            <!-- Case study -->
            <div class="form-section-label">Case Study</div>
            <div class="form-grid">
              <div class="form-field full">
                <label class="form-label">01 — The Problem — {{ adminLang.toUpperCase() }}</label>
                <textarea
                  :value="mlGet(project.caseStudy?.problem)"
                  class="form-textarea"
                  rows="3"
                  placeholder="What was broken, missing, or painful?"
                  @change="e => patchCaseStudy(project.id, 'problem', (e.target as HTMLTextAreaElement).value)"
                />
              </div>
              <div class="form-field full">
                <label class="form-label">02 — The Approach — {{ adminLang.toUpperCase() }}</label>
                <textarea
                  :value="mlGet(project.caseStudy?.approach)"
                  class="form-textarea"
                  rows="3"
                  placeholder="How did you think through the solution?"
                  @change="e => patchCaseStudy(project.id, 'approach', (e.target as HTMLTextAreaElement).value)"
                />
              </div>
              <div class="form-field full">
                <label class="form-label">03 — The Solution — {{ adminLang.toUpperCase() }}</label>
                <textarea
                  :value="mlGet(project.caseStudy?.solution)"
                  class="form-textarea"
                  rows="3"
                  placeholder="What was built or designed?"
                  @change="e => patchCaseStudy(project.id, 'solution', (e.target as HTMLTextAreaElement).value)"
                />
              </div>
              <div class="form-field full">
                <label class="form-label">04 — The Result — {{ adminLang.toUpperCase() }}</label>
                <textarea
                  :value="mlGet(project.caseStudy?.result)"
                  class="form-textarea"
                  rows="3"
                  placeholder="Measurable outcomes, impact, or recognition."
                  @change="e => patchCaseStudy(project.id, 'result', (e.target as HTMLTextAreaElement).value)"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <button class="add-btn" @click="addProject">+ Add Project</button>
    </div>

    <!-- ── PROCESS ── -->
    <div v-if="activeTab === 'process'" class="tab-content">
      <div class="form-grid">
        <div class="form-field full">
          <label class="form-label">Section Intro — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(processForm.intro)" type="text" class="form-input" @change="e => { processForm.intro = mlSet(processForm.intro, (e.target as HTMLInputElement).value); saveProcess() }" />
        </div>
      </div>

      <div class="form-section-label">Process Steps</div>
      <div class="process-steps-list">
        <div v-for="(step, i) in processForm.steps" :key="i" class="process-step-item">
          <div class="process-step-controls">
            <span class="process-step-num">{{ step.number }}</span>
            <button class="icon-btn danger" title="Remove step" @click="removeProcessStep(i)">✕</button>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Number Label</label>
              <input v-model="step.number" type="text" class="form-input" style="max-width:80px" @change="saveProcess" />
            </div>
            <div class="form-field">
              <label class="form-label">Title — {{ adminLang.toUpperCase() }}</label>
              <input :value="mlGet(step.title)" type="text" class="form-input" @change="e => { step.title = mlSet(step.title, (e.target as HTMLInputElement).value); saveProcess() }" />
            </div>
            <div class="form-field full">
              <label class="form-label">Body — {{ adminLang.toUpperCase() }}</label>
              <textarea :value="mlGet(step.body)" class="form-textarea" rows="2" @change="e => { step.body = mlSet(step.body, (e.target as HTMLTextAreaElement).value); saveProcess() }" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions-row">
        <button class="add-btn" @click="addProcessStep">+ Add Step</button>
        <button class="save-btn" @click="saveProcess">Save Process</button>
      </div>
    </div>

    <!-- ── ABOUT ── -->
    <div v-if="activeTab === 'about'" class="tab-content">
      <div class="form-grid">
        <div class="form-field full">
          <label class="form-label">Headline (use ↵ for line breaks) — {{ adminLang.toUpperCase() }}</label>
          <textarea :value="mlGet(aboutForm.headline)" class="form-textarea" rows="3" @change="e => { aboutForm.headline = mlSet(aboutForm.headline, (e.target as HTMLTextAreaElement).value); saveAbout() }" />
        </div>
        <div class="form-field full">
          <label class="form-label">Paragraph 1 — {{ adminLang.toUpperCase() }}</label>
          <textarea :value="mlGet(aboutForm.paragraphs[0])" class="form-textarea" rows="3" @change="e => { aboutForm.paragraphs[0] = mlSet(aboutForm.paragraphs[0], (e.target as HTMLTextAreaElement).value); saveAbout() }" />
        </div>
        <div class="form-field full">
          <label class="form-label">Paragraph 2 — {{ adminLang.toUpperCase() }}</label>
          <textarea :value="mlGet(aboutForm.paragraphs[1])" class="form-textarea" rows="3" @change="e => { aboutForm.paragraphs[1] = mlSet(aboutForm.paragraphs[1], (e.target as HTMLTextAreaElement).value); saveAbout() }" />
        </div>
        <div class="form-field">
          <label class="form-label">Skills (comma separated — not translated)</label>
          <input :value="aboutForm.skills.join(', ')" type="text" class="form-input" @change="e => { aboutForm.skills = (e.target as HTMLInputElement).value.split(',').map(s => s.trim()); saveAbout() }" />
        </div>
        <div class="form-field">
          <label class="form-label">Location (not translated)</label>
          <input v-model="aboutForm.location" type="text" class="form-input" @change="saveAbout" />
        </div>
        <div class="form-field full">
          <label class="form-label">Availability — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(aboutForm.availability)" type="text" class="form-input" @change="e => { aboutForm.availability = mlSet(aboutForm.availability, (e.target as HTMLInputElement).value); saveAbout() }" />
        </div>
      </div>
      <button class="save-btn" @click="saveAbout">Save About</button>
    </div>

    <!-- ── CONTACT ── -->
    <div v-if="activeTab === 'contact'" class="tab-content">
      <div class="form-grid">
        <div class="form-field full">
          <label class="form-label">Headline (use ↵ for line breaks) — {{ adminLang.toUpperCase() }}</label>
          <textarea :value="mlGet(contactForm.headline)" class="form-textarea" rows="3" @change="e => { contactForm.headline = mlSet(contactForm.headline, (e.target as HTMLTextAreaElement).value); saveContact() }" />
        </div>
        <div class="form-field full">
          <label class="form-label">Subline — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(contactForm.subline)" type="text" class="form-input" @change="e => { contactForm.subline = mlSet(contactForm.subline, (e.target as HTMLInputElement).value); saveContact() }" />
        </div>
        <div class="form-field">
          <label class="form-label">Email (not translated)</label>
          <input v-model="contactForm.email" type="email" class="form-input" @change="saveContact" />
        </div>
      </div>

      <div class="form-section-label">Trust Signals</div>
      <div class="form-grid">
        <div class="form-field">
          <label class="form-label">Response Time — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(contactForm.responseTime)" type="text" class="form-input" @change="e => { contactForm.responseTime = mlSet(contactForm.responseTime, (e.target as HTMLInputElement).value); saveContact() }" />
        </div>
        <div class="form-field">
          <label class="form-label">Availability Note — {{ adminLang.toUpperCase() }}</label>
          <input :value="mlGet(contactForm.availabilityNote)" type="text" class="form-input" @change="e => { contactForm.availabilityNote = mlSet(contactForm.availabilityNote, (e.target as HTMLInputElement).value); saveContact() }" />
        </div>
        <div class="form-field full">
          <label class="form-label">Stack / Tools (not translated)</label>
          <input v-model="contactForm.stack" type="text" class="form-input" @change="saveContact" />
        </div>
      </div>

      <button class="save-btn" @click="saveContact">Save Contact</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CaseStudy, MLString } from '~/stores/content'

definePageMeta({ layout: 'admin' })

const contentStore = useContentStore()

// ── Admin language selection ──
type Lang = 'en' | 'tr' | 'de'
const adminLang = ref<Lang>('en')
const adminLangs = [
  { code: 'en', label: 'EN — English' },
  { code: 'tr', label: 'TR — Türkçe' },
  { code: 'de', label: 'DE — Deutsch' }
]

// Helper: get current-lang value from an MLString
function mlGet(field: MLString | undefined): string {
  if (!field) return ''
  return field[adminLang.value] ?? field.en ?? ''
}

// Helper: return updated MLString with current-lang value set
function mlSet(field: MLString | undefined, value: string): MLString {
  const base = field ?? { en: '', tr: '', de: '' }
  return { ...base, [adminLang.value]: value }
}

const tabs = [
  { key: 'hero',     label: 'Hero' },
  { key: 'projects', label: 'Projects' },
  { key: 'process',  label: 'Process' },
  { key: 'about',    label: 'About' },
  { key: 'contact',  label: 'Contact' }
]

const activeTab       = ref('hero')
const expandedProject = ref<string | null>(null)

// Reactive local forms (full MLString objects)
const heroForm    = reactive({ ...contentStore.hero })
const aboutForm   = reactive({
  ...contentStore.about,
  paragraphs: contentStore.about.paragraphs.map(p => ({ ...p })),
  skills:     [...contentStore.about.skills]
})
const contactForm = reactive({ ...contentStore.contact })
const processForm = reactive({
  intro: { ...contentStore.process.intro },
  steps: contentStore.process.steps.map(s => ({ ...s, title: { ...s.title }, body: { ...s.body } }))
})

// Saves
function saveHero()    { contentStore.updateHero({ ...heroForm }) }
function saveAbout()   { contentStore.updateAbout({ ...aboutForm, paragraphs: aboutForm.paragraphs.map(p => ({ ...p })) }) }
function saveContact() { contentStore.updateContact({ ...contactForm }) }
function saveProcess() { contentStore.updateProcess({ ...processForm, steps: processForm.steps.map(s => ({ ...s })) }) }

// Project
function toggleProject(id: string) {
  expandedProject.value = expandedProject.value === id ? null : id
}

function patchProject(id: string, key: string, value: any) {
  contentStore.updateProject(id, { [key]: value })
}

// Patch an MLString field on a project for the current adminLang
function patchMLProject(id: string, key: string, value: string) {
  const project = contentStore.projects.find(p => p.id === id)
  if (!project) return
  const existing = (project as any)[key] as MLString | undefined
  contentStore.updateProject(id, { [key]: mlSet(existing, value) })
}

function patchCaseStudy(id: string, csKey: keyof CaseStudy, value: string) {
  const project = contentStore.projects.find(p => p.id === id)
  if (!project) return
  const existing = project.caseStudy ?? {
    problem:  { en: '', tr: '', de: '' },
    approach: { en: '', tr: '', de: '' },
    solution: { en: '', tr: '', de: '' },
    result:   { en: '', tr: '', de: '' }
  }
  contentStore.updateProject(id, {
    caseStudy: { ...existing, [csKey]: mlSet(existing[csKey], value) }
  })
}

function deleteProject(id: string) {
  if (confirm('Delete this project?')) {
    contentStore.deleteProject(id)
    if (expandedProject.value === id) expandedProject.value = null
  }
}

function addProject() {
  const empty: MLString = { en: '', tr: '', de: '' }
  contentStore.addProject({
    slug:        'new-project',
    title:       { en: 'New Project', tr: 'Yeni Proje', de: 'Neues Projekt' },
    category:    { en: 'Category', tr: 'Kategori', de: 'Kategorie' },
    description: empty,
    year:        new Date().getFullYear().toString(),
    tags:        ['Tag'],
    featured:    false,
    imageUrl:    '',
    link:        '',
    caseStudy: {
      problem:  empty,
      approach: empty,
      solution: empty,
      result:   empty
    }
  })
}

// Process steps
function addProcessStep() {
  const num = String(processForm.steps.length + 1).padStart(2, '0')
  const empty: MLString = { en: '', tr: '', de: '' }
  processForm.steps.push({ number: num, title: { en: 'New Step', tr: '', de: '' }, body: empty })
  saveProcess()
}

function removeProcessStep(i: number) {
  processForm.steps.splice(i, 1)
  saveProcess()
}
</script>


<style scoped>
.content-editor { display: flex; flex-direction: column; gap: var(--space-6); }

/* Admin language bar */
.admin-lang-bar {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: color-mix(in srgb, var(--dusk-primary) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--dusk-primary) 18%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-5);
}

.admin-lang-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-faint);
}

.admin-lang-tabs {
  display: flex;
  gap: var(--space-1);
}

.admin-lang-btn {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dusk-text-muted);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-3);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.admin-lang-btn:hover { color: var(--dusk-text); border-color: var(--dusk-border-muted); }

.admin-lang-btn.active {
  color: var(--dusk-primary);
  background: color-mix(in srgb, var(--dusk-primary) 10%, transparent);
  border-color: color-mix(in srgb, var(--dusk-primary) 30%, transparent);
}

/* Tabs */
.tab-nav {
  display: flex;
  gap: var(--space-1);
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-1);
  flex-wrap: wrap;
}

.tab-btn {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
  letter-spacing: var(--tracking-normal);
  white-space: nowrap;
}

.tab-btn:hover { color: var(--dusk-text); }

.tab-btn.active {
  background: var(--dusk-surface-alt);
  color: var(--dusk-primary);
  border: 1px solid var(--dusk-border-muted);
}

.tab-content {
  background: var(--dusk-surface);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-primary);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--dusk-border-muted);
  margin-top: var(--space-2);
}

.form-field { display: flex; flex-direction: column; gap: var(--space-2); }
.form-field.full { grid-column: 1 / -1; }

.form-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--dusk-text-muted);
}

.form-input, .form-textarea {
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  color: var(--dusk-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-3);
  outline: none;
  width: 100%;
  transition: border-color var(--duration-fast) var(--ease-smooth);
  resize: vertical;
}

.form-input:focus, .form-textarea:focus { border-color: var(--dusk-primary); }

/* Toggle */
.form-field-toggle { grid-column: 1 / -1; }

.toggle-switch {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}

.toggle-switch input { display: none; }

.toggle-track {
  width: 40px;
  height: 22px;
  background: var(--dusk-border);
  border-radius: var(--radius-full);
  position: relative;
  transition: background 0.25s ease;
  flex-shrink: 0;
}

.toggle-switch input:checked + .toggle-track { background: var(--dusk-primary); }

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: var(--radius-full);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toggle-switch input:checked + .toggle-track .toggle-thumb { transform: translateX(18px); }

.toggle-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text-muted);
}

/* Route preview */
.route-preview {
  background: var(--dusk-bg-deep);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  color: var(--dusk-primary);
  letter-spacing: 0.05em;
}

/* Badge */
.project-item-badges { display: flex; gap: var(--space-2); margin-bottom: 4px; }

.badge {
  font-family: var(--font-body);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}

.badge-featured {
  background: color-mix(in srgb, var(--dusk-primary) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--dusk-primary) 30%, transparent);
  color: var(--dusk-primary);
}

/* Save/Add */
.save-btn {
  align-self: flex-start;
  padding: var(--space-2) var(--space-6);
  background: var(--dusk-primary);
  color: var(--dusk-bg);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-smooth);
}

.save-btn:hover { background: var(--dusk-primary-dark); }

.form-actions-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Projects */
.projects-list { display: flex; flex-direction: column; gap: var(--space-2); }

.project-item {
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--duration-fast) var(--ease-smooth);
}

.project-item.expanded { border-color: var(--dusk-primary); }

.project-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  cursor: pointer;
}

.project-item-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--dusk-text);
}

.project-item-cat {
  font-size: var(--text-xs);
  color: var(--dusk-text-faint);
}

.project-item-info { display: flex; flex-direction: column; gap: 2px; }
.project-item-actions { display: flex; align-items: center; gap: var(--space-3); }

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--dusk-text-faint);
  transition: color var(--duration-fast) var(--ease-smooth);
  padding: 2px var(--space-1);
}

.icon-btn.danger:hover { color: var(--dusk-accent); }

.expand-icon {
  color: var(--dusk-text-muted);
  font-size: var(--text-lg);
  line-height: 1;
}

.project-item-form {
  padding: var(--space-5);
  border-top: 1px solid var(--dusk-border-muted);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.add-btn {
  align-self: flex-start;
  padding: var(--space-2) var(--space-5);
  background: transparent;
  border: 1px dashed var(--dusk-border);
  border-radius: var(--radius-md);
  color: var(--dusk-text-muted);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);
}

.add-btn:hover { border-color: var(--dusk-primary); color: var(--dusk-primary); }

/* Process */
.process-steps-list { display: flex; flex-direction: column; gap: var(--space-4); }

.process-step-item {
  background: var(--dusk-bg);
  border: 1px solid var(--dusk-border-muted);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.process-step-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.process-step-num {
  font-family: 'Courier New', monospace;
  font-size: var(--text-xs);
  color: var(--dusk-primary);
  letter-spacing: 0.15em;
}

@media (max-width: 700px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-field.full { grid-column: auto; }
  .tab-btn { font-size: var(--text-xs); padding: var(--space-2); }
}
</style>
