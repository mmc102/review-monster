import { QueueItem } from "@/app/protected/dashboard/page";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface QueueCardProps {
    queueItem: QueueItem;
    onStatusChange: (newStatus: string) => void;
}

export default function QueueCard({ queueItem, onStatusChange }: QueueCardProps) {
    return (
        <Card className="max-w-[500px]">
            <CardContent>
                <CardHeader>
                    <CardTitle>{queueItem.reviewer}</CardTitle>
                    <CardDescription>{queueItem.review}</CardDescription>
                </CardHeader>
                <CardDescription>
                    <Textarea>
                        {queueItem.response}
                    </Textarea>
                </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button onClick={() => onStatusChange('approved')}>Respond</Button>
                <Button variant="secondary" onClick={() => onStatusChange('rejected')}>Ignore</Button>
            </CardFooter>
        </Card>
    );
}
