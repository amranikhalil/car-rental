import { SceneBook, SceneLand, SceneDrive } from './Illustrations'

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche">
      <div className="page">
        <div className="section-head">
          <span className="eyebrow">Comment ça marche</span>
          <h2>Trois étapes,<br />aucun détour.</h2>
          <p>
            La location classique se fait au comptoir, fatigué et en file d'attente.
            Chez nous, tout se règle avant que vous ne décolliez.
          </p>
        </div>

        <div className="steps">
          <article className="step">
            <span className="step-num">01</span>
            <h3>Réservez à l'avance</h3>
            <p>
              Choisissez votre aéroport d'arrivée, vos dates, votre voiture.
              Confirmation en moins d'une minute, par e-mail et WhatsApp.
            </p>
            <div className="step-illo"><SceneBook /></div>
          </article>

          <article className="step">
            <span className="step-num">02</span>
            <h3>On vous accueille</h3>
            <p>
              À votre arrivée, notre agent  vous attend en zone d'arrivée,
              votre nom sur un panneau. Vos clés et le contrat sont prêts.
            </p>
            <div className="step-illo"><SceneLand /></div>
          </article>

          <article className="step">
            <span className="step-num">03</span>
            <h3>Prenez la route</h3>
            <p>
              Voiture inspectée, pleine d'essence, assurée. Vous démarrez immédiatement —
              côte méditerranéenne, Atlas, ou les portes du Sahara.
            </p>
            <div className="step-illo"><SceneDrive /></div>
          </article>
        </div>
      </div>
    </section>
  )
}
