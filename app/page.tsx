import CompanyCarousel from "@/components/Landing/CompanyCarousel";
import FAQs from "@/components/Landing/FAQs";
import Feature from "@/components/Landing/Feature";
import Transform from "@/components/Landing/Transform";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto py-20 text-center">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
                    Test CI/CD Your Work flow <br />
                    <span className="flex mx-auto gap-3 sm:gap-4 items-center">
                        with{" "}
                        <Image
                            src={"/logo2.png"}
                            width={400}
                            height={80}
                            alt="zcrum logo"
                            className="h-14 sm:h-24 w-auto object-contain"
                        />
                    </span>
                </h1>
                <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                    Empower your team with our intuitive project management
                    solution
                </p>
                <Link href="/onboarding">
                    <Button>
                        Get Started <ChevronRight size={18} className="ml-1" />
                    </Button>
                </Link>
                <Link href="#feature">
                    <Button size="lg" variant="outline" className="ml-4">
                        Learn More
                    </Button>
                </Link>

                {/* Key Feature */}
                <Feature />
                {/* Company Carousel  */}
                <CompanyCarousel />
                {/* FAQs */}
                <FAQs />
                {/* Transform */}
                <Transform />
            </section>
        </div>
    );
}
