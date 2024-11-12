"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

function Transform() {
    return (
        <section id="features" className=" py-20 px-5 mt-12">
            <div>
                <h3 className="text-3xl font-bold mb-6 text-center">
                    Ready to Transform Your Workflow?
                </h3>
                <p className="text-xl mb-12">
                    Join thousands of teams already using ZCRUM to streamline
                    their projects and boost productivity
                </p>
                <Link href="/onboarding">
                    <Button size="lg" className="animate-bounce">
                        Start For Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}

export default Transform;
