import React from "react";
import faqs from "@/data/faqs.json";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type Faqs = {
    question: string;
    answer: string;
};

function FAQs() {
    return (
        <section id="faqs" className="bg-gray-900 py-20 px-5 mt-12">
            <div>
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Frequently Asked Question
                </h3>
            </div>
            <Accordion type="single" collapsible>
                {faqs.map((faq: Faqs, index) => {
                    return (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-start">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </section>
    );
}

export default FAQs;
