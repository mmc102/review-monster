import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from './ui/textarea';
import { QueueItem } from '@/types';
import { CommentThread } from './CommentThread';
import { updateReviewResponse } from '@/lib/setters/set_reviews';

interface QueueCardProps {
    queueItem: QueueItem;
    onStatusChange: (newStatus: string) => void;
}

export default function QueueCard({ queueItem, onStatusChange }: QueueCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedResponse, setEditedResponse] = useState(queueItem.response);

    const handleSave = () => {
        updateReviewResponse(queueItem.id, editedResponse)
        queueItem.response = editedResponse;
        setIsEditing(false);
    };

    return (
        <Card className="max-w-[500px]">
            <CardContent>
                <CardHeader>
                    <CardTitle>{queueItem.reviewer}</CardTitle>
                </CardHeader>
                {isEditing ? (
                    <div>
                        <div className="mb-2 rounded-md bg-gray-100 p-2 text-sm text-gray-700">
                            {queueItem.review}
                        </div>
                        <Textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            placeholder="Edit response"
                            className="mb-2 w-full"
                        />
                    </div>
                ) : (
                    <CommentThread data={queueItem} />
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                {isEditing ? (
                    <>
                        <Button onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                        <Button className='bg-green-500 hover:bg-green-800' onClick={() => onStatusChange('approved')}>Respond</Button>
                        <Button className="bg-red-500 hover:bg-red-800" onClick={() => onStatusChange('rejected')}>Ignore</Button>

                    </>
                )}
            </CardFooter>
        </Card>
    );
}

