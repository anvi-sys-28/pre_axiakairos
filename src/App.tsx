import { SEO } from './components/SEO';
import { HaldenLanding } from './components/HaldenLanding';

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SEO
        title="Halden — AI Teammate for Port Operators"
        description="Meet Hal, your AI teammate for port operators. Hal tracks vessels, books berths, files customs, coordinates crews, escalates and does anything in between to keep a port moving."
        canonicalUrl="https://halden.ai/"
        ogImage="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261029_050506_a830ff21-4c71-4272-bc39-b61cacb54463.png&w=1400&q=85"
      />
      <HaldenLanding />
    </div>
  );
}

export default App;
