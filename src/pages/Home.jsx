import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Location from '../components/Location'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <div className="min-h-screen bg-bg">
            <Header />
            <main>
                <Hero />
                <Services />
                <Location />
            </main>
            <Footer />
        </div>
    )
}
