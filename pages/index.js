import { Client } from "@notionhq/client";
import { useState } from "react";
import Head from "next/head";

import "react-datepicker/dist/react-datepicker.css";
import styles from '../styles/Home.module.css';

const HomePage = (props) => {

  console.log(props.data[1])

// #region Get information from notion database
  // Get every Employee.
  const getEmployeeInfo = () => {
    const employees = [];
    props.data[1].forEach(employee => {
      employees.push({
        id: employee.id,
        employee: employee.properties.Name.title[0].plain_text,
        role: employee.properties.Role.rich_text[0].plain_text,
        total_hours: employee.properties['Total hours'].rollup.number});
    });
    return employees
  };

  // Get every Project.
  const getProjectsInfo = () => {
    const projects = [];
    props.data[0].forEach(project => {
      projects.push({
        id: project.id,
        projectName: project.properties.Projectname.title[0].plain_text,
        status: project.properties.Status.select.name,
      });
    });
    return projects;
  };

  // Get every Timereport.
  const getTimereportsInfo = () => {
    const reports = [];
    props.data[2].forEach(report => {
      reports.push({
        date: report.properties.Date.date.start,
        hours: report.properties.Hours.number,
        note: report.properties.Note.title[0].plain_text,
        person: report.properties.Person.relation[0].id,
        project: report.properties.Project.relation[0].id,
      })
    })
    return reports;
  }
// #endregion

// #region Drop Downs
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

  const dropdownStatus = () => {
    const projects = [];
    getProjectsInfo().forEach(element => {
      projects.push(<option value={element.status} key={element.id}>{element.status}</option>)
    });
    return projects;
  };
// #endregion

// #region Page display functions
  const getEmployeeReports = (status) => {
    let reportArray = [];
    //debugger;
    getTimereportsInfo().forEach(report => {
      if (PeopleId === report.person) {
        getProjectsInfo().forEach(project => {
          if (project.status === status) {
            if (project.id === report.project) {
              reportArray.push(<div>
                <h3>{project.projectName}</h3>
                <p>{report.date}</p>
                <p>{report.hours}</p>
                <p>{report.note}</p>
            </div>);
            };
          };
        });
      };
    });
    return reportArray;
  };

  const getEmployeeRole = (person) => {
    let currentEmployee;
    getEmployeeInfo().forEach(employee => {
      if (person === employee.id) {
        currentEmployee = employee.role;
      };
    });
    return currentEmployee;
  }

  const displayPage = (role) => {
      if (role === "Employee") {
        return <div>
          <div>
            <form onSubmit={submitForm}>
              <label htmlFor="date-selecter">Date for Report: </label>
              <br/>
              <input
                type="date"
                name="date-selecter"
                value={ReportDate}
                onChange={e => setReportDate(e.target.value)}
                required/>
              <br/>
              <label htmlFor="hours">Hours Worked: </label>
              <br/>
              <input
                type="number"
                name="hours"
                value={WorkedHours}
                onChange={e => setWorkedHours(Number(e.target.value))}
                required/>
              <br/>
              <label htmlFor="projects">Projects: </label>
              <br/>
              <select name="projects" value={ProjectId} onChange={e => setProjectId(e.target.value)}>
                <option disabled selected>Select Project</option>
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
                required/>
              <br/>
              <br/>
              <button type="submit">Submit Report</button>
            </form>
          </div>

          <div>
            <form>
              <select name="project-status" value={ProjectStatus} onChange={e => setProjectStatus(e.target.value)}>
                <option disabled selected>Select project status</option>
                {dropdownStatus()}
              </select>
            </form>
            {getEmployeeReports(ProjectStatus)}
          </div>
        </div>
      };
      if (role === "Boss") {
        return <div>

        </div>
      };
      if (role === "Project Leader") {
        return <div>

        </div>
      };
      if (role === "Owner") {
        return <div>

        </div>
      };
  };
// #endregion

// #region Old Stuff
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

  // const getEmployeeProjectsStatus = (status) => {
  //   const projects = [];
  //   getProjectsInfo().forEach(project => {
  //     if (project.status === status) {
  //       projects.push(<p>{project.projectName}</p>)
  //     };
  //   })
  //   return projects;
  // }
// #endregion

// #region Submit Forms
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
// #endregion

// #region UseStates
  const [PeopleId, setPeopleId] = useState("Select Employee");
  const [ProjectId, setProjectId] = useState("Select Project");
  const [ReportDate, setReportDate] = useState(new Date());
  const [WorkedHours, setWorkedHours] = useState(null);
  const [Notes, setNotes] = useState("");
  const [ProjectStatus, setProjectStatus] = useState("Select project status");
// #endregion

// #region Main Page Render
  return <div className={styles.content}>
    <Head>
        <title>Nexus Time Reports</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </Head>
    <main>
      <div className={styles.homePageHeader}>
        <h1>Nexus</h1>
        <p className={styles.meaning}>(ˈnɛksəs) n, pl. A means of connection between members of a group or things in a series.</p>
        <h2>Time reports</h2>
      </div>

      <div className={styles.homePageContent}>
        <div> 
          <form>
            <label htmlFor="employees">Employee: </label>
            <br/>
            <select name="employees" value={PeopleId} onChange={e => setPeopleId(e.target.value)}>
              <option disabled selected>Select Employee</option>
              {dropdownNames()}
            </select>
          </form>
        </div>

        {/* <div>
          <form onSubmit={submitForm}>
            <label htmlFor="date-selecter">Date for Report: </label>
            <br/>
            <input
              type="date"
              name="date-selecter"
              value={ReportDate}
              onChange={e => setReportDate(e.target.value)}
              required/>
            <br/>
            <label htmlFor="hours">Hours Worked: </label>
            <br/>
            <input
              type="number"
              name="hours"
              value={WorkedHours}
              onChange={e => setWorkedHours(Number(e.target.value))}
              required/>
            <br/>
            <label htmlFor="projects">Projects: </label>
            <br/>
            <select name="projects" value={ProjectId} onChange={e => setProjectId(e.target.value)}>
              <option disabled selected>Select Project</option>
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
              required/>
            <br/>
            <br/>
            <button type="submit">Submit Report</button>
          </form>
        </div> */}
        {/* {console.log(props.data)} */}
        {/* <div>
          <form>
            <select name="project-status" value={ProjectStatus} onChange={e => setProjectStatus(e.target.value)}>
              <option disabled selected>Select project status</option>
              {dropdownStatus()}
            </select>
          </form>
          {getEmployeeReports(ProjectStatus)}
        </div> */}
        {displayPage(getEmployeeRole(PeopleId))}
      </div>
    </main>
    <footer className={styles.footer}>Created by: Team Panda</footer>
  </div>;
// #endregion
};

export default HomePage;

// #region Getting from notion API
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
// #endregion