import './styles/global.scss'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import LogosStrip from './components/LogosStrip/LogosStrip'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Features from './components/Features/Features'
import Benefits from './components/Benefits/Benefits'
import ForWho from './components/ForWho/ForWho'
import Differentials from './components/Differentials/Differentials'
import Testimonials from './components/Testimonials/Testimonials'
import Pricing from './components/Pricing/Pricing'
import FAQ from './components/FAQ/FAQ'
import CTAFinal from './components/CTAFinal/CTAFinal'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <LogosStrip />
        <HowItWorks />
        <Features />
        <Benefits />
        <ForWho />
        <Differentials />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
