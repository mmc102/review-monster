'use client'
import React, { useState, useEffect } from 'react';
import QueueCard from "@/components/QueueCard";
import { QueueItem } from '@/types';
import { getReviews } from '@/lib/getters/get_reviews';
import { updateReviewStatus } from '@/lib/setters/set_reviews';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function ReviewQueue() {
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchQueueItems = async () => {
            try {
                const rawQueueItems = await getReviews();
                setQueueItems(rawQueueItems);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQueueItems();
    }, []);

    const handleStatusChange = (index: number, newStatus: string) => {
        const item = queueItems[index]
        updateReviewStatus(item.id, newStatus)
        setQueueItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].status = newStatus;
            return updatedItems;
        });
    };

    const pendingItems = queueItems.filter(item => item.status === "pending");
    const remainingPendingReviews = pendingItems.length;
    const router = useRouter()

    if (loading) {
        return <div className="mt-10 text-center">Loading...</div>;
    }

    return (
        <div className='mt-10'>
            <div className="relative mx-auto max-w-lg">
                <div className="mb-4 text-center">
                    <h2 className="text-lg font-semibold">Pending Reviews: {remainingPendingReviews}</h2>
                </div>
                {remainingPendingReviews > 0 ? (
                    <QueueCard
                        queueItem={pendingItems[0]}
                        onStatusChange={(newStatus) =>
                            handleStatusChange(queueItems.findIndex(q => q.id === pendingItems[0].id), newStatus)
                        }
                    />
                ) : (
                    <>
                        <div className="text-center text-lg font-semibold text-gray-500">
                            <Button variant="secondary" onClick={() => { router.push("/protected/dashboard") }}>Back to dashboard</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

