import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/OrgSwitcher";
import React from "react";
import ProjectList from "../_components/ProjectList";
import UserIssues from "../_components/UserIssues";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Params = { orgId: any };

const Organization = async ({ params }: { params: Params }) => {
    const orgId = params.orgId;
    const organization = await getOrganization(orgId);

    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return (
        <div className="container mx-auto">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
                <h1 className="text-5xl font-bold gradient-title pb-2">
                    {organization.name}&lsquo;s Projects
                </h1>
                {/* Org switcher */}
                <OrgSwitcher />
            </div>

            <div className="mb-4">
                <ProjectList orgId={organization.id} />
            </div>
            <div className="mb-8">
                Show User assigned and reported issues here
            </div>

            <div>
                <UserIssues userId={userId} />
            </div>
        </div>
    );
};

export default Organization;