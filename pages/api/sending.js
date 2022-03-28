const { Client } = require("@notionhq/client");
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});
export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            message: `${request.method} The method is not a post method`,
        });
    }
    try {
        const { PeopleId, ProjectId, ReportDate, WorkedHours, Notes} = JSON.parse(request.body);
        await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_DATABASE_TIMEREPORTS_ID,
            },
            properties: {
                Date: {
                    date: {
                        start: ReportDate,
                    },
                },
                Hours: {
                    number: WorkedHours,
                },
                Note: {
                    title: [
                        {
                            text: {
                                content: Notes,
                            },
                        },
                    ],
                },
                Person: {
                    relation: [
                        {
                            id: PeopleId,
                        },
                    ],
                },
                Project: {
                    relation: [
                        {
                            id: ProjectId,
                        },
                    ],
                },
            },
        });
        response.status(201).json({ message: "Report Sent!"})
    }
    catch (error) {
        response.status(500).json({ message: "Report Failed, check the logs"})
    }
}