import { Img, delayStyle } from './Primitives'

export function About() {
  return (
    <section className="about" id="about">
      <div className="about-media reveal">
        <Img src="/media/img/about-txaro.webp" alt="Txaro Kandler — retrato" />
      </div>
      <div className="about-text reveal" style={delayStyle(120)}>
        <p className="section-label">Sobre mí</p>
        <h2 className="section-title">
          Una actriz de
          <br />
          presencia incontestable
        </h2>
        <p>
          Txaro Kandler es una actriz española con una trayectoria que abarca
          cine, televisión y teatro. Su interpretación de Carolina María de
          Jesús en la obra "Hambre" ha sido reconocida por la crítica
          como una actuación de "presencia incontestable que sostiene con
          solvencia".
        </p>
        <p>
          Se formó en teatro, danza, danza-teatro, canto y dirección con maestros
          de la talla de Rubens Correa, Lorenzo Quinteros, Silvia Vladimivsky,
          Susana Di Gerónimo y Pino. Esta formación integral le ha permitido
          desarrollar una carrera multifacética que incluye actuación, doblaje,
          creación audiovisual y artesanía.
        </p>
        <p>
          Además de su trabajo frente a la cámara, ha colaborado en proyectos de
          videopoesía con Charles Olsen y la productora antenablue, y ha
          participado en producciones de ficción sonora con Smart Locuciones.
        </p>
        <div className="about-details">
          <p className="about-detail-label">Formación</p>
          <p className="about-detail-value">
            Teatro, danza, canto, dirección — Rubens Correa, Lorenzo Quinteros,
            Silvia Vladimivsky
          </p>
          <p className="about-detail-label">Especialidades</p>
          <p className="about-detail-value">
            Actuación · Doblaje · Ficción sonora · Artesanía · Música
          </p>
        </div>
        <div className="social-links">
          <a href="https://www.instagram.com/txarokandler/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.imdb.com/name/nm14579927/" target="_blank" rel="noreferrer">
            IMDb
          </a>
          <a
            href="https://www.filmaffinity.com/es/name.php?name-id=410288855"
            target="_blank"
            rel="noreferrer"
          >
            Filmaffinity
          </a>
        </div>
      </div>
    </section>
  )
}