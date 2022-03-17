import { Client } from "@notionhq/client";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function ProjectWorkers({results})
{
  useEffect(() => {
    console.log(results) // show array in browser console
  });
  const getDatabaseDisplay = () => {
    let jsx = [];
    results.forEach((projectworker) => {
      jsx.push(
        <div className={styles.card} key={projectworker.id}>
          <h3>Project: {projectworker.properties.Projectname.title[0].plain_text}</h3>
          <p>Status: {projectworker.properties.Status.select.name}</p>
          <p>Hours: {projectworker.properties.Hours.number}</p>
          <p>Worked hours: {projectworker.properties['Worked hours'].rollup.number}</p>
          <p>Hours left: {projectworker.properties['Hours left'].formula.number}</p>
          <p>Timespan: {projectworker.properties.Timespan.date.start} &rArr; {projectworker.properties.Timespan.date.end}</p>
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
  // const people_database_id = process.env.NOTION_DATABASE_PEOPLE_ID;
  // const timereport_database_id = process.env.NOTION_DATABASE_TIMEREPORTS_ID;
  const response = await notionClient.databases.query(
    {
      database_id,
    }
  );
  console.log(response); // show in terminal
  return{
    props:
    {
      results: response.results
    }
  };
};