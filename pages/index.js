import { Client } from "@notionhq/client";
import { useEffect } from "react";

export default function ProjectWorkers({results})
{
  useEffect(() => {
    console.log(results)
  })
  const getDatabaseDisplay = () => {
    let jsx = [];
    results.forEach((projectworker) => {
      jsx.push(
        <div className="card" key={projectworker.id}>
          <h3>Project: {projectworker.properties.Projectname.title[0].plain_text}</h3>
          <p>Status: {projectworker.properties.Status.select.name}</p>
          <p>Hours: {projectworker.properties.Hours.number}</p>
          <p>Worked hours: {projectworker.properties['Worked hours'].rollup.number}</p>
          <p>Hours left: {projectworker.properties['Hours left'].Formula.number}</p>
          <p>Timespan: {}</p>
        </div>
      );
    });
    return jsx;
  };
  return <div>{getDatabaseDisplay()}</div>;
};

export async function getStaticProps()
{
  const notionClient = new Client(
    {
      auth: process.env.NOTION_TOKEN,
    }
  );
  const database_id = process.env.NOTION_DATABASE_PROJECTS_ID;
  const response = await notionClient.databases.query(
    {
      database_id,
    }
  );
  console.log(response);
  return{
    props:
    {
      results: response.results
    }
  }
}