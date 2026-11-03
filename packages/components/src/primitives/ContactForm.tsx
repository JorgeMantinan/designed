'use client';

import { useMotion } from '@designed/animations';
import { useRef, useState } from 'react';
import type { AnimationInput } from '@designed/schema';

import { cx } from '../cx';

import s from './ContactForm.module.scss';

export interface ContactFormProps {
  id?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  buttonText?: string;
  /** Shown after a successful (simulated) submit — this MVP has no backend. */
  successMessage?: string;
  animation?: AnimationInput;
  className?: string;
}

/**
 * Contact form with native HTML5 validation (required + type=email).
 * On submit it simulates success and swaps in an accessible status message;
 * wiring a real endpoint is a one-liner in the exported project.
 */
export function ContactForm({
  id,
  namePlaceholder = 'Tu nombre',
  emailPlaceholder = 'Tu email',
  messagePlaceholder = 'Cuéntanos qué necesitas',
  buttonText = 'Enviar mensaje',
  successMessage = '¡Gracias! Te responderemos muy pronto.',
  animation,
  className,
}: ContactFormProps) {
  const ref = useRef<HTMLFormElement>(null);
  const motion = useMotion(animation, ref);
  const [sent, setSent] = useState(false);

  return (
    <form
      id={id}
      ref={ref}
      className={cx(s.form, motion.className, className)}
      data-hover={motion.hoverType}
      style={motion.style}
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      {sent ? (
        <p className={s.success} role="status">
          {successMessage}
        </p>
      ) : (
        <>
          <div className={s.row}>
            <label className={s.field}>
              <span className={s.label}>{namePlaceholder}</span>
              <input
                className={s.input}
                type="text"
                name="name"
                placeholder={namePlaceholder}
                required
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>{emailPlaceholder}</span>
              <input
                className={s.input}
                type="email"
                name="email"
                placeholder={emailPlaceholder}
                required
              />
            </label>
          </div>
          <label className={s.field}>
            <span className={s.label}>{messagePlaceholder}</span>
            <textarea
              className={s.textarea}
              name="message"
              placeholder={messagePlaceholder}
              rows={5}
              required
            />
          </label>
          <button className={s.submit} type="submit">
            {buttonText}
          </button>
        </>
      )}
    </form>
  );
}
