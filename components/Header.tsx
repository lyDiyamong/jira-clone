import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./UserMenu";
import { checkUser } from "@/lib/checkUser";

async function Header() {
    await checkUser()
    return (
        <header className="container">
            <nav className="py-6 px-4 flex justify-between items-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={200}
                        height={50}
                        className="h-10 w-auto object-contain"
                    />
                </Link>
                <div className="flex justify-center gap-4">
                    <Link href="/project/create">
                    <Button variant="destructive">
                        <PenBox size={24} />
                        <span>Create Project</span>
                    </Button>
                    </Link>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/onboarding" >
                        <Button variant="outline" >Login</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserMenu />
                    </SignedIn>
                </div>
            </nav>
        </header>
    );
}

export default Header;
