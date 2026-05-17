import { IconWhatsApp, IconPin } from './Illustrations'

export default function Contact() {
  return (
    <section id="contact">
      <div className="page">
        <div className="section-head">
          <span className="eyebrow">Une question ?</span>
          <h2>Parlez à un agent<br />francophone, maintenant.</h2>
          <p>Réponse en moins de cinq minutes, du Lundi au Dimanche, de 7 h à 23 h (heure d'Alger).</p>
        </div>

        <div className="contact">
          <div className="contact-card">
            <span className="wa-badge">
              <IconWhatsApp /> Disponible
            </span>
            <h3>Discutons sur<br />WhatsApp.</h3>
            <p>
              Devis personnalisé, conseils sur les itinéraires, vérification de papiers.
              Envoyez-nous un message — on répond vite.
            </p>
            <a className="wa-btn" href="https://wa.me/213550000000">
              <IconWhatsApp />
              Écrire sur WhatsApp
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <div className="phone">+213 5 50 00 00 00</div>
          </div>

          <div className="contact-channels">
            <a className="channel" href="mailto:hello@airsline.dz">
              <div className="channel-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="channel-text">
                <div className="ct1">E-mail</div>
                <div className="ct2">hello@airsline.dz</div>
              </div>
            </a>

            <a className="channel" href="#cars">
              <div className="channel-icon"><IconPin /></div>
              <div className="channel-text">
                <div className="ct1">Comptoirs aéroport</div>
                <div className="ct2">ALG · ORN · CZL · AAE · BJA · BUJ · TEE</div>
              </div>
            </a>

            <a className="channel" href="#comment-ca-marche">
              <div className="channel-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="channel-text">
                <div className="ct1">Horaires</div>
                <div className="ct2">Tous les jours · 7 h — 23 h</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
