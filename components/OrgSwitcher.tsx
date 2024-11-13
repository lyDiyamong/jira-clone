"use client";

import {
    OrganizationSwitcher,
    SignedIn,
    useOrganization,
    useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const OrgSwitcher = () => {
    const pathname = usePathname();

    const { isLoaded: isOrgLoaded }: { isLoaded: boolean } = useOrganization();
    const { isLoaded: isUserLoaded }: { isLoaded: boolean } = useUser();

    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }
    // Render the component when everything is loaded
    return (
        <div>
            <SignedIn>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="/organization/:slug"
                    afterSelectOrganizationUrl="/organization/:slug"
                    createOrganizationMode={
                        pathname === "/onboarding" ? "navigation" : "modal"
                    }
                    createOrganizationUrl="/onboarding"
                />
            </SignedIn>
        </div>
    );
};

export default OrgSwitcher;
