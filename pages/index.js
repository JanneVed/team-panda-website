import { Client } from "@notionhq/client";
import { useState } from "react";
import Select from "react-select";
import styles from "../styles/Home.module.css";

const HomePage = ({results}) => {

  // makes an array of eployees with id and name.
  const getEmployeeInfo = () => {
    const person = [];
    results.forEach((projectworker) => {
      person.push({
        id: projectworker.id,
        employee: projectworker.properties.Name.title[0].plain_text,
        total_hours:projectworker.properties['Total hours'].rollup.number});
    });
    return person
  };

  // send the names for the employee to the select.
  const postEmployeeNames = () => {
    const employees = [];
    const employeeArray = getEmployeeInfo();
    employeeArray.forEach(element => {
      employees.push(<option value={element.id} key={element.id}>{element.employee}</option>)
    });
    return employees;
  }
  
  const getEmloyeeHours = (selected) => {
    let totalHours;
    let employeeHours = [];
    const selectedId = selected
    results.forEach(element => {
      employeeHours.push({
        id: element.id,
        hours: element.properties['Total hours'].rollup.number
      })
      if (selectedId === element.id) {
        totalHours = element.properties['Total hours'].rollup.number
      }
    });
    return totalHours;
  }

  const [Selects, setSelects] = useState();

  return <div>
    <h1>Home Page</h1>
    <form>
      <label form="people">Employee: </label>
      <select value={Selects} onChange={e => setSelects(e.target.value)} className="people">
        <option disabled selected>Select Employee</option>
        {postEmployeeNames()}
      </select>
    </form>
    <p>Total hours: {getEmloyeeHours(Selects)}</p>
  </div>;
};

export default HomePage;

export async function getStaticProps()
{
  for (let database = 1; database < 2; database++)
  {
    if (database == 0)
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
      console.log(response); // show in terminal
      return{
        props:
        {
          results: response.results
        }
      };
    };
    if (database == 1)
    {
      const notionClient = new Client(
        {
          auth: process.env.NOTION_TOKEN,
        }
      );
      const database_id = process.env.NOTION_DATABASE_PEOPLE_ID;
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
    if (database == 2)
    {
      const notionClient = new Client(
        {
          auth: process.env.NOTION_TOKEN,
        }
      );
      const database_id = process.env.NOTION_DATABASE_TIMEREPORTS_ID;
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
  };
};