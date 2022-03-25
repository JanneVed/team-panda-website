import { Client } from "@notionhq/client";
import { useState } from "react";
import styles from '../styles/Home.module.css';

const HomePage = (props) => {

  //console.log(props.data);

  // Makes an array of eployees with id and name.
  const getEmployeeInfo = () => {
    const person = [];
    props.data[1].forEach((projectworker) => {
      person.push({
        id: projectworker.id,
        employee: projectworker.properties.Name.title[0].plain_text,
        total_hours: projectworker.properties['Total hours'].rollup.number});
    });
    return person
  };

  // Send the names for the employee to the select.
  const dropdownNames = () => {
    const employees = [];
    getEmployeeInfo().forEach(element => {
      employees.push(<option value={element.id} key={element.id}>{element.employee}</option>)
    });
    return employees;
  }

  // Show total hours for selected employee
  const getEmloyeeHours = (selected) => {
    let totalHours;
    getEmployeeInfo().forEach(element => {
      if (selected === element.id) {
        totalHours = element.total_hours
      }
    });
    return totalHours;
  }

  // Calls getEmployeeInfo, compares selected person in dropdown and gets employee name
  const getEmployeeName = (selected) => {
    let employeeName;

    getEmployeeInfo().forEach(element => {
      if (selected === element.id) {
        employeeName = element.employee
      }
    })
    return employeeName;
  }
  
  // Home page return
  const [Selects, setSelects] = useState();
  return <div className={styles.content}>
    <div className={styles.homePageHeader}>
      <h1>Home Page</h1>
    </div>
    <form>
      <label form="people">Employee: </label>
      <select value={Selects} onChange={e => setSelects(e.target.value)} className="people">
        <option disabled selected>Select Employee</option>
        {dropdownNames()}
      </select>
    </form>
    <div className={styles.homePageContent}>
      <p>Employee: {getEmployeeName(Selects)}</p>
      <p>Total hours: {getEmloyeeHours(Selects)}</p>
      {console.log("Employee Selected: "+ getEmployeeName(Selects) + "\n\n" + "User Id: " + Selects)}
    </div>
  </div>;
};

export default HomePage;

export async function getStaticProps()
{
  let data = [];
  const notionClient = new Client(
    {
      auth: process.env.NOTION_TOKEN,
    }
  );
  
  data.push(await getProjects(notionClient));

  data.push(await getPeople(notionClient));

  data.push(await getTimereports(notionClient));

  return {
    props: {
      data,
    },
  };
};
// Get Projects
async function getProjects(client)
{
  let response = await client.databases.query(
    {
      database_id: process.env.NOTION_DATABASE_PROJECTS_ID,
    }
  );

  console.log("projects:" + response.results);

  return response.results;
};
// Get People
async function getPeople(client)
{
  let response = await client.databases.query(
    {
      database_id: process.env.NOTION_DATABASE_PEOPLE_ID,
    }
  );

  console.log("people:" + response.results);

  return response.results;
}
// Get Timereports
async function getTimereports(client)
{
  let response = await client.databases.query(
    {
      database_id: process.env.NOTION_DATABASE_TIMEREPORTS_ID,
    }
  );
  console.log("timereports:" + response.results);

  return response.results;
}