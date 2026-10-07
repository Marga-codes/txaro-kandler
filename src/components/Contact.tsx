import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { delayStyle } from './Primitives'
import {
  FilmaffinityIcon,
  ImdbIcon,
  InstagramIcon,
  SendIcon,
  WhatsappIcon,
} from './Icons'

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
      'https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=' + type
    )
    if (!r.ok) throw new Error('dns')
    return (await r.json()).Answer || []
  }
  if ((await query('MX')).length) return true
  if ((await query('A')).length) return true
  return false
}

async function emailError(v: string) {
  const domain = v.split('@')[1].toLowerCase()
  if (DISPOSABLE.has(domain)) return 'No se aceptan direcciones de email temporales.'
  try {
    if (!(await domainReceivesMail(domain)))
      return 'Ese dominio de email no existe o no puede recibir mensajes. Revisa la dirección.'
  } catch {
    return null
  }
  return null
}

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState<{ msg: string; isError: boolean } | null>(null)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current
    const email = emailRef.current
    if (!form || !email) return
    if ((form.querySelector('[name="_honey"]') as HTMLInputElement)?.value) return

    const value = email.value.trim()
    if (!emailFormatOk(value)) {
      email.setAttribute('aria-invalid', 'true')
      email.focus()
      setNote({ msg: 'Introduce un email válido (nombre@dominio.com).', isError: true })
      return
    }

    setSending(true)
    setNote(null)
    const errorMsg = await emailError(value)
    if (errorMsg) {
      setSending(false)
      email.setAttribute('aria-invalid', 'true')
      setNote({ msg: errorMsg, isError: true })
      return
    }
    email.removeAttribute('aria-invalid')

    try {
      const data = Object.fromEntries(new FormData(form).entries())
      const res = await fetch('https://formsubmit.co/ajax/txarokandler@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setNote({ msg: 'Mensaje enviado. Te responderé lo antes posible.', isError: false })
    } catch {
      setNote({
        msg: 'No se pudo enviar. Escríbeme directamente a txarokandler@gmail.com o por WhatsApp.',
        isError: true,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <form className="contact-form reveal" id="contact-form" ref={formRef} onSubmit={handleSubmit}>
        <p className="section-label">Contacto</p>
        <h2 className="section-title">
          Trabajemos <em>juntos</em>
        </h2>
        <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="_subject" value="Contacto web — Txaro Kandler" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input
          type="hidden"
          name="_autoresponse"
          value="Gracias por tu mensaje. Te responderé lo antes posible."
        />
        <div className="form-row">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" name="name" placeholder="Tu nombre" autoComplete="name" required />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            name="email"
            placeholder="tu@email.com"
            autoComplete="email"
            required
            onInput={e => {
              e.currentTarget.removeAttribute('aria-invalid')
              setNote(n => (n?.isError ? null : n))
            }}
          />
        </div>
        <div className="form-row form-row--area">
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Cuéntame sobre tu proyecto..."
            required
          />
        </div>
        <button type="submit" className="form-submit" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar mensaje'}
          <SendIcon size={14} />
        </button>
        <p
          className={`form-note${note?.isError ? ' is-error' : ''}`}
          id="form-note"
          role="status"
          aria-live="polite"
        >
          {note?.msg ?? ''}
        </p>
      </form>

      <div className="contact-info reveal" style={delayStyle(120)}>
        <h3>Información de contacto</h3>
        <p>
          Para consultas profesionales, representacion o colaboraciones, no dudes
          en contactarme.
        </p>
        <div className="contact-links">
          <a href="https://www.instagram.com/txarokandler/" className="contact-link" target="_blank" rel="noreferrer">
            <InstagramIcon size={18} />
            @txarokandler
          </a>
          <a href="https://wa.me/34678857374" className="contact-link" target="_blank" rel="noopener">
            <WhatsappIcon size={18} />
            WhatsApp · +34 678 85 73 74
          </a>
          <a href="https://www.imdb.com/name/nm14579927/" className="contact-link" target="_blank" rel="noreferrer">
            <ImdbIcon size={18} />
            IMDb Profile
          </a>
          <a
            href="https://www.filmaffinity.com/es/name.php?name-id=410288855"
            className="contact-link"
            target="_blank"
            rel="noreferrer"
          >
            <FilmaffinityIcon size={18} />
            Filmaffinity
          </a>
        </div>
      </div>
    </section>
  )
}