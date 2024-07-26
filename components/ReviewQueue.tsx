import QueueCard from "./QueueCard";

export default function ReviewQueue() {

    const queueItems = [
        {
            reviewer: "Alice",
            review: "The feature is well-implemented, but there's a minor issue with the UI alignment.",
            response: "Thank you for the feedback, Alice. We'll address the UI alignment issue promptly."
        },
        {
            reviewer: "Bob",
            review: "Great work! The performance improvements are noticeable, but the documentation could be more detailed.",
            response: "We appreciate your input, Bob. We'll enhance the documentation to provide more clarity."
        },
        {
            reviewer: "Charlie",
            review: "The new design is sleek and user-friendly. However, there's a bug when submitting the form under certain conditions.",
            response: "Thanks, Charlie. We're glad you like the design. We'll investigate and fix the form submission bug."
        },
        {
            reviewer: "Dana",
            review: "The recent changes are good, but there are a few typos in the latest release notes.",
            response: "Apologies for the oversight, Dana. We'll correct the typos in the release notes."
        },
        {
            reviewer: "Eli",
            review: "The API integration is seamless. Could we get some more examples on how to use the new endpoints?",
            response: "Sure thing, Eli. We'll add more examples to the documentation for the new endpoints."
        }
    ];

    return (
        <div className="flex flex-col gap-2 m-2">
            {queueItems.map((queueItem, index) => (
                <QueueCard key={index} {...queueItem} />
            ))}

        </div>
    )

}