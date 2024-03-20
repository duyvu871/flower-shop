
export default function StatusBadge({ status, value }: { status: "pending" | "approved" | "rejected"; value: string}) {
    switch (status) {
        case "pending":
            return <span
                className="bg-yellow-100 text-yellow-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded border border-yellow-300">{value}</span>
        case "approved":
            return <span
                className="bg-green-100 text-green-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded border border-green-400">{value}</span>
        case "rejected":
            return <span
                className="bg-red-100 text-red-800 text-xs font-semibold me-2 px-2.5 py-0.5 rounded border border-red-400">{value}</span>
        default:
            return null;
    }
}