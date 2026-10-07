import { delayStyle } from './Primitives'

export function Showreel() {
  return (
    <section className="showreel" id="showreel">
      <div className="showreel-head reveal">
        <h2 className="section-title">Showreel</h2>
      </div>
      <div className="showreel-placeholder reveal" style={delayStyle(120)}>
        <iframe
          src="https://www.youtube-nocookie.com/embed/QD3NjjCMb_w?rel=0&modestbranding=1&playsinline=1"
          title="Showreel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  )
}