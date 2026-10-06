import { About } from './components/About'
import { Contact } from './components/Contact'
import { Credits } from './components/Credits'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Press } from './components/Press'
import { Footer, Showreel } from './components/Showreel'
import { useReveal } from './hooks'

export default function App() {
  useReveal()

  return (
    <>
      <Nav />

      <main>
        <Hero />
        <About />
        <Press />
        <Credits />
        <Showreel />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </>
  )
}