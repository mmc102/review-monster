'use client'
import { getOptionalUser } from "@/lib/getters/get_user";
import { useEffect, useState } from "react";

export default function Name() {

    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        const fetchName = async () => {
            const user = await getOptionalUser();
            setName(user?.business_name || null);
        }
        fetchName();
    }, [])

    return <h1>{name || "Review Monster"}</h1>

}
