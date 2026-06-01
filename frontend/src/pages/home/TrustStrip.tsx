import { IconPlane, IconShield, IconCheck } from './Illustrations'

export default function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="item">
        <span className="icon"><IconPlane /></span>
        7 aéroports algériens
      </div>
      <div className="item">
        <span className="icon"><IconShield /></span>
        Assurance incluse
      </div>
      <div className="item">
        <span className="icon"><IconCheck /></span>
        Annulation gratuite 48 h
      </div>
      <div className="item">
        <span className="icon">ALG</span>
        Équipe Algerienne
      </div>
    </div>
  )
}
