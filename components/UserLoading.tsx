"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";
import React from "react";

function UserLoading() {
    const { isLoaded: isOrgLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    if (!isOrgLoaded || !isUserLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }
    return <></>;
}

export default UserLoading;
