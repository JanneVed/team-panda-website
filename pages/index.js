import { Client } from "@notionhq/client";
import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
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

  // Creates Employee names in the employee select.
  const dropdownNames = () => {
    const employees = [];
    getEmployeeInfo().forEach(element => {
      employees.push(<option value={element.id} key={element.id}>{element.employee}</option>)
    });
    return employees;
  };
  // Creates Project names in the project select.
  const dropdownProjects = () => {
    const projects = [];
    getProjectsInfo().forEach(element => {
      projects.push(<option value={element.id} key={element.id}>{element.projectName}</option>)
    });
    return projects;
  };

  // Show total hours for selected employee
  // const getEmloyeeHours = (selected) => {
  //   let totalHours;
  //   getEmployeeInfo().forEach(element => {
  //     if (selected === element.id) {
  //       totalHours = element.total_hours
  //     }
  //   });
  //   return totalHours;
  // };

  // Calls getEmployeeInfo, compares selected person in dropdown and gets employee name
  // const getEmployeeName = (Id) => {
  //   let employeeName;
  //   getEmployeeInfo().forEach(element => {
  //     if (Id === element.id) {
  //       employeeName = element.employee
  //     }
  //   })
  //   return employeeName;
  // };

  // const getProjectName = (Id) => {
  //   let projectsName;
  //   getProjectsInfo().forEach(element => {
  //     if (Id === element.id) {
  //       projectsName = element.projectName
  //     }
  //   });
  //   return projectsName;
  // };

  // Submits the form to notion.
  const submitForm = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:${location.port}/api/sending`, {
      method: "POST",
      body: JSON.stringify({PeopleId, ProjectId, ReportDate, WorkedHours, Notes}),
    });
    if (response.status === 201) {
      alert("Report sent!")
    } else {
      alert("Report not sent! Check the terminal window for more information")
    }
  }

  // Use states
  const [PeopleId, setPeopleId] = useState("");
  const [ProjectId, setProjectId] = useState("");
  const [ReportDate, setReportDate] = useState(new Date());
  const [WorkedHours, setWorkedHours] = useState(0);
  const [Notes, setNotes] = useState("");

  return <div className={styles.content}>
    <div className={styles.homePageHeader}>
      <h1>Home Page</h1>
    </div>
    <div className={styles.homePageContent}>
      {console.log(PeopleId)}
      {console.log(ProjectId)}
      {console.log(ReportDate)}
      {console.log(WorkedHours)}
      {console.log(Notes)}

      <form onSubmit={submitForm}>
        <label htmlFor="employees">Employee: </label>
        <br/>
        <select name="employees" value={PeopleId} onChange={e => setPeopleId(e.target.value)}>
          {dropdownNames()}
        </select>
        <br/>
        <label htmlFor="date-selecter">Date for Report: </label>
        <br/>
        <DatePicker name="date-selecter" selected={ReportDate} onChange={(date) => setReportDate(date)} required />
        <label htmlFor="hours">Hours Worked: </label>
        <br/>
        <input
          type="number"
          name="hours"
          value={WorkedHours}
          onChange={(e) => setWorkedHours(Number(e.target.value))}
          required
        />
        <br/>
        <label htmlFor="projects">Projects: </label>
        <br/>
        <select name="projects" value={ProjectId} onChange={e => setProjectId(e.target.value)}>
          {dropdownProjects()}
        </select>
        <br/>
        <label htmlFor="notes">Notes: </label>
        <br/>
        <input
          type="text"
          name="notes"
          value={Notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <br/>
        <br/>
        <button type="submit">Submit Report</button>
      </form>
      {console.log(props.data)}
      {/* <p>Employee: {getEmployeeName(PeopleId)}</p>
      <p>Total hours: {getEmloyeeHours(PeopleId)}</p>
      {console.log(`Employee Selected: ${getEmployeeName(PeopleId)}\nTotal hours: ${getEmloyeeHours(PeopleId)}\nUser Id: ${PeopleId}\n\nProject Selected: ${getProjectName(ProjectId)}\nProject Id: ${ProjectId}`)} */}
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

  console.log(response.results);

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

  console.log(response.results);

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
  console.log(response.results);

  return response.results;
}