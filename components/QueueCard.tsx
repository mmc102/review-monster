import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";


interface QueueItem {
    reviewer: string;
    review: string;
    response: string;
}

export default function QueueCard(queueItem: QueueItem) {





    return (

        <Card className="max-w-[500px]">
            <CardContent>
                <CardHeader>
                    <CardTitle>{queueItem.reviewer}</CardTitle>
                    <CardDescription>{queueItem.review}</CardDescription>
                </CardHeader>
                <CardDescription>
                    <Input>
                        {queueItem.response}
                    </Input>
                </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button >Respond</Button>
                <Button variant="secondary">Ignore</Button>
            </CardFooter>
        </Card>

    )
}