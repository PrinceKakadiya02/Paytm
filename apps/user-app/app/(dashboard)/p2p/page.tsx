import { authOptions } from "../../../lib/auth"
import { getServerSession } from "next-auth"
import { SendCard } from "../../../components/SendCard";

export default async function() {
    const sesion = getServerSession( authOptions );
    return (
        <div className="w-full">
            <SendCard/>
        </div>
    )
}