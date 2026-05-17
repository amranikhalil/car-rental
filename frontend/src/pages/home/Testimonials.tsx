const TESTIMONIALS = [
  {
    quote: "On est sorti du vol de nuit complètement épuisés. La voiture était là, le monsieur nous attendait. En 10 minutes on roulait vers Tipaza.",
    name: "Camille D.",
    meta: "Paris → Alger · Avril 2026",
    initial: "C",
  },
  {
    quote: "J'étais nerveuse à l'idée de louer en Algérie sans parler arabe. Tout s'est fait en français, avant même mon départ. Service impeccable.",
    name: "Sophie M.",
    meta: "Lyon → Oran · Mars 2026",
    initial: "S",
  },
  {
    quote: "Réservé un 4x4 trois semaines à l'avance pour un trip dans le Hoggar. Récupéré à Tamanrasset, rendu à Alger. Aucun souci, vraiment.",
    name: "Marc L.",
    meta: "Bruxelles → Tamanrasset · Février 2026",
    initial: "M",
  },
]

export default function Testimonials() {
  return (
    <section id="temoignages">
      <div className="page">
        <div className="testimonials-wrap">
          <div className="section-head">
            <span className="eyebrow" style={{ color: 'rgba(250,246,239,.65)' }}>Témoignages</span>
            <h2>Ils ont atterri,<br />ils ont roulé.</h2>
            <p>Quelques mots de voyageurs accueillis ces derniers mois.</p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <article key={i} className="testimonial">
                <div className="stars">★★★★★</div>
                <p className="quote">« {t.quote} »</p>
                <div className="who">
                  <div className="avatar">{t.initial}</div>
                  <div>
                    <div className="tname">{t.name}</div>
                    <div className="tmeta">{t.meta}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
