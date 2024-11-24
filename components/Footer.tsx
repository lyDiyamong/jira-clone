// components/Footer.tsx
import React from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full border-t bg-background ">
            <div className="container px-4 py-8 md:py-12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Jira Clone</h3>
                        <p className="text-sm text-muted-foreground">
                            Zcrum is a powerful project management tool that
                            helps teams organize, track, and manage their work
                            efficiently.{" "}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/projects"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/issues"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Issues
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/documentation"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/api"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    API
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h4 className="font-medium">Connect</h4>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://github.com/lyDiyamong" target="_blank">
                                    <Github className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <Link
                                    href="https://www.linkedin.com/in/ly-diyamong/"
                                    target="_blank"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2024 Jira Clone. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/terms" className="hover:text-primary">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="hover:text-primary">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
