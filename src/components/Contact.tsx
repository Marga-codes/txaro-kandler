import { useState } from 'react'
import { contactLinks } from '../content'
import { ArrowRight, ContactIcon } from './Icons'
import { Reveal } from './Primitives'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const DISPOSABLE = new Set([
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'tempmail.com',
  'temp-mail.org',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'maildrop.cc',
])

const emailFormatOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

async function domainReceivesMail(domain: string) {
  const query = async (type: string) => {
    const r = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`
    )
    if (!r.ok) throw new Error('dns')
    return (await r.json()).Answer || []
  }
  if ((await query('MX')).length) return true
  if ((await query('A')).length) return true
  return false
}

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [note, setNote] = useState('')
  const [emailError, setEmailError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    if (data.get('_honey')) return

    const email = String(data.get('email') ?? '').trim()
    if (!emailFormatOk(email)) {
      setEmailError('Introduce un email válido (nombre@dominio.com).')
      return
    }
    setEmailError('')

    const domain = email.split('@')[1].toLowerCase()
    if (DISPOSABLE.has(domain)) {
      setEmailError('No se aceptan direcciones de email temporales.')
      return
    }

    try {
      if (!(await domainReceivesMail(domain))) {
        setEmailError('Ese dominio no existe o no puede recibir mensajes.')
        return
      }
    } catch {
      // Sin DNS disponible no se bloquea el envío.
    }

    setStatus('sending')
    setNote('Verificando el dominio...')

    try {
      const res = await fetch(
        'https://formsubmit.co/ajax/txarokandler@gmail.com',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(data.entries())),
        }
      )
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus('sent')
      setNote('Mensaje enviado. Te responderé lo antes posible.')
    } catch {
      setStatus('error')
      setNote(
        'No se pudo enviar. Escríbeme directamente a txarokandler@gmail.com o por WhatsApp.'
      )
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="shell contact-inner">
        <Reveal>
          <div className="section-head">
            <h2 className="section-title">
              Trabajemos <em>juntos</em>
            </h2>
          </div>

          <form className="form" onSubmit={onSubmit} noValidate>
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              hidden
            />
            <input type="hidden" name="_subject" value="Contacto web, Txaro Kandler" />
            <input type="hidden" name="_template" value="table" />
            <input
              type="hidden"
              name="_autoresponse"
              value="Gracias por tu mensaje. Te responderé lo antes posible."
            />

            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={emailError ? 'true' : undefined}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p className="field-error" id="email-error">
                  {emailError}
                </p>
              )}
            </div>

            <div className="field">
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" name="message" rows={4} required />
            </div>

            <button className="form-submit" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              <ArrowRight size={14} />
            </button>

            <p className="form-status" role="status" aria-live="polite">
              {note}
            </p>
          </form>
        </Reveal>

        <Reveal delay={120}>
          <div className="contact-info">
            <h3>Información de contacto</h3>
            <p>
              Para consultas profesionales, representación o colaboraciones, no
              dudes en contactarme.
            </p>
            <div className="contact-links">
              {contactLinks.map(l => (
                <a
                  key={l.href}
                  className="contact-link"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ContactIcon name={l.icon} size={18} />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}