import { QueueItem } from "@/types";


export function CommentThread({ data }: { data: QueueItem }) {

    return (
        <>
            <div className="mb-2 rounded-md bg-gray-100 p-2 text-sm text-gray-700">
                {data.review}
            </div>
            <div className="ml-4 border-l-2 border-gray-200 pl-4 text-sm text-gray-700">
                <div className="font-semibold">Response:</div>
                {data.response}
            </div>
        </>
    )
}

