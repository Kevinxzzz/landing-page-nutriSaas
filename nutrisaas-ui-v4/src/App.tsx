import './styles/global.scss'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import LogosStrip from './components/LogosStrip/LogosStrip'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Features from './components/Features/Features'
import Timeline from './components/Timeline/Timeline'
import AgendaSection from './components/AgendaSection/AgendaSection'
import ForWho from './components/ForWho/ForWho'
import Differentials from './components/Differentials/Differentials'
import Testimonials from './components/Testimonials/Testimonials'
import Pricing from './components/Pricing/Pricing'
import FAQ from './components/FAQ/FAQ'
import Footer from './components/Footer/Footer'


export default function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LogosStrip />
        <HowItWorks />
        <AgendaSection />
        <Timeline />
        <Features />
        {/* <Benefits /> */}
        <ForWho />
        <Differentials />
        <Pricing />
        <Testimonials />
        <FAQ />
        {/* <CTAFinal /> */}
      </main>
      <Footer />
    </>
  )
}
