"use client";
import AutoPlay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import companies from "@/data/companies.json";
import Image from "next/image";

type Company = {
    name: string;
    path: string;
    id: number;
};

function CompanyCarousel() {
    return (
        <section id="carousel" className=" py-20 px-5 mt-12">
            <div>
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Trusted by Industry Leaders
                </h3>
            </div>
            <Carousel
                plugins={[
                    AutoPlay({
                        delay: 2000,
                    }),
                ]}
            >
                <CarouselContent className="flex gap-5 sm:gap-20 items-center">
                    {companies.map((company: Company) => {
                        return (
                            <CarouselItem
                                key={company.name}
                                className="basis-1/3 lg:basis-1/6"
                            >
                                <Image
                                    src={company.path}
                                    alt={company.name}
                                    width={200}
                                    height={56}
                                    className="h-9 sm:h-14 w-auto object-contain"
                                />
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </section>
    );
}

export default CompanyCarousel;
