import { Client } from "@microsoft/microsoft-graph-client";

export const createCalendarEvent = async ({
    startDate,
    endDate,
    type,
    notes,
    accessToken,
}: {
    startDate: Date;
    endDate: Date;
    type: string;
    notes: string;
    accessToken: string;
}) => {
    if (!accessToken) return;

    const client = Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    const event = {
        subject: `${type} Leave`,
        start: {
            dateTime: startDate.toISOString(),
            timeZone: "UTC",
        },
        end: {
            dateTime: endDate.toISOString(),
            timeZone: "UTC",
        },
        body: {
            contentType: "text",
            content: notes,
        },
        showAs: "oof",
    };

    await client.api("/me/events").post(event);
};
