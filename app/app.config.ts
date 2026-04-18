export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      neutral: 'neutral'
    },

    button: {
      slots: {
        base: [
          'font-body tracking-wide transition-all duration-250',
          'cursor-pointer rounded-[var(--radius-md)]'
        ]
      },
      variants: {
        variant: {
          solid: 'bg-[var(--dusk-primary)] text-[var(--dusk-bg)] hover:bg-[var(--dusk-primary-dark)] shadow-sm',
          outline: 'border border-[var(--dusk-border)] text-[var(--dusk-text)] hover:border-[var(--dusk-primary)] hover:text-[var(--dusk-primary)] bg-transparent',
          ghost: 'text-[var(--dusk-text-secondary)] hover:text-[var(--dusk-primary)] hover:bg-[var(--dusk-primary-glow)] bg-transparent',
          soft: 'bg-[var(--dusk-surface-alt)] text-[var(--dusk-text)] hover:bg-[var(--dusk-border)]'
        }
      }
    },

    card: {
      slots: {
        root: 'bg-[var(--dusk-surface)] border border-[var(--dusk-border)] rounded-[var(--radius-lg)] overflow-hidden',
        header: 'px-6 pt-6 pb-0',
        body: 'p-6',
        footer: 'px-6 pb-6 pt-0'
      }
    },

    input: {
      slots: {
        root: 'w-full',
        base: [
          'bg-[var(--dusk-surface)] border border-[var(--dusk-border)]',
          'text-[var(--dusk-text)] placeholder:text-[var(--dusk-text-faint)]',
          'rounded-[var(--radius-md)] transition-colors duration-150',
          'focus:border-[var(--dusk-primary)] focus:ring-1 focus:ring-[var(--dusk-primary)]'
        ]
      }
    }
  }
})
