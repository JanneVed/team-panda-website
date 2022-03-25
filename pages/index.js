import { Client } from "@notionhq/client";
import { useState } from "react";
import styles from '../styles/Home.module.css';

const HomePage = (props) => {

  //console.log(props.data);

  // Makes an array of employees with id and name.
  const getEmployeeInfo = () => {
    const persons = [];
    props.data[1].forEach(person => {
      persons.push({
        id: person.id,
        employee: person.properties.Name.title[0].plain_text,
        total_hours: person.properties['Total hours'].rollup.number});
    });
    return persons
  };
  // Makes an array of all projects from notion database
  const getProjectsInfo = () => {
    const projects = [];
    props.data[0].forEach(project => {
      projects.push({
        id: project.id,
        projectName: project.properties.Projectname.title[0].plain_text,
        status: project.properties.Status
      });
    });
    return projects
  };

  // const getTimereportsInfo = () => {
  //   const reports = [];
  //   props.data[2].forEach(report => {
  //     reports.push({
  //     })
  //   })
  // }

  // Send the names for the employee to the select.
  const dropdownNames = () => {
    const employees = [];
    getEmployeeInfo().forEach(element => {
      employees.push(<option value={element.id} key={element.id}>{element.employee}</option>)
    });
    return employees;
  };

  // Show total hours for selected employee
  const getEmloyeeHours = (selected) => {
    let totalHours;
    getEmployeeInfo().forEach(element => {
      if (selected === element.id) {
        totalHours = element.total_hours
      }
    });
    return totalHours;
  };

  // Calls getEmployeeInfo, compares selected person in dropdown and gets employee name
  const getEmployeeName = (Id) => {
    let employeeName;
    getEmployeeInfo().forEach(element => {
      if (Id === element.id) {
        employeeName = element.employee
      }
    })
    return employeeName;
  };

  const dropdownProjects = () => {
    const projects = [];
    getProjectsInfo().forEach(element => {
      projects.push(<option value={element.id} key={element.id}>{element.projectName}</option>)
    });
    return projects;
  };

  const getProjectName = (Id) => {
    let projectsName;
    getProjectsInfo().forEach(element => {
      if (Id === element.id) {
        projectsName = element.projectName
      }
    });
    return projectsName;
  };

  // Home page return
  const [PeopleId, setPeopleId] = useState();
  const [ProjectId, setProjectId] = useState();

  return <div className={styles.content}>
    <div className={styles.homePageHeader}>
      <h1>Home Page</h1>
    </div>
    <form>
      <label form="people">Employee: </label>
      <select value={PeopleId} onChange={e => setPeopleId(e.target.value)} className="people">
        <option disabled selected>Select Employee</option>
        {dropdownNames()}
      </select>
    </form>
    <div className={styles.homePageContent}>
      <p>Date</p>
      <p>Selected Person</p>
      <p>Hours</p>
      <form>
        <label form="projects">Projects: </label>
        <select value={ProjectId} onChange={e => setProjectId(e.target.value)} className="projects">
          <option disabled selected>Select Project</option>
          {dropdownProjects()}
      </select>
      </form>
      {/* <p>Employee: {getEmployeeName(PeopleId)}</p>
      <p>Total hours: {getEmloyeeHours(PeopleId)}</p> */}
      {console.log(`Employee Selected: ${getEmployeeName(PeopleId)}\nTotal hours: ${getEmloyeeHours(PeopleId)}\nUser Id: ${PeopleId}\n\nProject Selected: ${getProjectName(ProjectId)}\nProject Id: ${ProjectId}`)}
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