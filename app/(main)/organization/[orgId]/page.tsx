import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/OrgSwitcher";
import React from "react";

const Organization = async ({ params }: { params: { orgId: string } }) => {
    const { orgId } = params;

    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization not found</div>;
    }
    return (
        <div className="container mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <h1 className="text-5xl font-bold gradient-title pb-2">
                    {organization.name}&lsquo;s Projects
                </h1>
            </div>
            {/* Org switcher */}
            <div className="mb-4">Show org Projects</div>
            <div className="mb-8">
                Show User assigned and reported issues here
            </div>
            <OrgSwitcher />
        </div>
    );
};

export default Organization;
