import {
    Home as HomeIcon,
    Brush,
    PaintBucket,
    Sparkles,
    ShieldCheck,
    ChevronRight,
    CheckCircle2,
    Star,
    Clock3,
} from "lucide-react";

import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import ProjectProgressShowcase from "../components/ProjectProgressShowcase";

const servicesPreview = [
    {
        icon: HomeIcon,
        title: "Flooring Installation & Repair",
        description: "Durable, clean, professional flooring solutions.",
        bullets: ["Tile", "Vinyl plank", "Laminate", "Hardwood"],
    },
    {
        icon: Brush,
        title: "Drywall Services",
        description: "Repairs, patching, and texture matching.",
        bullets: ["Drywall installation", "Drywall repair", "Texture matching"],
    },
    {
        icon: PaintBucket,
        title: "Interior & Exterior Painting",
        description: "Crisp finishes and quality workmanship.",
        bullets: ["Interior", "Exterior", "Touch-ups"],
    },
    {
        icon: Sparkles,
        title: "Cleaning Services",
        description: "Standard, deep, and move-out cleaning.",
        bullets: ["Standard", "Deep cleaning", "Move-out"],
    },
];

const testimonials = [
    {
        quote:
            "I had my living room and dining room walls painted recently, and I’m so happy with how everything turned out! The team was super professional and showed up right on time.",
        name: "Clement Beauvais",
    },
    {
        quote:
            "Did everything that was asked and did it well. Will be using them on a regular basis. Thanks again for a great job.",
        name: "Douglas Lanier",
    },
    {
        quote: "Excellent service! Very professional, quick and reasonable price.",
        name: "Mary Valero",
    },
];

export default function Home() {
    return (
        <main>
            {/* HERO */}
            <section className="bg-hero-glow py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between">
                        {/* LEFT: Location Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow">
                            <ShieldCheck size={16} />
                            Serving Orlando & Tampa
                        </div>

                        {/* RIGHT: BBB Badge */}
                        <a
                            href="https://www.bbb.org/us/fl/orlando/profile/handyman/econopro-services-llc-0733-235980930/#sealclick"
                            target="_blank"
                            rel="nofollow noreferrer"
                        >
                            <img
                                src="https://seal-centralflorida.bbb.org/seals/black-seal-250-52-bbb-235980930.png"
                                alt="BBB Accredited Business"
                            />
                        </a>
                    </div>

                    {/* HERO CONTENT */}
                    <div className="max-w-3xl">
                        <h1 className="mt-6 text-5xl font-bold text-brand-navy">
                            Affordable Quality. Dependable Service.
                        </h1>

                        <p className="mt-6 text-lg text-slate-600">
                            EconoPro Services is your trusted partner for high-quality handyman
                            and home improvement services. From flooring and drywall to
                            painting and cleaning, we deliver clean, professional results with
                            no surprises.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <a
                                href="/bookings"
                                className="bg-brand-navy text-white px-6 py-4 rounded-full font-semibold flex items-center"
                            >
                                Request Estimate
                                <ChevronRight className="ml-2" size={18} />
                            </a>

                            <a
                                href="/services"
                                className="border px-6 py-4 rounded-full font-semibold"
                            >
                                View Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectProgressShowcase />

            {/* SERVICES PREVIEW */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeading
                        title="Our Services"
                        description="Reliable solutions for your home or property."
                        centered
                    />

                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {servicesPreview.map((s) => (
                            <ServiceCard key={s.title} {...s} />
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <a
                            href="/services"
                            className="text-brand-navy font-semibold"
                        >
                            View All Services →
                        </a>
                    </div>
                </div>
            </section>

            {/* WHY US */}
            <section className="py-20 bg-brand-cream">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
                    <div>
                        <SectionHeading
                            title="Why Choose EconoPro"
                            description="A smooth, professional experience from start to finish. Check out these Google reviews!"
                        />

                        <div className="mt-6 space-y-4">
                            {[
                                "Clear communication and expectations",
                                "Clean, professional workmanship",
                                "Simple booking process",
                            ].map((item) => (
                                <div key={item} className="flex gap-3">
                                    <CheckCircle2 />
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="bg-white p-6 rounded-2xl shadow">
                                <div className="flex text-brand-gold">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="mt-4">"{t.quote}"</p>
                                <p className="mt-4 font-semibold">{t.name}</p>
                            </div>
                        ))}

                        <div className="bg-white p-6 rounded-2xl shadow">
                            <Clock3 />
                            <h3 className="mt-2 font-semibold">Hours</h3>
                            <p>Mon - Fri</p>
                            <p className="font-semibold">8am - 8pm</p>
                            <p>Sat</p>
                            <p className="font-semibold">8am - 5pm</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl font-bold">
                        Ready to get started?
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Request an estimate or schedule your cleaning today.
                    </p>

                    <div className="mt-6 flex justify-center gap-4">
                        <a href="/bookings" className="bg-brand-navy text-white px-6 py-4 rounded-full">
                            Book Now
                        </a>
                        <a href="/contact" className="border px-6 py-4 rounded-full">
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}