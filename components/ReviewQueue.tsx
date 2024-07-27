'use client'
import React, { useState, useEffect } from 'react';
import QueueCard from "@/components/QueueCard";
import { QueueItem } from '@/app/protected/dashboard/page';

export default function ReviewQueue() {
    const [queueItems, setQueueItems] = useState<QueueItem[]>([
        {
            reviewer: "Alice",
            review: "The feature is well-implemented, but there's a minor issue with the UI alignment.",
            response: "Thank you for the feedback, Alice. We'll address the UI alignment issue promptly.",
            status: "pending",
            createdDate: "2024-07-20"
        },
        {
            reviewer: "Bob",
            review: "Great work! The performance improvements are noticeable, but the documentation could be more detailed.",
            response: "We appreciate your input, Bob. We'll enhance the documentation to provide more clarity.",
            status: "pending",
            createdDate: "2024-07-22"
        },
        {
            reviewer: "Charlie",
            review: "The new design is sleek and user-friendly. However, there's a bug when submitting the form under certain conditions.",
            response: "Thanks, Charlie. We're glad you like the design. We'll investigate and fix the form submission bug.",
            status: "pending",
            createdDate: "2024-07-19"
        },
        {
            reviewer: "Dana",
            review: "The recent changes are good, but there are a few typos in the latest release notes.",
            response: "Apologies for the oversight, Dana. We'll correct the typos in the release notes.",
            status: "approved",
            createdDate: "2024-07-21"
        },
        {
            reviewer: "Eli",
            review: "The API integration is seamless. Could we get some more examples on how to use the new endpoints?",
            response: "Sure thing, Eli. We'll add more examples to the documentation for the new endpoints.",
            status: "pending",
            createdDate: "2024-07-23"
        }
    ]);

    const [currentPendingIndex, setCurrentPendingIndex] = useState<number | null>(null);

    useEffect(() => {
        // Find the index of the first pending item
        const nextPendingIndex = queueItems.findIndex(item => item.status === "pending");
        setCurrentPendingIndex(nextPendingIndex !== -1 ? nextPendingIndex : null);
    }, [queueItems]);

    const handleStatusChange = (index: number, newStatus: string) => {
        setQueueItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].status = newStatus;
            return updatedItems;
        });
    };

    const pendingItems = queueItems.filter(item => item.status === "pending");
    const remainingPendingReviews = pendingItems.length;

    return (
        <div className='mt-10'>
            <div className="relative mx-auto max-w-lg">
                <div className="mb-4 text-center">
                    <h2 className="text-lg font-semibold">Pending Reviews: {remainingPendingReviews}</h2>
                </div>
                {remainingPendingReviews > 0 ? (
                    <div className="relative" style={{ height: `${remainingPendingReviews * 10 + 200}px` }}>
                        {pendingItems.map((item, index) => (
                            <div
                                key={index}
                                className="absolute w-full transition-transform"
                                style={{
                                    zIndex: remainingPendingReviews - index,
                                    transform: `translateY(${index * 10}px) scale(${1 - index * 0.02})`,
                                }}
                            >
                                <QueueCard
                                    queueItem={item}
                                    onStatusChange={(newStatus) =>
                                        handleStatusChange(currentPendingIndex!, newStatus)
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-lg font-semibold text-gray-500">
                        No more pending reviews!
                    </div>
                )}
            </div>
        </div>
    );
}

